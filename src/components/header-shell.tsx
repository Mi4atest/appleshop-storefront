import { BrandMark } from "@/components/brand-mark";
import { BagIcon, MenuIcon, SearchIcon } from "@/components/icons";

/** Static header placeholder for Suspense fallback (no useSearchParams). */
export function HeaderShell() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="hidden border-b border-neutral-100 bg-neutral-50 md:block">
        <p className="px-6 py-1.5 text-center text-[10px] uppercase tracking-[0.16em] text-neutral-500 lg:px-8">
          Доставка и самовывоз в Кирове
        </p>
      </div>
      <div className="flex h-12 items-center gap-2 px-2 md:h-14 md:gap-6 md:px-6 lg:px-8">
        <div className="flex w-10 shrink-0 justify-start md:hidden">
          <span className="inline-flex h-10 w-10 items-center justify-center">
            <MenuIcon />
          </span>
        </div>
        <div className="flex min-w-0 flex-1 justify-center md:flex-none md:justify-start">
          <BrandMark showWordmark />
        </div>
        <div className="hidden min-w-0 flex-1 md:block" />
        <div className="flex w-[5.25rem] shrink-0 justify-end md:w-auto">
          <span className="inline-flex h-10 w-10 items-center justify-center">
            <SearchIcon />
          </span>
          <span className="inline-flex h-10 w-10 items-center justify-center">
            <BagIcon />
          </span>
        </div>
      </div>
    </header>
  );
}
