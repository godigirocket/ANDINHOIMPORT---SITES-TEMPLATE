/** Slug de URL a partir do título real do produto — sem depender de um campo slug no banco. */
export function slugify(text: string): string {
  return text
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
