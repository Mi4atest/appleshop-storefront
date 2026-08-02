type ProductPlaceholderProps = {
  title: string;
};

export function ProductPlaceholder({ title }: ProductPlaceholderProps) {
  return (
    <div className="flex aspect-[3/4] w-full items-center justify-center bg-neutral-100 px-4">
      <p className="line-clamp-4 text-center text-[11px] font-bold uppercase leading-relaxed tracking-[0.14em] text-neutral-400">
        {title}
      </p>
    </div>
  );
}
