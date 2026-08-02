import { BrandMark } from "@/components/brand-mark";
import { BagIcon, MenuIcon, SearchIcon } from "@/components/icons";

/** Static header placeholder for Suspense fallback (no useSearchParams). */
export function HeaderShell() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="flex h-12 items-center gap-1 px-2 md:h-14 md:px-6">
        <div className="flex w-10 shrink-0 justify-start md:w-12">
          <span className="inline-flex h-10 w-10 items-center justify-center">
            <MenuIcon />
          </span>
        </div>
        <div className="flex min-w-0 flex-1 justify-center px-1">
          <BrandMark showWordmark />
        </div>
        <div className="flex w-[5.25rem] shrink-0 justify-end md:w-[8.5rem]">
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
