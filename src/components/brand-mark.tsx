import Image from "next/image";
import Link from "next/link";

type BrandMarkProps = {
  size?: "sm" | "md";
  showWordmark?: boolean;
};

export function BrandMark({
  size = "sm",
  showWordmark = false,
}: BrandMarkProps) {
  const px = size === "md" ? 40 : 32;

  return (
    <Link
      href="/"
      className="inline-flex min-w-0 items-center justify-center gap-2"
      aria-label="AppleShop — на главную"
    >
      <Image
        src="/brand/logo.png"
        alt="AppleShop"
        width={px}
        height={px}
        className="h-8 w-8 rounded-full object-cover md:h-10 md:w-10"
        priority
      />
      {showWordmark ? (
        <span className="hidden truncate text-sm font-bold uppercase tracking-[0.18em] lg:inline">
          AppleShop
        </span>
      ) : null}
    </Link>
  );
}
