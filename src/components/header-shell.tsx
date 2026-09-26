import { BrandMark } from "@/components/brand-mark";
import { BagIcon, SearchIcon } from "@/components/icons";

/** Static header placeholder for Suspense fallback (no useSearchParams). */
export function HeaderShell() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 bg-neutral-50">
        <p className="px-3 py-1.5 text-center text-[10px] uppercase tracking-[0.16em] text-neutral-500 md:px-6 lg:px-8">
          Доставка и самовывоз в Кирове
        </p>
      </div>
      <div className="flex h-12 items-center gap-2 px-3 md:hidden">
        <div className="min-w-0 flex-1">
          <BrandMark showWordmark />
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center">
          <SearchIcon />
        </span>
      </div>
      <div className="hidden h-14 items-center gap-6 px-6 md:flex lg:px-8">
        <BrandMark showWordmark />
        <div className="min-w-0 flex-1" />
        <span className="inline-flex h-10 w-10 items-center justify-center">
          <SearchIcon />
        </span>
        <span className="inline-flex h-10 w-10 items-center justify-center">
          <BagIcon />
        </span>
      </div>
    </header>
  );
}
