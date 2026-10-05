"use client";

import { useState } from "react";
import { Layers, Package } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatUsd } from "@/lib/utils";
import { pricingTiers, buyers, products } from "@/lib/demo/data";

/** "48%" → 0.48 */
const pct = (s: string) => parseFloat(s) / 100;

export default function PricingTiersPage() {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState<string>(pricingTiers[2].name);
  const tier = pricingTiers.find((p) => p.name === selected) ?? pricingTiers[0];
  const tierBuyers = buyers.filter((b) => b.tier === tier.name);

  return (
    <div className="mx-auto max-w-[1200px] animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{lang === "tr" ? "Fiyat kademeleri" : "Pricing tiers"}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {lang === "tr"
              ? "Alıcı gruplarına göre tavsiye edilen satış fiyatından (MSRP) indirim oranları."
              : "Buyer-group discounts off the manufacturer's suggested retail price (MSRP)."}
          </p>
        </div>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {pricingTiers.map((p) => {
          const active = p.name === selected;
          return (
            <button
              key={p.name}
              onClick={() => setSelected(p.name)}
              className={cn(
                "rounded-2xl border bg-card p-4 text-left shadow-soft transition-colors",
                active ? "border-primary ring-2 ring-primary/20" : "border-border hover:bg-muted/40",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </span>
                <span className="tnum text-xs text-muted-foreground">{p.buyers} {lang === "tr" ? "alıcı" : "buyers"}</span>
              </div>
              <p className="mt-3 tnum text-2xl font-bold leading-none">-{p.discount}</p>
              <p className="mt-1.5 text-[11.5px] text-muted-foreground">
                {lang === "tr" ? "Min. hacim" : "Min. volume"}: <span className="tnum">{p.minVolume}</span>
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Price list for the selected tier */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="flex items-center gap-2 border-b border-border p-4">
            <Layers className="h-4 w-4 text-primary" />
            <div>
              <h3 className="font-display text-[15px] font-semibold tracking-tight">
                {tier.name} {lang === "tr" ? "fiyat listesi" : "price list"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === "tr" ? `MSRP'den %${parseFloat(tier.discount)} indirim` : `${tier.discount} off MSRP`}
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="label-mono py-2.5 pl-4 font-medium text-muted-foreground">{lang === "tr" ? "Ürün" : "Product"}</th>
                  <th className="label-mono py-2.5 text-right font-medium text-muted-foreground">MSRP</th>
                  <th className="label-mono py-2.5 text-right font-medium text-muted-foreground">{lang === "tr" ? "Kademe fiyatı" : "Tier price"}</th>
                  <th className="label-mono py-2.5 pr-4 text-right font-medium text-muted-foreground">MOQ</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.sku} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Package className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium leading-tight">{p.name}</p>
                          <p className="tnum truncate text-[11px] text-muted-foreground">{p.sku} · {t(p.category)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="tnum py-3 text-right text-[13px] text-muted-foreground line-through">{formatUsd(p.msrp)}</td>
                    <td className="tnum py-3 text-right font-semibold">{formatUsd(p.msrp * (1 - pct(tier.discount)))}</td>
                    <td className="tnum py-3 pr-4 text-right text-[13px] text-muted-foreground">{p.moq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buyers in this tier */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display text-[15px] font-semibold tracking-tight">
            {lang === "tr" ? "Bu kademedeki alıcılar" : "Buyers in this tier"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {lang === "tr" ? "Demo listesinde görünenler" : "Shown from the demo buyer list"}
          </p>
          <div className="mt-4 space-y-2.5">
            {tierBuyers.map((b) => (
              <div key={b.id} className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ backgroundImage: "var(--grad-brand)" }}>
                  {b.business.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold leading-tight">{b.business}</p>
                  <p className="text-[11px] text-muted-foreground">{b.contact} · {b.terms}</p>
                </div>
                <span className="tnum text-[12px] text-muted-foreground">{b.orders} {lang === "tr" ? "sip." : "orders"}</span>
              </div>
            ))}
            {tierBuyers.length === 0 && (
              <p className="py-6 text-center text-[13px] text-muted-foreground">{lang === "tr" ? "Bu kademede alıcı yok." : "No buyers in this tier."}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
