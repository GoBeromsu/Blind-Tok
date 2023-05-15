const escapeTag = (value: string) => {
  return value?.replace(/&/g, "&amp;")?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;")?.replace(/\n/g, "\\n");
  // return value?.replaceAll("&", "&amp;")?.replaceAll("<", "&lt;")?.replaceAll(">", "&gt;");
};
const unescapeTag = (value: string) => {
  return value?.replace(/&lt;/g, "<")?.replace(/&gt;/g, ">")?.replace(/&amp;/g, "&")?.replace(/\n/g, "\n");
};
export const xssFilter = (text: string) => {
  if (typeof text == "string") {
    return escapeTag(text);
  } else {
    return text;
  }
};
export const unescape = (text: string) => {
  if (typeof text == "string") {
    return unescapeTag(text);
  } else {
    return text;
  }
};
