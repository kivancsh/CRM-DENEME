"use client";

import Link from "next/link";
import { RefreshCw, Plug, AlertTriangle, CheckCircle2, Package, ShoppingCart, Boxes } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatNumber } from "@/lib/utils";
import { products, orders, syncMeta, syncLog } from "@/lib/demo/data";

function fmtTime(iso: string) {
  const d = new Date(iso);
  const mon = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${d.getUTCDate()} ${mon} · ${hh}:${mm}`;
}

const KIND_ICON = { products: Package, stock: Boxes, orders: ShoppingCart } as const;

export default function InventoryPage() {
  const { t, lang } = useLang();

  // Units committed to orders that haven't shipped yet.
  const reserved = (sku: string) =>
    orders
      .filter((o) => o.status === "pending" || o.status === "confirmed")
      .flatMap((o) => o.lines)
      .filter((l) => l.sku === sku)
      .reduce((s, l) => s + l.qty, 0);

  const rows = products.map((p) => {
    const res = reserved(p.sku);
    return { ...p, reserved: res, available: p.stock - res, low: p.stock < syncMeta.lowStockThreshold };
  });

  return (
    <div className="mx-auto max-w-[1200px] animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{lang === "tr" ? "Stok senkronu" : "Inventory sync"}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {lang === "tr" ? "ERP / envanter sisteminle ürün, stok ve sipariş eşitlemesi." : "Product, stock and order sync with your ERP / inventory system."}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
            <RefreshCw className="h-4 w-4" />
            {lang === "tr" ? "Şimdi eşitle" : "Sync now"}
          </button>
        </div>
      </div>

      {/* Connection status */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-warning/15 text-warning-foreground">
          <Plug className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{syncMeta.source}</p>
          <p className="text-[13px] text-muted-foreground">
            {lang === "tr"
              ? `Demo modu — gerçek ERP bağlı değil. Son eşitleme ${fmtTime(syncMeta.lastSync)} UTC · ${t(syncMeta.frequency)}.`
              : `Demo mode — no real ERP connected. Last sync ${fmtTime(syncMeta.lastSync)} UTC · ${t(syncMeta.frequency)}.`}
          </p>
        </div>
        <Link
          href="/settings"
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium shadow-pill transition-colors hover:bg-muted"
        >
          {lang === "tr" ? "Entegrasyonu bağla" : "Connect integration"}
        </Link>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: lang === "tr" ? "Takip edilen SKU" : "Tracked SKUs", value: formatNumber(rows.length) },
          { label: lang === "tr" ? "Eldeki stok" : "On hand", value: formatNumber(rows.reduce((s, r) => s + r.stock, 0)) },
          { label: lang === "tr" ? "Siparişe ayrılan" : "Reserved", value: formatNumber(rows.reduce((s, r) => s + r.reserved, 0)) },
          { label: lang === "tr" ? "Düşük stok" : "Low stock", value: formatNumber(rows.filter((r) => r.low).length) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[12.5px] font-medium text-muted-foreground">{s.label}</p>
            <p className="mt-2 tnum text-xl font-bold leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Stock table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="border-b border-border p-4">
            <h3 className="font-display text-[15px] font-semibold tracking-tight">{lang === "tr" ? "Stok seviyeleri" : "Stock levels"}</h3>
            <p className="text-xs text-muted-foreground">
              {lang === "tr" ? `Düşük stok eşiği: ${syncMeta.lowStockThreshold} adet` : `Low-stock threshold: ${syncMeta.lowStockThreshold} units`}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="label-mono py-2.5 pl-4 font-medium text-muted-foreground">{lang === "tr" ? "Ürün" : "Product"}</th>
                  <th className="label-mono py-2.5 text-right font-medium text-muted-foreground">{lang === "tr" ? "Eldeki" : "On hand"}</th>
                  <th className="label-mono py-2.5 text-right font-medium text-muted-foreground">{lang === "tr" ? "Ayrılan" : "Reserved"}</th>
                  <th className="label-mono py-2.5 pr-4 text-right font-medium text-muted-foreground">{lang === "tr" ? "Satılabilir" : "Available"}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.sku} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                    <td className="py-3 pl-4">
                      <p className="font-medium leading-tight">{r.name}</p>
                      <p className="tnum text-[11px] text-muted-foreground">{r.sku} · {t(r.category)}</p>
                    </td>
                    <td className="tnum py-3 text-right text-[13px]">{formatNumber(r.stock)}</td>
                    <td className="tnum py-3 text-right text-[13px] text-muted-foreground">{r.reserved > 0 ? formatNumber(r.reserved) : "—"}</td>
                    <td className="py-3 pr-4 text-right">
                      <span className={cn("tnum text-[13px] font-semibold", r.low && "text-warning-foreground")}>{formatNumber(r.available)}</span>
                      {r.low && (
                        <span className="ml-2 rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] font-semibold text-warning-foreground">
                          {lang === "tr" ? "düşük" : "low"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sync log */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display text-[15px] font-semibold tracking-tight">{lang === "tr" ? "Eşitleme geçmişi" : "Sync log"}</h3>
          <p className="text-xs text-muted-foreground">{lang === "tr" ? "Saatler UTC" : "Times in UTC"}</p>
          <div className="mt-4 space-y-3">
            {syncLog.map((e) => {
              const KindIcon = KIND_ICON[e.kind];
              return (
                <div key={e.id} className="flex gap-3">
                  <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", e.status === "ok" ? "bg-muted text-muted-foreground" : "bg-warning/15 text-warning-foreground")}>
                    <KindIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-snug">{t(e.detail)}</p>
                    <p className="tnum mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      {e.status === "ok" ? <CheckCircle2 className="h-3 w-3 text-success" /> : <AlertTriangle className="h-3 w-3 text-warning-foreground" />}
                      {fmtTime(e.at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
