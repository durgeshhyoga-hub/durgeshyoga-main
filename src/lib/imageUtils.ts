/**
 * Converts various image URL formats to direct display URLs
 * Supports Google Drive share links
 */
export function getDirectImageUrl(url: string): string {
  if (!url) return url;

  // Prefer Google Drive thumbnail URLs for reliable <img> rendering.
  // Note: the Drive file must be shared as "Anyone with the link" to load publicly.
  const patterns: RegExp[] = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?(?:export=(?:view|download)&)?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/,
    /lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/,
  ];

  for (const re of patterns) {
    const match = url.match(re);
    if (match?.[1]) {
      const id = match[1];
      return `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
    }
  }

  // Return URL as-is for other formats (direct URLs, Lovable Cloud storage, etc.)
  return url;
}
