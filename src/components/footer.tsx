import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/#contact", label: "Контакты" },
  { href: "/#shipping", label: "Доставка" },
  { href: "/#returns", label: "Обмен и возврат" },
  { href: "https://t.me/AppleShop43", label: "Telegram", external: true },
];

export function Footer() {
  return (
    <footer
      id="contact"
      className="mt-auto bg-[#0a0a0a] px-6 py-14 text-white md:px-10 md:py-16"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10">
        <nav className="flex flex-col items-center gap-4" aria-label="Подвал">
          {FOOTER_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold uppercase tracking-[0.22em] transition-opacity hover:opacity-60"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-bold uppercase tracking-[0.22em] transition-opacity hover:opacity-60"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div id="shipping" className="max-w-md text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-300">
            Доставка и самовывоз в Кирове
          </p>
        </div>

        <div id="returns" className="max-w-md text-center">
          <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
            Условия обмена и возврата уточняйте у менеджера перед покупкой
          </p>
        </div>

        <div id="about" className="max-w-md text-center">
          <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
            AppleShop — техника Apple в Кирове. Новые устройства и проверенные
            б/у.
          </p>
        </div>

        <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">
          © {new Date().getFullYear()} AppleShop
        </p>
      </div>
    </footer>
  );
}
