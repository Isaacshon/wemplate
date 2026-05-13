export const referenceSources = [
  "https://www.awwwards.com/",
  "https://www.cssdesignawards.com/",
  "https://m2.material.io/",
  "https://www.behance.net/",
  "https://www.gdweb.co.kr/main/",
  "https://www.pinterest.com/",
  "https://www.surfit.io/explore/design/inspiration",
  "http://bm.s5-style.com/",
  "https://www.siteinspire.com/",
  "https://sitesee.co/",
  "https://thefwa.com/",
  "https://uiverse.io/",
  "https://cssfx.netlify.app/",
  "https://dribbble.com/",
  "https://marketplace.savee.com/",
  "https://httpster.net/",
  "https://cargo.site/templates",
  "https://notefolio.net/",
  "https://refero.design/",
  "https://land-book.com/",
] as const;

export function isAllowedReferenceUrl(value: string) {
  try {
    const candidate = new URL(value);
    return referenceSources.some((source) => {
      const sourceHost = new URL(source).hostname.replace(/^www\./, "");
      const candidateHost = candidate.hostname.replace(/^www\./, "");
      return candidateHost === sourceHost || candidateHost.endsWith(`.${sourceHost}`);
    });
  } catch {
    return false;
  }
}
