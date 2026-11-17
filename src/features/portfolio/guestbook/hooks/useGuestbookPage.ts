import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { fetchGuestbookPage } from '../services/guestbookClientApi';
import { GuestbookMessage, GuestbookResponse } from '../type';
import { parseGuestbookPage } from '../utils/guestbookPage';

const PAGE_CHANGE_EVENT = 'guestbook:pagechange';
const FIRST_PAGE = 1;

const PAGE_HASH_PREFIX = '#page=';

interface FetchedPage {
  page: number;
  response: GuestbookResponse;
}

interface UseGuestbookPageResult {
  guestbook: GuestbookMessage[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  hasError: boolean;
  goToPage: (page: number) => void;
  refresh: () => Promise<void>;
}

type HistoryMode = 'push' | 'replace';

const subscribeToPageChange = (onChange: () => void): (() => void) => {
  window.addEventListener('popstate', onChange);
  window.addEventListener(PAGE_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(PAGE_CHANGE_EVENT, onChange);
  };
};

const getPageFromUrl = (): number => {
  const { hash } = window.location;
  const rawPage = hash.startsWith(PAGE_HASH_PREFIX) ? hash.slice(PAGE_HASH_PREFIX.length) : null;

  return parseGuestbookPage(rawPage) ?? FIRST_PAGE;
};

// 정적(ISR) HTML은 항상 1페이지 기준으로 생성된다.
const getServerPage = (): number => FIRST_PAGE;

const writePageToUrl = (page: number, mode: HistoryMode): void => {
  const url = new URL(window.location.href);
  url.hash = page === FIRST_PAGE ? '' : `page=${page}`;

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  if (mode === 'push') {
    window.history.pushState(null, '', nextUrl);
  } else {
    window.history.replaceState(null, '', nextUrl);
  }
  window.dispatchEvent(new Event(PAGE_CHANGE_EVENT));
};

/**
 * 방명록 페이지네이션 상태.
 * - 현재 페이지는 URL 해시 `#page=N`이 단일 출처 (뒤로/앞으로 가기, 새로고침, 링크 공유 유지)
 * - 1페이지: 서버(ISR HTML)가 내려준 initialGuestbook 사용. 변경 시 revalidatePath('/')로 갱신됨
 * - 2페이지 이상: GET /api/guestbook으로 클라이언트 조회
 */
const useGuestbookPage = (initialGuestbook: GuestbookResponse): UseGuestbookPageResult => {
  const [fetchedPage, setFetchedPage] = useState<FetchedPage | null>(null);
  const [failedPage, setFailedPage] = useState<number | null>(null);
  const [shownResponse, setShownResponse] = useState<GuestbookResponse>(initialGuestbook);

  const controllerRef = useRef<AbortController | null>(null);

  const currentPage = useSyncExternalStore(subscribeToPageChange, getPageFromUrl, getServerPage);

  const abortPendingRequest = useCallback((): void => {
    controllerRef.current?.abort();
  }, []);

  // 페이지 이동, 변경(수정/삭제) 후 재조회, 재시도가 모두 이 함수를 쓴다.
  // 새 요청을 시작하면 이전 요청은 취소되어, 늦게 도착한 응답이 화면이나 URL을 덮어쓰지 않는다.
  const loadPage = useCallback(
    async (page: number): Promise<void> => {
      abortPendingRequest();
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        let loadedPage = page;
        let response = await fetchGuestbookPage(page, controller.signal);

        // 범위를 벗어난 경우(마지막 페이지의 마지막 글 삭제, 직접 입력한 URL 등) 마지막 페이지를
        // 미리 조회해 둔 뒤 URL을 교체한다. (옛 목록이 잠깐 보이는 것을 방지)
        // 1페이지는 initialGuestbook(revalidatePath로 갱신됨)을 쓰므로 조회하지 않는다.
        if (page > response.totalPages) {
          loadedPage = Math.max(FIRST_PAGE, response.totalPages);
          if (loadedPage !== FIRST_PAGE) {
            response = await fetchGuestbookPage(loadedPage, controller.signal);
          }
        }

        setFetchedPage({ page: loadedPage, response });
        setFailedPage(null);
        if (loadedPage !== page) writePageToUrl(loadedPage, 'replace');
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('[useGuestbookPage.loadPage] Failed to fetch guestbook page:', error);
        setFailedPage(page);
      }
    },
    [abortPendingRequest],
  );

  useEffect(() => {
    if (currentPage === FIRST_PAGE) return;

    // loadPage의 setState는 await 이후에만 실행되지만, 직접 호출하면 react-hooks/set-state-in-effect가 오탐한다.
    const syncPage = async (): Promise<void> => {
      await loadPage(currentPage);
    };
    void syncPage();
    return abortPendingRequest;
  }, [currentPage, loadPage, abortPendingRequest]);

  const goToPage = useCallback(
    (page: number): void => {
      if (page === currentPage) return;
      writePageToUrl(page, 'push');
    },
    [currentPage],
  );

  // 1페이지는 Server Action의 revalidatePath('/')가 갱신하므로 2페이지 이상만 재조회한다.
  const refresh = useCallback(async (): Promise<void> => {
    if (currentPage === FIRST_PAGE) return;
    await loadPage(currentPage);
  }, [currentPage, loadPage]);

  const isFirstPage = currentPage === FIRST_PAGE;
  const fetchedResponse = fetchedPage?.page === currentPage ? fetchedPage.response : null;
  const currentResponse = isFirstPage ? initialGuestbook : fetchedResponse;
  const hasError = !isFirstPage && failedPage === currentPage;
  const isLoading = currentResponse === null && !hasError;

  // 다음 페이지를 불러오는 동안에는 직전에 화면에 보여준 목록을 유지해 레이아웃 흔들림을 막는다.
  if (currentResponse !== null && currentResponse !== shownResponse) {
    setShownResponse(currentResponse);
  }
  const displayedResponse = currentResponse ?? shownResponse;

  return {
    guestbook: displayedResponse.data,
    totalCount: displayedResponse.totalCount,
    totalPages: displayedResponse.totalPages,
    currentPage,
    isLoading,
    hasError,
    goToPage,
    refresh,
  };
};

export default useGuestbookPage;
