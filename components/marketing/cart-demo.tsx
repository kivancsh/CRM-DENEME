"use client";

import { useState } from "react";
import { Minus, Plus, Check, Package, AlertTriangle, ShoppingCart } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatUsd } from "@/lib/utils";
import { demoCatalog, demoPriceForQty } from "@/lib/demo/data";

/**
 * Interactive landing demo: a buyer builds a wholesale order. Quantities snap to
 * each product's case `step`; the unit price drops as quantity crosses price
 * breaks; a cart below MOQ can't check out. Pure useState, no deps.
 */
export function CartDemo() {
  const { t, lang } = useLang();
  const [qty, setQty] = useState<Record<string, number>>({ "CFE-250": 72, "TEA-100": 0, "MUG-12": 0 });
  const [placed, setPlaced] = useState(false);

  const lines = demoCatalog.map((item) => {
    const q = qty[item.sku] ?? 0;
    const unit = demoPriceForQty(item, Math.max(q, item.moq));
    return { item, q, unit, amount: q * unit, belowMoq: q > 0 && q < item.moq };
  });
  const total = lines.reduce((s, l) => s + l.amount, 0);
  const units = lines.reduce((s, l) => s + l.q, 0);
  const anyBelowMoq = lines.some((l) => l.belowMoq);
  const empty = units === 0;
  const canOrder = !empty && !anyBelowMoq;

  function bump(sku: string, dir: 1 | -1) {
    setPlaced(false);
    const item = demoCatalog.find((i) => i.sku === sku)!;
    setQty((prev) => {
      const next = Math.max(0, (prev[sku] ?? 0) + dir * item.step);
      return { ...prev, [sku]: next };
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-pop sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <ShoppingCart className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">{lang === "tr" ? "Toptan sepeti" : "Wholesale cart"}</p>
            <p className="text-xs text-muted-foreground">{lang === "tr" ? "Gold kademe fiyatı" : "Gold-tier pricing"}</p>
          </div>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">-48%</span>
      </div>

      {/* products */}
      <div className="mt-5 space-y-2.5">
        {lines.map(({ item, q, unit, amount, belowMoq }) => (
          <div key={item.sku} className={cn("rounded-xl border p-3 transition-colors", belowMoq ? "border-warning/50 bg-warning/[0.06]" : "border-border bg-muted/30")}>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-card text-primary shadow-pill">
                <Package className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold leading-tight">{t(item.name)}</p>
                <p className="tnum text-[11px] text-muted-foreground">
                  {item.sku} · {formatUsd(unit)}/{lang === "tr" ? "ad" : "u"} · MOQ {item.moq}
                </p>
              </div>
              {/* stepper */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => bump(item.sku, -1)}
                  aria-label="decrease"
                  className="grid h-7 w-7 place-items-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
                  disabled={q === 0}
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="tnum w-9 text-center text-[13px] font-semibold">{q}</span>
                <button
                  onClick={() => bump(item.sku, 1)}
                  aria-label="increase"
                  className="grid h-7 w-7 place-items-center rounded-md border border-border bg-card text-primary transition-colors hover:bg-muted"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="tnum w-16 text-right text-[13px] font-semibold">{formatUsd(amount)}</span>
            </div>
            {belowMoq && (
              <p className="mt-2 flex items-center gap-1.5 text-[11.5px] font-medium text-warning-foreground">
                <AlertTriangle className="h-3.5 w-3.5" />
                {lang === "tr" ? `MOQ ${item.moq} altında — en az ${item.moq} adet` : `Below MOQ — needs at least ${item.moq} units`}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* totals */}
      <div className="mt-4 space-y-1.5 rounded-xl bg-muted/40 p-3.5 text-[13px]">
        <div className="flex justify-between text-muted-foreground">
          <span>{lang === "tr" ? "Toplam adet" : "Total units"}</span>
          <span className="tnum">{units}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-1.5 text-[15px] font-bold">
          <span>{lang === "tr" ? "Sipariş toplamı" : "Order total"}</span>
          <span className="tnum">{formatUsd(total)}</span>
        </div>
      </div>

      <button
        onClick={() => canOrder && setPlaced(true)}
        disabled={!canOrder}
        className={cn(
          "mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13px] font-semibold transition-all",
          placed
            ? "bg-success text-success-foreground"
            : canOrder
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "cursor-not-allowed bg-muted text-muted-foreground",
        )}
      >
        {placed ? (
          <>
            <Check className="h-4 w-4" strokeWidth={3} />
            {lang === "tr" ? "Sipariş verildi" : "Order placed"}
          </>
        ) : anyBelowMoq ? (
          lang === "tr" ? "MOQ kurallarını karşıla" : "Meet MOQ to order"
        ) : empty ? (
          lang === "tr" ? "Ürün ekle" : "Add products"
        ) : (
          lang === "tr" ? "Siparişi ver" : "Place order"
        )}
      </button>
    </div>
  );
}
