import type { PublicProduct } from "@/lib/api";
import { extractModel } from "@/lib/product-attrs";

function modelFamily(model: string | null): string | null {
  if (!model) return null;
  return model
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\b(pro max|pro|plus|max|air|mini|ultra)\b/g, "")
    .trim();
}

/**
 * Rank related SKUs: same model first, then collection / family / kind.
 */
export function selectSimilarProducts(
  product: PublicProduct,
  pool: PublicProduct[],
  limit = 8,
): PublicProduct[] {
  const model = extractModel(product);
  const family = modelFamily(model);
  const collection = product.collection_name?.trim().toLowerCase() || null;

  const ranked = pool
    .filter((item) => item.id !== product.id)
    .map((item) => {
      let score = 0;
      const itemModel = extractModel(item);
      const itemFamily = modelFamily(itemModel);
      const itemCollection =
        item.collection_name?.trim().toLowerCase() || null;

      if (model && itemModel && model === itemModel) score += 8;
      else if (
        model &&
        itemModel &&
        (itemModel.includes(model) || model.includes(itemModel))
      ) {
        score += 5;
      } else if (family && itemFamily && family === itemFamily) {
        score += 3;
      }

      if (collection && itemCollection && collection === itemCollection) {
        score += 4;
      }
      if (item.kind === product.kind) score += 1;

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.item.id - a.item.id);

  return ranked.slice(0, limit).map((entry) => entry.item);
}
