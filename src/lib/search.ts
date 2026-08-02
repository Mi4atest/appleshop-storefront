import { getProductTitle, type PublicProduct } from "@/lib/api";

export function normalizeSearchQuery(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}\s/+.-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function productMatchesQuery(
  product: PublicProduct,
  query: string,
): boolean {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return true;

  const haystack = normalizeSearchQuery(
    [
      product.name,
      product.display_label ?? "",
      product.collection_name ?? "",
      getProductTitle(product),
    ].join(" "),
  );

  const tokens = normalized.split(" ").filter(Boolean);
  return tokens.every((token) => haystack.includes(token));
}

export function filterProductsByQuery(
  products: PublicProduct[],
  query: string,
): PublicProduct[] {
  return products.filter((product) => productMatchesQuery(product, query));
}
