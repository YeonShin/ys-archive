export const isVideoUrl = (url: string): boolean => /\.(mp4|webm)(\?|#|$)/i.test(url);
