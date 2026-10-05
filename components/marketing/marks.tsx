"use client";

import { Package } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { formatUsd } from "@/lib/utils";

/* ── Inline-SVG fake-company wordmarks for the trusted-by row ───────────────── */
export function CompanyMark({ name }: { name: string }) {
  const glyphs: Record<string, React.ReactNode> = {
    Northwind: <path d="M3 17 L9 4 L12 11 L15 4 L21 17" />,
    Parable: <circle cx="12" cy="11" r="7" />,
    Formwork: <path d="M4 5 h16 v4 h-6 v9 h-4 v-9 h-6 z" />,
    Cedarworks: <path d="M12 3 L20 18 H4 Z M12 9 L16 17 H8 Z" />,
    Lumen: <path d="M6 4 v14 h10" />,
    Harvest: <path d="M12 4 c5 4 5 10 0 14 c-5 -4 -5 -10 0 -14 z" />,
    Brightline: <path d="M4 12 h16 M12 5 v14" />,
    Meridian: <path d="M4 18 L9 6 L12 14 L15 6 L20 18" />,
  };
  return (
    <span className="inline-flex items-center gap-2 text-muted-foreground/70">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {glyphs[name]}
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">{name}</span>
    </span>
  );
}

/* ── Hero product-preview card: a mini buyer order screen ──────────────────── */
export function ProductPreview() {
  const { lang } = useLang();
  const rows = [
    { name: lang === "tr" ? "Tek Köken Kahve 250g" : "Single-Origin Coffee 250g", sku: "CFE-250", qty: 144, unit: 8.4 },
    { name: lang === "tr" ? "Demlik Çay Kutusu 100g" : "Loose-Leaf Tea Tin 100g", sku: "TEA-100", qty: 96, unit: 6.2 },
    { name: lang === "tr" ? "Seramik Kupa — 12'li" : "Ceramic Mug — Case of 12", sku: "MUG-12", qty: 48, unit: 21.0 },
  ];
  const total = rows.reduce((s, r) => s + r.qty * r.unit, 0);

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-4 shadow-pop sm:p-5">
      {/* header — buyer + tier */}
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[10px] font-bold text-white" style={{ backgroundImage: "var(--grad-brand)" }}>
          NG
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-tight">Northwind Grocers</p>
          <p className="text-[11px] text-muted-foreground">{lang === "tr" ? "Gold kademe · Net 30" : "Gold tier · Net 30"}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">-48%</span>
      </div>

      {/* line items */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-[1.6fr_auto_auto] gap-2 border-b border-border bg-muted/40 px-3 py-2 label-mono text-muted-foreground">
          <span>{lang === "tr" ? "Ürün" : "Product"}</span>
          <span className="text-right">{lang === "tr" ? "Adet" : "Qty"}</span>
          <span className="text-right">{lang === "tr" ? "Tutar" : "Amount"}</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.sku}
            className={`grid grid-cols-[1.6fr_auto_auto] items-center gap-2 px-3 py-2.5 ${i === 0 ? "bg-primary/[0.04]" : ""} ${i < rows.length - 1 ? "border-b border-border/60" : ""}`}
          >
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <Package className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold leading-tight">{r.name}</p>
                <p className="tnum truncate text-[10px] text-muted-foreground">{r.sku} · {formatUsd(r.unit)}</p>
              </div>
            </div>
            <p className="tnum text-right text-[12px] font-medium">{r.qty}</p>
            <p className="tnum text-right text-[12px] font-semibold">{formatUsd(r.qty * r.unit)}</p>
          </div>
        ))}
      </div>

      {/* total + CTA */}
      <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5">
        <span className="text-[12px] font-medium text-muted-foreground">{lang === "tr" ? "Sipariş toplamı" : "Order total"}</span>
        <span className="tnum text-[15px] font-bold">{formatUsd(total)}</span>
      </div>
      <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground">
        {lang === "tr" ? "Siparişi ver" : "Place order"}
        <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">288 {lang === "tr" ? "ad." : "u"}</span>
      </button>
    </div>
  );
}
