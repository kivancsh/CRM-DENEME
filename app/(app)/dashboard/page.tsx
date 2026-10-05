"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download,
  Plus,
  Search,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Package,
  RotateCcw,
  Truck,
  CreditCard,
  Building2,
} from "lucide-react";
import { AreaChart, SegmentedBar } from "@/components/app/charts";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatUsd, formatNumber } from "@/lib/utils";
import {
  kpis,
  summary,
  orders,
  STATUS_META,
  products,
  buyers,
  volume,
  volumeMeta,
  reorder,
  pricingTiers,
  activity,
  type OrderStatus,
} from "@/lib/demo/data";

const STATUS_FILTERS: { key: OrderStatus | "all"; tr: string; en: string }[] = [
  { key: "all", tr: "Tümü", en: "All" },
  { key: "pending", tr: "Bekliyor", en: "Pending" },
  { key: "confirmed", tr: "Onaylı", en: "Confirmed" },
  { key: "shipped", tr: "Kargolandı", en: "Shipped" },
  { key: "paid", tr: "Ödendi", en: "Paid" },
];

function fmtDate(iso: string) {
  const d = new Date(iso);
  const day = d.getUTCDate();
  const mon = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  return `${day} ${mon}`;
}

function relTime(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  const diffH = Math.floor((Date.now() - date.getTime()) / 3.6e6);
  if (diffH < 1) return "just now";
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
}

export default function DashboardPage() {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState<string>("o1");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [query, setQuery] = useState("");

  const rows = orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (!query ||
        o.business.toLowerCase().includes(query.toLowerCase()) ||
        o.number.toLowerCase().includes(query.toLowerCase())),
  );
  const order = orders.find((o) => o.id === selected) ?? orders[0];

  const maxTierBuyers = Math.max(...pricingTiers.map((p) => p.buyers));

  return (
    <div className="mx-auto max-w-[1500px] animate-fade-in">
      <div className={cn("grid gap-6", drawerOpen ? "xl:grid-cols-[1fr_368px]" : "grid-cols-1")}>
        {/* ── Main column ──────────────────────────────────────────── */}
        <div className="min-w-0 space-y-6">
          {/* Page header */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                {lang === "tr" ? "Toptan paneli" : "Wholesale cockpit"}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {lang === "tr"
                  ? "Alıcı siparişleri, katalog ve cari hesaplar tek yerde."
                  : "Buyer orders, catalog and account balances in one place."}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium text-foreground shadow-pill transition-colors hover:bg-muted">
                <Download className="h-4 w-4 text-muted-foreground" />
                {lang === "tr" ? "Dışa aktar" : "Export"}
              </button>
              <button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
                <Plus className="h-4 w-4" />
                {lang === "tr" ? "Sipariş oluştur" : "New order"}
              </button>
            </div>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {kpis.map((k) => {
              const up = (k.delta ?? 0) >= 0;
              return (
                <div key={t(k.label)} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <p className="text-[12.5px] font-medium text-muted-foreground">{t(k.label)}</p>
                  <div className="mt-2 flex items-end justify-between">
                    <p className="tnum text-xl font-bold leading-none">{k.value}</p>
                    {k.delta !== undefined && (
                      <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-semibold", up ? "text-success" : "text-destructive")}>
                        {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(k.delta).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  {k.hint && <p className="mt-1.5 line-clamp-1 text-[11px] text-muted-foreground">{t(k.hint)}</p>}
                </div>
              );
            })}
          </div>

          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-muted-foreground">{t(summary.openOrders.label)}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-warning-foreground">
                  {summary.openOrders.count} {t(summary.openOrders.countLabel)}
                </span>
              </div>
              <p className="mt-2.5 tnum text-[26px] font-bold leading-none text-foreground">{summary.openOrders.value}</p>
              <p className="mt-1.5 tnum text-xs text-muted-foreground">{formatUsd(summary.openOrders.valueUsd)}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-muted-foreground">{t(summary.outstanding.label)}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                  {summary.outstanding.overdue} {lang === "tr" ? "gecikmiş" : "overdue"}
                </span>
              </div>
              <p className="mt-2.5 tnum text-[26px] font-bold leading-none text-foreground">{formatUsd(summary.outstanding.value)}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{lang === "tr" ? "açık faturalar" : "open invoices"}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-muted-foreground">{t(summary.revenue30d.label)}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                  <ArrowUpRight className="h-3 w-3" />
                  {volumeMeta.delta}
                </span>
              </div>
              <p className="mt-2.5 tnum text-[26px] font-bold leading-none text-foreground">{formatUsd(summary.revenue30d.value)}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{lang === "tr" ? "uzlaşan ciro" : "settled revenue"}</p>
            </div>
          </div>

          {/* Orders list */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex flex-wrap items-center gap-2.5 border-b border-border p-4">
              <h2 className="font-display text-[15px] font-semibold tracking-tight">
                {lang === "tr" ? "Siparişler" : "Orders"}
              </h2>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <div className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={lang === "tr" ? "İşletme veya no…" : "Business or no…"}
                    className="w-28 bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:w-36"
                  />
                </div>
              </div>
            </div>

            {/* Status filter (useState) */}
            <div className="flex flex-wrap gap-1.5 border-b border-border px-4 py-2.5">
              {STATUS_FILTERS.map((f) => {
                const active = filter === f.key;
                const count = f.key === "all" ? orders.length : orders.filter((o) => o.status === f.key).length;
                return (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-medium transition-colors",
                      active ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {lang === "tr" ? f.tr : f.en}
                    <span className={cn("tnum text-[10.5px]", active ? "text-primary-foreground/80" : "text-muted-foreground/70")}>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="label-mono py-2.5 pl-4 font-medium text-muted-foreground">{lang === "tr" ? "Alıcı" : "Buyer"}</th>
                    <th className="label-mono py-2.5 font-medium text-muted-foreground">{lang === "tr" ? "Kalem" : "Items"}</th>
                    <th className="label-mono py-2.5 font-medium text-muted-foreground">{lang === "tr" ? "Durum" : "Status"}</th>
                    <th className="label-mono py-2.5 font-medium text-muted-foreground">{lang === "tr" ? "Tarih" : "Date"}</th>
                    <th className="label-mono py-2.5 pr-4 text-right font-medium text-muted-foreground">{lang === "tr" ? "Toplam" : "Total"}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const isSel = row.id === selected && drawerOpen;
                    const st = STATUS_META[row.status];
                    return (
                      <tr
                        key={row.id}
                        onClick={() => {
                          setSelected(row.id);
                          setDrawerOpen(true);
                        }}
                        className={cn(
                          "cursor-pointer border-b border-border/60 transition-colors last:border-0",
                          isSel ? "bg-primary/[0.04]" : "hover:bg-muted/50",
                        )}
                      >
                        <td className="py-3 pl-4">
                          <div className="flex items-center gap-2.5">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-[11px] font-bold text-muted-foreground">
                              {row.business.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-semibold leading-tight">{row.business}</p>
                              <p className="tnum truncate text-xs text-muted-foreground">{row.number}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <p className="tnum text-[13px] font-medium">{row.items}</p>
                          <p className="tnum text-xs text-muted-foreground">{formatNumber(row.units)} {lang === "tr" ? "adet" : "units"}</p>
                        </td>
                        <td className="py-3">
                          <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", st.tone)}>
                            {lang === "tr" ? st.tr : st.en}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="tnum whitespace-nowrap text-[13px] text-muted-foreground">{fmtDate(row.date)}</span>
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <p className="tnum font-semibold">{formatUsd(row.total)}</p>
                          <p className="text-xs text-muted-foreground">{row.terms}</p>
                        </td>
                      </tr>
                    );
                  })}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                        {lang === "tr" ? "Bu filtreyle sipariş yok." : "No orders match this filter."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order volume + pricing tiers */}
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-[15px] font-semibold tracking-tight">{t(volumeMeta.title)}</h3>
                  <p className="text-xs text-muted-foreground">{t(volumeMeta.subtitle)}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                  <ArrowUpRight className="h-3 w-3" />
                  {volumeMeta.delta}
                </span>
              </div>
              <p className="mt-3 tnum text-2xl font-bold leading-none">{formatUsd(volume[volume.length - 1].value)}</p>
              <div className="mt-4">
                <AreaChart data={volume.map((v) => v.value)} labels={volume.map((v) => v.label)} height={150} />
              </div>
            </div>

            {/* Pricing tiers panel */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display text-[15px] font-semibold tracking-tight">{lang === "tr" ? "Fiyat kademeleri" : "Pricing tiers"}</h3>
              <p className="text-xs text-muted-foreground">{lang === "tr" ? "Alıcı grubu indirimi" : "Buyer-group discount off MSRP"}</p>
              <div className="mt-4 space-y-3.5">
                {pricingTiers.map((tier) => (
                  <div key={tier.name}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-2 font-medium">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: tier.color }} />
                        {tier.name}
                        <span className="tnum text-xs font-semibold text-primary">-{tier.discount}</span>
                      </span>
                      <span className="tnum text-xs text-muted-foreground">{tier.buyers} {lang === "tr" ? "alıcı" : "buyers"}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full" style={{ width: `${(tier.buyers / maxTierBuyers) * 100}%`, background: tier.color }} />
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{lang === "tr" ? "Min. hacim" : "Min. volume"}: {tier.minVolume}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product catalog + quick reorder */}
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Catalog panel (tiered wholesale pricing + MOQ) */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <div className="flex items-center justify-between border-b border-border p-4">
                <div>
                  <h3 className="font-display text-[15px] font-semibold tracking-tight">{lang === "tr" ? "Ürün kataloğu" : "Product catalog"}</h3>
                  <p className="text-xs text-muted-foreground">{lang === "tr" ? "Kademeli toptan fiyat + MOQ" : "Tiered wholesale price + MOQ"}</p>
                </div>
                <Link href="/catalog" className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline">
                  {lang === "tr" ? "Tümü" : "View all"}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-border/60">
                {products.slice(0, 6).map((p) => (
                  <div key={p.sku} className="flex items-center gap-3 px-4 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Package className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-semibold leading-tight">{p.name}</p>
                      <p className="tnum truncate text-[11px] text-muted-foreground">
                        {p.sku} · {t(p.category)} · {lang === "tr" ? "MOQ" : "MOQ"} {p.moq}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="tnum text-[13.5px] font-semibold">{formatUsd(p.breaks[0].price)}</p>
                      <p className="tnum text-[11px] text-muted-foreground">
                        {p.breaks.length > 1 ? `→ ${formatUsd(p.breaks[p.breaks.length - 1].price)}` : `MSRP ${formatUsd(p.msrp)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick reorder panel */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-primary" />
                <h3 className="font-display text-[15px] font-semibold tracking-tight">{lang === "tr" ? "Hızlı tekrar sipariş" : "Quick reorder"}</h3>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{lang === "tr" ? "En çok alınan ürünler" : "Your top reorder items"}</p>
              <div className="mt-4 space-y-2.5">
                {reorder.map((r) => (
                  <div key={r.sku} className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold leading-tight">{r.name}</p>
                      <p className="tnum text-[11px] text-muted-foreground">{t(r.cadence)} · {lang === "tr" ? "son" : "last"} {r.lastQty}</p>
                    </div>
                    <button className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-primary px-2.5 text-[12px] font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                      <Plus className="h-3.5 w-3.5" />
                      {lang === "tr" ? "Ekle" : "Add"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Buyers list */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div>
                <h3 className="font-display text-[15px] font-semibold tracking-tight">{lang === "tr" ? "Alıcılar" : "Buyers"}</h3>
                <p className="text-xs text-muted-foreground">{lang === "tr" ? "Ödeme vadesi, kredi limiti ve bakiye" : "Payment terms, credit limit & balance"}</p>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">{buyers.length} {lang === "tr" ? "aktif" : "active"}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="label-mono py-2.5 pl-4 font-medium text-muted-foreground">{lang === "tr" ? "İşletme" : "Business"}</th>
                    <th className="label-mono py-2.5 font-medium text-muted-foreground">{lang === "tr" ? "Kademe" : "Tier"}</th>
                    <th className="label-mono py-2.5 font-medium text-muted-foreground">{lang === "tr" ? "Vade" : "Terms"}</th>
                    <th className="label-mono py-2.5 text-right font-medium text-muted-foreground">{lang === "tr" ? "Kredi limiti" : "Credit limit"}</th>
                    <th className="label-mono py-2.5 pr-4 text-right font-medium text-muted-foreground">{lang === "tr" ? "Bakiye" : "Balance"}</th>
                  </tr>
                </thead>
                <tbody>
                  {buyers.map((b) => (
                    <tr key={b.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40">
                      <td className="py-3 pl-4">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ backgroundImage: "var(--grad-brand)" }}>
                            {b.business.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold leading-tight">{b.business}</p>
                            <p className="truncate text-xs text-muted-foreground">{b.contact}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">{b.tier}</span>
                      </td>
                      <td className="py-3 text-[13px] text-muted-foreground">{b.terms}</td>
                      <td className="py-3 pr-4 text-right">
                        <span className="tnum text-[13px]">{b.creditLimit > 0 ? formatUsd(b.creditLimit) : "—"}</span>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <span className={cn("tnum text-[13px] font-semibold", b.balance > 0 ? "text-foreground" : "text-muted-foreground")}>
                          {b.balance > 0 ? formatUsd(b.balance) : "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Right detail drawer (order detail) ───────────────────── */}
        {drawerOpen && (
          <aside className="animate-float-up xl:sticky xl:top-2 xl:self-start">
            <div className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-[15px] font-semibold tracking-tight">{lang === "tr" ? "Sipariş detayı" : "Order details"}</h2>
                  <p className="tnum text-xs text-muted-foreground">{order.number}</p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label={lang === "tr" ? "Kapat" : "Close"}
                  className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Buyer header */}
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold leading-tight">{order.business}</p>
                  <p className="truncate text-xs text-muted-foreground">{order.buyer} · {order.email}</p>
                </div>
              </div>

              {/* Status + meta */}
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: <OrderStatusGlyph status={order.status} />, label: lang === "tr" ? "Durum" : "Status", value: lang === "tr" ? STATUS_META[order.status].tr : STATUS_META[order.status].en },
                  { icon: <CreditCard className="mx-auto h-4 w-4 text-muted-foreground" />, label: lang === "tr" ? "Vade" : "Terms", value: order.terms },
                  { icon: <Truck className="mx-auto h-4 w-4 text-muted-foreground" />, label: lang === "tr" ? "Sevk" : "Ship to", value: order.ship },
                ].map((m, i) => (
                  <div key={i} className="rounded-xl border border-border p-2.5">
                    {m.icon}
                    <p className="mt-1 label-mono text-muted-foreground">{m.label}</p>
                    <p className="mt-0.5 truncate text-[12px] font-semibold capitalize">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Line items */}
              <div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-border pb-2 label-mono text-muted-foreground">
                  <span>{lang === "tr" ? "Ürün" : "Product"}</span>
                  <span className="text-right">{lang === "tr" ? "Adet × Fiyat" : "Qty × Price"}</span>
                  <span className="text-right">{lang === "tr" ? "Tutar" : "Amount"}</span>
                </div>
                <div className="divide-y divide-border/60">
                  {order.lines.map((l) => (
                    <div key={l.sku} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium leading-tight">{l.name}</p>
                        <p className="tnum text-[11px] text-muted-foreground">{l.sku}</p>
                      </div>
                      <span className="tnum text-right text-[12px] text-muted-foreground whitespace-nowrap">{l.qty} × {formatUsd(l.unit)}</span>
                      <span className="tnum text-right text-[13px] font-semibold whitespace-nowrap">{formatUsd(l.qty * l.unit)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1.5 rounded-xl bg-muted/40 p-3 text-[13px]">
                <div className="flex justify-between text-muted-foreground">
                  <span>{lang === "tr" ? "Ara toplam" : "Subtotal"}</span>
                  <span className="tnum">{formatUsd(order.total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{lang === "tr" ? "Toptan indirimi" : "Wholesale discount"}</span>
                  <span className="tnum text-success">{lang === "tr" ? "uygulandı" : "applied"}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1.5 font-semibold">
                  <span>{lang === "tr" ? "Toplam" : "Total"}</span>
                  <span className="tnum text-[15px]">{formatUsd(order.total)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                  <Check className="h-4 w-4" />
                  {order.status === "pending" ? (lang === "tr" ? "Onayla" : "Confirm") : (lang === "tr" ? "Fatura" : "Invoice")}
                </button>
                <button className="rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted">
                  {lang === "tr" ? "Yazdır" : "Print"}
                </button>
              </div>
            </div>

            {/* Order-mix segmented bar */}
            <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display text-[15px] font-semibold tracking-tight">{lang === "tr" ? "Bu siparişin dağılımı" : "This order's mix"}</h3>
              <SegmentedBar
                className="mt-4"
                segments={order.lines.slice(0, 4).map((l, i) => ({
                  label: l.sku,
                  value: Math.round(l.qty * l.unit),
                  color: `var(--seg-${i + 1})`,
                }))}
              />
            </div>

            {/* Activity feed */}
            <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display text-[15px] font-semibold tracking-tight">{lang === "tr" ? "Son hareketler" : "Recent activity"}</h3>
              <div className="mt-3.5 space-y-3.5">
                {activity.map((a) => (
                  <div key={a.id} className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                        a.tone === "success" ? "bg-success" : a.tone === "warning" ? "bg-warning" : a.tone === "info" ? "bg-info" : "bg-muted-foreground",
                      )}
                    />
                    <div className="min-w-0 text-[13px]">
                      <p className="leading-snug">
                        <span className="font-semibold">{a.who}</span>{" "}
                        <span className="text-muted-foreground">{t(a.action)}</span>{" "}
                        {a.target && <span className="tnum font-medium">{a.target}</span>}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{relTime(a.at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function OrderStatusGlyph({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, React.ReactNode> = {
    pending: <Package className="mx-auto h-4 w-4 text-warning-foreground" />,
    confirmed: <Check className="mx-auto h-4 w-4 text-info" />,
    shipped: <Truck className="mx-auto h-4 w-4 text-[--color-status-shipped]" />,
    paid: <CreditCard className="mx-auto h-4 w-4 text-success" />,
  };
  return <>{map[status]}</>;
}
