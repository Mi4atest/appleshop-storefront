export type ProductKind = "used" | "new";

/** Normalized outbound links from warehouse (product fields coalesced with post). */
export type PublicProductLinks = {
  telegram?: string | null;
  vk_market?: string | null;
  vk_post?: string | null;
  max?: string | null;
  max_link?: string | null;
  max_share_url?: string | null;
  instagram?: string | null;
  avito?: string | null;
};

export type PublicProduct = {
  id: number;
  name: string;
  display_label: string | null;
  price: string | null;
  collection_name: string | null;
  kind: ProductKind;
  status: string;
  availability_status: string | null;
  image_urls: string[];
  video_urls: string[];
  storage_path: string | null;
  telegram_link: string | null;
  vk_product_id?: number | null;
  vk_product_link: string | null;
  vk_post_link?: string | null;
  max_link?: string | null;
  max_share_url: string | null;
  instagram_link?: string | null;
  avito_item_id?: string | number | null;
  avito_url: string | null;
  links?: PublicProductLinks | null;
  created_at: string | null;
  /** Reserved for future warehouse API field */
  description?: string | null;
};

export type PublicProductList = {
  items: PublicProduct[];
  total: number;
  kind: ProductKind;
};

export type FetchProductsResult =
  | { ok: true; data: PublicProductList }
  | { ok: false; error: string; kind: ProductKind };

const DEFAULT_API_BASE = "https://appleshop.ap43.ru";
const PAGE_LIMIT = 100;

function getApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE?.trim() || DEFAULT_API_BASE;
  return raw.replace(/\/+$/, "");
}

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${getApiBase()}${path}`;
  const response = await fetch(url, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`API ${response.status} for ${path}`);
  }

  return (await response.json()) as T;
}

export async function checkPublicHealth(): Promise<boolean> {
  try {
    const data = await fetchJson<{ ok: boolean }>(`/api/public/health`);
    return Boolean(data.ok);
  } catch {
    return false;
  }
}

export async function fetchProductsByKind(
  kind: ProductKind,
  options?: { limit?: number; skip?: number },
): Promise<FetchProductsResult> {
  const limit = options?.limit ?? PAGE_LIMIT;
  const skip = options?.skip ?? 0;

  try {
    const data = await fetchJson<PublicProductList>(
      `/api/public/products?kind=${kind}&limit=${limit}&skip=${skip}&status_filter=active`,
    );
    return { ok: true, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось загрузить каталог";
    return { ok: false, error: message, kind };
  }
}

export async function fetchAllProductsByKind(
  kind: ProductKind,
): Promise<FetchProductsResult> {
  const first = await fetchProductsByKind(kind, { limit: PAGE_LIMIT, skip: 0 });
  if (!first.ok) return first;

  const items = [...first.data.items];
  const total = first.data.total;

  while (items.length < total) {
    const page = await fetchProductsByKind(kind, {
      limit: PAGE_LIMIT,
      skip: items.length,
    });
    if (!page.ok) return page;
    if (page.data.items.length === 0) break;
    items.push(...page.data.items);
  }

  return {
    ok: true,
    data: {
      items,
      total,
      kind,
    },
  };
}

export function getProductTitle(product: PublicProduct): string {
  return product.display_label?.trim() || product.name;
}

export type FetchProductResult =
  | { ok: true; data: PublicProduct }
  | { ok: false; error: string };

export async function fetchProductById(
  id: number,
): Promise<FetchProductResult> {
  try {
    const data = await fetchJson<PublicProduct>(`/api/public/products/${id}`);
    return { ok: true, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось загрузить товар";
    return { ok: false, error: message };
  }
}
