"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Package, Boxes } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatUsd, formatNumber } from "@/lib/utils";
import { products } from "@/lib/demo/data";

export default function CatalogPage() {
  const { t, lang } = useLang();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of products) seen.set(t(p.category), t(p.category));
    return ["all", ...Array.from(seen.keys())];
  }, [t]);

  const rows = products.filter(
    (p) =>
      (cat === "all" || t(p.category) === cat) &&
      (!query || p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="mx-auto max-w-[1200px] animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{lang === "tr" ? "Ürün kataloğu" : "Product catalog"}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {lang === "tr" ? "Kademeli toptan fiyat, MOQ ve stok seviyeleri." : "Tiered wholesale pricing, MOQ and stock levels."}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
            <Plus className="h-4 w-4" />
            {lang === "tr" ? "Ürün ekle" : "Add product"}
          </button>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: lang === "tr" ? "Ürün (SKU)" : "Products (SKUs)", value: formatNumber(products.length) },
          { label: lang === "tr" ? "Kategori" : "Categories", value: formatNumber(categories.length - 1) },
          { label: lang === "tr" ? "Toplam stok" : "Total stock", value: formatNumber(products.reduce((s, p) => s + p.stock, 0)) },
          { label: lang === "tr" ? "Düşük stok" : "Low stock", value: formatNumber(products.filter((p) => p.stock < 800).length) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[12.5px] font-medium text-muted-foreground">{s.label}</p>
            <p className="mt-2 tnum text-xl font-bold leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => {
            const active = cat === c;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full px-3 py-1 text-[12.5px] font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:bg-muted",
                )}
              >
                {c === "all" ? (lang === "tr" ? "Tümü" : "All") : c}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "tr" ? "Ürün veya SKU…" : "Product or SKU…"}
            className="w-32 bg-transparent placeholder:text-muted-foreground/70 focus:outline-none sm:w-44"
          />
        </div>
      </div>

      {/* Product grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((p) => {
          const low = p.stock < 800;
          return (
            <div key={p.sku} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Package className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[14px] font-semibold leading-tight">{p.name}</h3>
                  <p className="tnum truncate text-[11.5px] text-muted-foreground">{p.sku} · {t(p.category)}</p>
                </div>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", low ? "bg-warning/15 text-warning-foreground" : "bg-success/10 text-success")}>
                  {low ? (lang === "tr" ? "düşük" : "low") : (lang === "tr" ? "stokta" : "in stock")}
                </span>
              </div>

              {/* Price breaks */}
              <div className="mt-4 space-y-1.5">
                {p.breaks.map((b, i) => {
                  const best = i === p.breaks.length - 1;
                  const next = p.breaks[i + 1];
                  const range = next ? `${b.min}–${next.min - 1}` : `${b.min}+`;
                  return (
                    <div key={b.min} className={cn("flex items-center justify-between rounded-lg border px-3 py-1.5 text-[12.5px]", best ? "border-primary/40 bg-primary/[0.05]" : "border-border bg-muted/30")}>
                      <span className="tnum text-muted-foreground">{range} {lang === "tr" ? "ad." : "u"}</span>
                      <span className="tnum font-semibold">{formatUsd(b.price)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Footer meta */}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[12px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Boxes className="h-3.5 w-3.5" />
                  {lang === "tr" ? "Koli" : "Case"} {p.caseSize} · MOQ {p.moq}
                </span>
                <span className="tnum">{formatNumber(p.stock)} {lang === "tr" ? "stok" : "in stock"}</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">MSRP <span className="tnum line-through">{formatUsd(p.msrp)}</span></p>
            </div>
          );
        })}
        {rows.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
            {lang === "tr" ? "Bu filtreyle ürün yok." : "No products match this filter."}
          </p>
        )}
      </div>
    </div>
  );
}
