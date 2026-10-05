"use client";

import { Fragment, useState } from "react";
import { Search, UserPlus, Mail } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatUsd, formatNumber } from "@/lib/utils";
import { buyers, orders, pricingTiers, STATUS_META } from "@/lib/demo/data";

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${d.toLocaleString("en-US", { month: "short", timeZone: "UTC" })}`;
}

export default function BuyersPage() {
  const { lang } = useLang();
  const [tier, setTier] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = buyers.filter(
    (b) =>
      (tier === "all" || b.tier === tier) &&
      (!query ||
        b.business.toLowerCase().includes(query.toLowerCase()) ||
        b.contact.toLowerCase().includes(query.toLowerCase())),
  );

  const totalBalance = buyers.reduce((s, b) => s + b.balance, 0);
  const totalCredit = buyers.reduce((s, b) => s + b.creditLimit, 0);
  const tierColor = (name: string) => pricingTiers.find((p) => p.name === name)?.color ?? "var(--color-primary)";

  return (
    <div className="mx-auto max-w-[1200px] animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{lang === "tr" ? "Alıcılar" : "Buyers"}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {lang === "tr" ? "Onaylı alıcı işletmeler, vadeleri, kredi limitleri ve bakiyeleri." : "Approved buyer businesses, their terms, credit limits and balances."}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
            <UserPlus className="h-4 w-4" />
            {lang === "tr" ? "Alıcı davet et" : "Invite buyer"}
          </button>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: lang === "tr" ? "Alıcı" : "Buyers", value: formatNumber(buyers.length) },
          { label: lang === "tr" ? "Toplam kredi limiti" : "Total credit limit", value: formatUsd(totalCredit) },
          { label: lang === "tr" ? "Açık bakiye" : "Outstanding balance", value: formatUsd(totalBalance) },
          { label: lang === "tr" ? "Peşin çalışan" : "Prepaid accounts", value: formatNumber(buyers.filter((b) => b.terms === "Prepaid").length) },
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
            {["all", ...pricingTiers.map((p) => p.name)].map((k) => {
              const active = tier === k;
              const count = k === "all" ? buyers.length : buyers.filter((b) => b.tier === k).length;
              return (
                <button
                  key={k}
                  onClick={() => setTier(k)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-medium transition-colors",
                    active ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:bg-muted",
                  )}
                >
                  {k === "all" ? (lang === "tr" ? "Tümü" : "All") : k}
                  <span className={cn("tnum text-[10.5px]", active ? "text-primary-foreground/80" : "text-muted-foreground/70")}>{count}</span>
                </button>
              );
            })}
          </div>
          <div className="ml-auto flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === "tr" ? "İşletme veya kişi…" : "Business or contact…"}
              className="w-32 bg-transparent placeholder:text-muted-foreground/70 focus:outline-none sm:w-44"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="label-mono py-2.5 pl-4 font-medium text-muted-foreground">{lang === "tr" ? "İşletme" : "Business"}</th>
                <th className="label-mono py-2.5 font-medium text-muted-foreground">{lang === "tr" ? "Kademe" : "Tier"}</th>
                <th className="label-mono py-2.5 font-medium text-muted-foreground">{lang === "tr" ? "Vade" : "Terms"}</th>
                <th className="label-mono py-2.5 text-right font-medium text-muted-foreground">{lang === "tr" ? "Sipariş" : "Orders"}</th>
                <th className="label-mono py-2.5 text-right font-medium text-muted-foreground">{lang === "tr" ? "Kredi kullanımı" : "Credit used"}</th>
                <th className="label-mono py-2.5 pr-4 text-right font-medium text-muted-foreground">{lang === "tr" ? "Bakiye" : "Balance"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => {
                const open = openId === b.id;
                const used = b.creditLimit > 0 ? Math.min(100, (b.balance / b.creditLimit) * 100) : 0;
                const buyerOrders = orders.filter((o) => o.business === b.business);
                return (
                  <Fragment key={b.id}>
                    <tr
                      onClick={() => setOpenId(open ? null : b.id)}
                      className={cn("cursor-pointer border-b border-border/60 transition-colors", open ? "bg-primary/[0.04]" : "hover:bg-muted/50")}
                    >
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
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold">
                          <span className="h-2 w-2 rounded-full" style={{ background: tierColor(b.tier) }} />
                          {b.tier}
                        </span>
                      </td>
                      <td className="py-3 text-[13px] text-muted-foreground">{b.terms}</td>
                      <td className="tnum py-3 text-right text-[13px]">{b.orders}</td>
                      <td className="py-3 text-right">
                        {b.creditLimit > 0 ? (
                          <div className="ml-auto w-28">
                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                              <div className={cn("h-full rounded-full", used > 75 ? "bg-warning" : "bg-primary")} style={{ width: `${used}%` }} />
                            </div>
                            <p className="tnum mt-1 text-[11px] text-muted-foreground">{used.toFixed(0)}% · {formatUsd(b.creditLimit)}</p>
                          </div>
                        ) : (
                          <span className="text-[13px] text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <span className={cn("tnum text-[13px] font-semibold", b.balance > 0 ? "text-foreground" : "text-muted-foreground")}>
                          {formatUsd(b.balance)}
                        </span>
                      </td>
                    </tr>
                    {open && (
                      <tr className="border-b border-border/60 bg-muted/20">
                        <td colSpan={6} className="px-4 py-3">
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <p className="label-mono text-muted-foreground">{lang === "tr" ? "Son siparişler" : "Recent orders"}</p>
                            <span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
                              <Mail className="h-3.5 w-3.5" />
                              {buyerOrders[0]?.email ?? "—"}
                            </span>
                          </div>
                          {buyerOrders.length > 0 ? (
                            <div className="grid gap-2 sm:grid-cols-2">
                              {buyerOrders.map((o) => {
                                const st = STATUS_META[o.status];
                                return (
                                  <div key={o.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
                                    <div className="min-w-0">
                                      <p className="tnum text-[13px] font-semibold leading-tight">{o.number}</p>
                                      <p className="tnum text-[11px] text-muted-foreground">{fmtDate(o.date)} · {o.items} {lang === "tr" ? "kalem" : "items"} · {o.ship}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-semibold", st.tone)}>{lang === "tr" ? st.tr : st.en}</span>
                                      <span className="tnum text-[13px] font-semibold">{formatUsd(o.total)}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-[13px] text-muted-foreground">{lang === "tr" ? "Bu dönemde sipariş yok." : "No orders this period."}</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    {lang === "tr" ? "Bu filtreyle alıcı yok." : "No buyers match this filter."}
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
