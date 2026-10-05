"use client";

import { useState } from "react";
import { Search, Download, Send } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatUsd, formatNumber, formatDate } from "@/lib/utils";
import { invoices, INVOICE_STATUS_META, buyers, type InvoiceRow } from "@/lib/demo/data";

type Filter = InvoiceRow["status"] | "all";

const FILTERS: { key: Filter; tr: string; en: string }[] = [
  { key: "all", tr: "Tümü", en: "All" },
  { key: "pending", tr: "Bekliyor", en: "Pending" },
  { key: "overdue", tr: "Gecikmiş", en: "Overdue" },
  { key: "paid", tr: "Ödendi", en: "Paid" },
];

export default function InvoicesPage() {
  const { lang } = useLang();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const rows = invoices.filter(
    (i) =>
      (filter === "all" || i.status === filter) &&
      (!query ||
        i.business.toLowerCase().includes(query.toLowerCase()) ||
        i.number.toLowerCase().includes(query.toLowerCase())),
  );

  const sum = (s: InvoiceRow["status"]) => invoices.filter((i) => i.status === s).reduce((a, i) => a + i.amount, 0);

  return (
    <div className="mx-auto max-w-[1200px] animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{lang === "tr" ? "Faturalar" : "Invoices"}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {lang === "tr" ? "Siparişlere bağlı faturalar, vadeler ve tahsilat durumu." : "Invoices tied to orders, due dates and collection status."}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium shadow-pill transition-colors hover:bg-muted">
            <Download className="h-4 w-4 text-muted-foreground" />
            {lang === "tr" ? "Dışa aktar" : "Export"}
          </button>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: lang === "tr" ? "Fatura" : "Invoices", value: formatNumber(invoices.length), tone: "" },
          { label: lang === "tr" ? "Tahsil edilecek" : "To collect", value: formatUsd(sum("pending")), tone: "" },
          { label: lang === "tr" ? "Gecikmiş" : "Overdue", value: formatUsd(sum("overdue")), tone: "text-destructive" },
          { label: lang === "tr" ? "Tahsil edildi" : "Collected", value: formatUsd(sum("paid")), tone: "text-success" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-[12.5px] font-medium text-muted-foreground">{s.label}</p>
            <p className={cn("mt-2 tnum text-xl font-bold leading-none", s.tone)}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-border p-4">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              const count = f.key === "all" ? invoices.length : invoices.filter((i) => i.status === f.key).length;
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
          <div className="ml-auto flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === "tr" ? "İşletme veya no…" : "Business or no…"}
              className="w-32 bg-transparent placeholder:text-muted-foreground/70 focus:outline-none sm:w-44"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="label-mono py-2.5 pl-4 font-medium text-muted-foreground">{lang === "tr" ? "Fatura" : "Invoice"}</th>
                <th className="label-mono py-2.5 font-medium text-muted-foreground">{lang === "tr" ? "İşletme" : "Business"}</th>
                <th className="label-mono py-2.5 font-medium text-muted-foreground">{lang === "tr" ? "Durum" : "Status"}</th>
                <th className="label-mono py-2.5 font-medium text-muted-foreground">{lang === "tr" ? "Vade tarihi" : "Due date"}</th>
                <th className="label-mono py-2.5 text-right font-medium text-muted-foreground">{lang === "tr" ? "Tutar" : "Amount"}</th>
                <th className="py-2.5 pr-4" />
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => {
                const st = INVOICE_STATUS_META[i.status];
                const terms = buyers.find((b) => b.business === i.business)?.terms;
                return (
                  <tr key={i.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40">
                    <td className="py-3 pl-4">
                      <p className="tnum font-semibold leading-tight">{i.number}</p>
                      {terms && <p className="text-xs text-muted-foreground">{terms}</p>}
                    </td>
                    <td className="py-3 font-medium">{i.business}</td>
                    <td className="py-3">
                      <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", st.tone)}>
                        {lang === "tr" ? st.tr : st.en}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={cn("tnum text-[13px]", i.status === "overdue" ? "font-semibold text-destructive" : "text-muted-foreground")}>
                        {formatDate(i.due, { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })}
                      </span>
                    </td>
                    <td className="tnum py-3 text-right font-semibold">{formatUsd(i.amount)}</td>
                    <td className="py-3 pr-4 text-right">
                      {i.status !== "paid" && (
                        <button className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-[12px] font-medium transition-colors hover:bg-muted">
                          <Send className="h-3.5 w-3.5 text-muted-foreground" />
                          {lang === "tr" ? "Hatırlat" : "Remind"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    {lang === "tr" ? "Bu filtreyle fatura yok." : "No invoices match this filter."}
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
