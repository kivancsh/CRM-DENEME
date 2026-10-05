"use client";

import { ArrowUpRight, ArrowDownRight, Download } from "lucide-react";
import { AreaChart, BarChart, SegmentedBar } from "@/components/app/charts";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatUsd, formatNumber } from "@/lib/utils";
import { kpis, volume, volumeMeta, orders, STATUS_META, ordersByWeekday, type OrderStatus } from "@/lib/demo/data";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "var(--seg-4)",
  confirmed: "var(--seg-1)",
  shipped: "var(--seg-2)",
  paid: "var(--seg-3)",
};

export default function ReportsPage() {
  const { t, lang } = useLang();

  // Top products by revenue, aggregated from order lines.
  const byProduct = new Map<string, { name: string; units: number; revenue: number }>();
  for (const l of orders.flatMap((o) => o.lines)) {
    const cur = byProduct.get(l.sku) ?? { name: l.name, units: 0, revenue: 0 };
    cur.units += l.qty;
    cur.revenue += l.qty * l.unit;
    byProduct.set(l.sku, cur);
  }
  const topProducts = [...byProduct.entries()].sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 6);
  const maxProduct = topProducts[0]?.[1].revenue ?? 1;

  // Top buyers by revenue.
  const byBuyer = new Map<string, number>();
  for (const o of orders) byBuyer.set(o.business, (byBuyer.get(o.business) ?? 0) + o.total);
  const topBuyers = [...byBuyer.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const ordersTotal = orders.reduce((s, o) => s + o.total, 0);

  const statusMix = (Object.keys(STATUS_META) as OrderStatus[]).map((s) => ({
    label: lang === "tr" ? STATUS_META[s].tr : STATUS_META[s].en,
    value: orders.filter((o) => o.status === s).length,
    color: STATUS_COLORS[s],
  }));

  return (
    <div className="mx-auto max-w-[1200px] animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{lang === "tr" ? "Raporlar" : "Reports"}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {lang === "tr" ? "Gelir, sipariş ve alıcı performansı." : "Revenue, order and buyer performance."}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium shadow-pill transition-colors hover:bg-muted">
            <Download className="h-4 w-4 text-muted-foreground" />
            {lang === "tr" ? "Dışa aktar" : "Export"}
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => {
          const up = (k.delta ?? 0) >= 0;
          return (
            <div key={t(k.label)} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <p className="text-[12.5px] font-medium text-muted-foreground">{t(k.label)}</p>
              <p className="mt-2 tnum text-xl font-bold leading-none">{k.value}</p>
              {k.delta !== undefined && (
                <p className="mt-2 inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
                  <span className={cn("inline-flex items-center gap-0.5 font-semibold", up ? "text-success" : "text-destructive")}>
                    {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(k.delta).toFixed(1)}%
                  </span>
                  {k.hint && t(k.hint)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-[15px] font-semibold tracking-tight">{t(volumeMeta.title)}</h3>
              <p className="text-xs text-muted-foreground">{t(volumeMeta.subtitle)}</p>
            </div>
            <span className="tnum text-[12px] font-semibold text-success">{volumeMeta.delta}</span>
          </div>
          <div className="mt-4">
            <AreaChart data={volume.map((v) => v.value)} labels={volume.map((v) => v.label)} height={180} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display text-[15px] font-semibold tracking-tight">{lang === "tr" ? "Güne göre siparişler" : "Orders by weekday"}</h3>
          <p className="text-xs text-muted-foreground">{lang === "tr" ? "Son 30 gün" : "Last 30 days"}</p>
          <div className="mt-4">
            <BarChart data={ordersByWeekday.map((d) => d.value)} labels={ordersByWeekday.map((d) => t(d.label))} height={150} />
          </div>
          <div className="mt-5 border-t border-border pt-4">
            <p className="label-mono mb-2 text-muted-foreground">{lang === "tr" ? "Sipariş durumu dağılımı" : "Order status mix"}</p>
            <SegmentedBar segments={statusMix} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top products */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display text-[15px] font-semibold tracking-tight">{lang === "tr" ? "En çok satan ürünler" : "Top products"}</h3>
          <p className="text-xs text-muted-foreground">{lang === "tr" ? "Son siparişlerdeki gelire göre" : "By revenue across recent orders"}</p>
          <div className="mt-4 space-y-3">
            {topProducts.map(([sku, p]) => (
              <div key={sku}>
                <div className="mb-1 flex items-center justify-between gap-3 text-[13px]">
                  <span className="min-w-0 truncate font-medium">{p.name}</span>
                  <span className="tnum shrink-0 font-semibold">{formatUsd(p.revenue)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(p.revenue / maxProduct) * 100}%` }} />
                </div>
                <p className="tnum mt-0.5 text-[11px] text-muted-foreground">{sku} · {formatNumber(p.units)} {lang === "tr" ? "adet" : "units"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top buyers */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="border-b border-border p-4">
            <h3 className="font-display text-[15px] font-semibold tracking-tight">{lang === "tr" ? "En değerli alıcılar" : "Top buyers"}</h3>
            <p className="text-xs text-muted-foreground">{lang === "tr" ? "Son siparişlerdeki toplam tutara göre" : "By total value of recent orders"}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {topBuyers.map(([business, total], i) => (
                <tr key={business} className="border-b border-border/60 last:border-0">
                  <td className="tnum w-10 py-3 pl-4 text-[12px] text-muted-foreground">{i + 1}</td>
                  <td className="py-3 font-medium">{business}</td>
                  <td className="tnum py-3 text-right text-[12px] text-muted-foreground">{((total / ordersTotal) * 100).toFixed(0)}%</td>
                  <td className="tnum py-3 pr-4 text-right font-semibold">{formatUsd(total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
