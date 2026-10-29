import type { PublicProduct } from "@/lib/api";
import { getAvailabilityLabel, getKindLabel } from "@/lib/labels";
import {
  extractColor,
  extractModel,
  extractStorage,
  formatStorageLabel,
} from "@/lib/product-attrs";

type SpecRow = { label: string; value: string };

export function buildProductSpecs(product: PublicProduct): SpecRow[] {
  const rows: SpecRow[] = [];
  const model = extractModel(product);
  const storage = extractStorage(product);
  const color = extractColor(product);
  const availability = getAvailabilityLabel(product.availability_status);

  if (model) rows.push({ label: "Модель", value: model });
  if (storage) rows.push({ label: "Память", value: formatStorageLabel(storage) });
  if (color) rows.push({ label: "Цвет", value: color.label });
  rows.push({ label: "Тип", value: getKindLabel(product.kind) });
  if (availability) rows.push({ label: "Наличие", value: availability });
  if (product.collection_name) {
    rows.push({ label: "Коллекция", value: product.collection_name });
  }
  if (product.name && product.name !== model) {
    rows.push({ label: "Название", value: product.name });
  }

  return rows;
}

type ProductSpecsProps = {
  product: PublicProduct;
};

export function ProductSpecs({ product }: ProductSpecsProps) {
  const rows = buildProductSpecs(product);
  if (rows.length === 0) return null;

  return (
    <section className="border-t border-neutral-200 pt-6">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em]">
        Характеристики
      </h2>
      <dl className="mt-4 grid grid-cols-1 gap-0 text-sm">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 border-b border-neutral-100 py-3 sm:grid-cols-[8.5rem_1fr] sm:items-baseline sm:gap-4"
          >
            <dt className="text-neutral-500">{row.label}</dt>
            <dd className="break-words font-medium text-neutral-900 sm:text-right">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
