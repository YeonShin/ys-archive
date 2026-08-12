/**
 * 날짜 문자열을 지정된 포맷으로 변환하는 유틸리티 함수.
 *
 * @param dateString - 변환할 날짜 문자열 (예: '2023-08-01') / null일 경우 '현재' 반환
 * @param options.separator - 년/월/일을 구분할 문자 (기본값: '.')
 * @param options.includeDay - 일(Day)까지 표시할지 여부 (기본값: false, 년/월만 표시)
 */
export const formatDate = (
  dateString: string | null | undefined,
  options?: { separator?: string; includeDay?: boolean },
) => {
  if (!dateString || dateString.length < 7) return '현재';

  const separator = options?.separator ?? '.';
  const includeDay = options?.includeDay ?? false;

  const length = includeDay ? 10 : 7;
  const slicedDate = dateString.slice(0, length);

  return slicedDate.replaceAll('-', separator);
};

/**
 * 두 날짜 문자열 사이의 기간을 주(week) 단위로 계산하는 유틸리티 함수.
 * @param startDate - 시작 날짜
 * @param endDate - 종료 날짜 (없을 경우 현재 기준)
 * @returns 기간(주 단위) (예: 12)
 */
export const calculateDurationInWeeks = (startDate: string, endDate?: string | null): number => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  // 날짜 파싱 실패 시 0 반환
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 0;
  }

  const diffMs = end.getTime() - start.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return Math.round(diffDays / 7);
};

/**
 * 주어진 날짜(Date) 객체를 MM/DD 문자열 포맷으로 반환하는 유틸리티 함수.
 * @param date - Date 객체
 * @returns MM/DD 형식의 문자열
 */
export const formatToKstDate = (date: Date): string => {
  return `${String(date.getUTCMonth() + 1).padStart(2, '0')}/${String(date.getUTCDate()).padStart(2, '0')}`;
};
