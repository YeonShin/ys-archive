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
  if (!dateString) return '현재';

  const separator = options?.separator ?? '.';
  const includeDay = options?.includeDay ?? false;

  const length = includeDay ? 10 : 7;
  const slicedDate = dateString.slice(0, length);

  return slicedDate.replaceAll('-', separator);
};
