import { Suspense } from "react";
import { Catalog } from "@/components/catalog";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeaderShell } from "@/components/header-shell";
import { fetchAllProductsByKind } from "@/lib/api";

export default async function HomePage() {
  const [usedResult, newResult] = await Promise.all([
    fetchAllProductsByKind("used"),
    fetchAllProductsByKind("new"),
  ]);

  const usedProducts = usedResult.ok ? usedResult.data.items : [];
  const newProducts = newResult.ok ? newResult.data.items : [];
  const usedError = usedResult.ok ? null : usedResult.error;
  const newError = newResult.ok ? null : newResult.error;
  const bothFailed = !usedResult.ok && !newResult.ok;
  const searchProducts = [...usedProducts, ...newProducts];

  return (
    <>
      <Suspense fallback={<HeaderShell />}>
        <Header searchProducts={searchProducts} />
      </Suspense>
      <main className="min-w-0 flex-1 overflow-x-hidden bg-white">
        {bothFailed ? (
          <div className="px-6 py-24 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em]">
              Каталог временно недоступен
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-neutral-500">
              Попробуйте обновить страницу чуть позже
            </p>
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="px-6 py-24 text-center text-xs uppercase tracking-[0.16em] text-neutral-500">
                Загрузка каталога…
              </div>
            }
          >
            <Catalog
              usedProducts={usedProducts}
              newProducts={newProducts}
              usedError={usedError}
              newError={newError}
            />
          </Suspense>
        )}
      </main>
      <Footer />
    </>
  );
}
