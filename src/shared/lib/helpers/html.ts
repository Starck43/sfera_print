export const cleanHtmlTags = (str: string) =>
    str?.replace(/<[^>]*>?/gm, '').replace(/\.([^ ])/g, '. $1')
