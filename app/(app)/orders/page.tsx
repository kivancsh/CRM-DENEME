"use client";

import { Fragment, useState } from "react";
import { Search, Plus, Download, ArrowUpDown } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatUsd, formatNumber } from "@/lib/utils";
import { orders, STATUS_META, type OrderStatus } from "@/lib/demo/data";

const STATUS_FILTERS: { key: OrderStatus | "all"; tr: string; en: string }[] = [
  { key: "all", tr: "Tümü", en: "All" },
  { key: "pending", tr: "Bekliyor", en: "Pending" },
  { key: "confirmed", tr: "Onaylı", en: "Confirmed" },
  { key: "shipped", tr: "Kargolandı", en: "Shipped" },
  { key: "paid", tr: "Ödendi", en: "Paid" },
];

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${d.toLocaleString("en-US", { month: "short", timeZone: "UTC" })}`;
}

export default function OrdersPage() {
  const { lang } = useLang();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (!query ||
        o.business.toLowerCase().includes(query.toLowerCase()) ||
        o.number.toLowerCase().includes(query.toLowerCase())),
  );

  const totalValue = rows.reduce((s, o) => s + o.total, 0);

  return (
    <div className="mx-auto max-w-[1200px] animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{lang === "tr" ? "Siparişler" : "Orders"}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {lang === "tr" ? "Tüm alıcı siparişlerini görüntüle, onayla ve faturalandır." : "View, confirm and invoice every buyer order."}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium shadow-pill transition-colors hover:bg-muted">
            <Download className="h-4 w-4 text-muted-foreground" />
            {lang === "tr" ? "Dışa aktar" : "Export"}
          </button>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
            <Plus className="h-4 w-4" />
            {lang === "tr" ? "Sipariş oluştur" : "New order"}
          </button>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: lang === "tr" ? "Görüntülenen" : "Showing", value: formatNumber(rows.length) },
          { label: lang === "tr" ? "Toplam değer" : "Total value", value: formatUsd(totalValue) },
          { label: lang === "tr" ? "Onay bekleyen" : "Awaiting confirm", value: formatNumber(orders.filter((o) => o.status === "pending").length) },
          { label: lang === "tr" ? "Kargoda" : "In transit", value: formatNumber(orders.filter((o) => o.status === "shipped").length) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[12.5px] font-medium text-muted-foreground">{s.label}</p>
            <p className="mt-2 tnum text-xl font-bold leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-border p-4">
          <div className="flex flex-wrap gap-1.5">
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
          <div className="ml-auto flex items-center gap-2">
            <div className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === "tr" ? "İşletme veya no…" : "Business or no…"}
                className="w-32 bg-transparent placeholder:text-muted-foreground/70 focus:outline-none sm:w-44"
              />
            </div>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-[13px] font-medium transition-colors hover:bg-muted">
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              {lang === "tr" ? "Sırala" : "Sort"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="label-mono py-2.5 pl-4 font-medium text-muted-foreground">{lang === "tr" ? "Sipariş" : "Order"}</th>
                <th className="label-mono py-2.5 font-medium text-muted-foreground">{lang === "tr" ? "İşletme" : "Business"}</th>
                <th className="label-mono py-2.5 font-medium text-muted-foreground">{lang === "tr" ? "Durum" : "Status"}</th>
                <th className="label-mono py-2.5 font-medium text-muted-foreground">{lang === "tr" ? "Sevk" : "Ship to"}</th>
                <th className="label-mono py-2.5 font-medium text-muted-foreground">{lang === "tr" ? "Tarih" : "Date"}</th>
                <th className="label-mono py-2.5 pr-4 text-right font-medium text-muted-foreground">{lang === "tr" ? "Toplam" : "Total"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => {
                const st = STATUS_META[o.status];
                const open = openId === o.id;
                return (
                  <Fragment key={o.id}>
                    <tr
                      onClick={() => setOpenId(open ? null : o.id)}
                      className={cn("cursor-pointer border-b border-border/60 transition-colors", open ? "bg-primary/[0.04]" : "hover:bg-muted/50")}
                    >
                      <td className="py-3 pl-4">
                        <p className="tnum font-semibold leading-tight">{o.number}</p>
                        <p className="tnum text-xs text-muted-foreground">{o.items} {lang === "tr" ? "kalem" : "items"} · {formatNumber(o.units)}u</p>
                      </td>
                      <td className="py-3">
                        <p className="font-medium leading-tight">{o.business}</p>
                        <p className="text-xs text-muted-foreground">{o.buyer}</p>
                      </td>
                      <td className="py-3">
                        <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", st.tone)}>
                          {lang === "tr" ? st.tr : st.en}
                        </span>
                      </td>
                      <td className="py-3 text-[13px] text-muted-foreground">{o.ship}</td>
                      <td className="py-3"><span className="tnum text-[13px] text-muted-foreground">{fmtDate(o.date)}</span></td>
                      <td className="py-3 pr-4 text-right">
                        <p className="tnum font-semibold">{formatUsd(o.total)}</p>
                        <p className="text-xs text-muted-foreground">{o.terms}</p>
                      </td>
                    </tr>
                    {open && (
                      <tr className="border-b border-border/60 bg-muted/20">
                        <td colSpan={6} className="px-4 py-3">
                          <div className="grid gap-2 sm:grid-cols-2">
                            {o.lines.map((l) => (
                              <div key={l.sku} className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
                                <div className="min-w-0">
                                  <p className="truncate text-[13px] font-medium leading-tight">{l.name}</p>
                                  <p className="tnum text-[11px] text-muted-foreground">{l.sku} · {l.qty} × {formatUsd(l.unit)}</p>
                                </div>
                                <span className="tnum text-[13px] font-semibold">{formatUsd(l.qty * l.unit)}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    {lang === "tr" ? "Bu filtreyle sipariş yok." : "No orders match this filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
