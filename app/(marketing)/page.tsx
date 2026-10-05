"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  Quote,
  Star,
  Package,
  Layers,
  Ruler,
  RotateCcw,
  Users,
  ReceiptText,
  Upload,
  Mail,
  Truck,
} from "lucide-react";
import appConfig from "@/app.config";
import { Icon } from "@/components/ui/icon";
import { CartDemo } from "@/components/marketing/cart-demo";
import { ProductPreview, CompanyMark } from "@/components/marketing/marks";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";
import type { L } from "@/lib/i18n/config";

/* ─────────────────────────────────────────────────────────────────────────────
   Local bilingual copy that doesn't belong in app.config.ts. Everything here is
   { tr, en } and resolved through the active language via tt().
   ───────────────────────────────────────────────────────────────────────────── */

const HERO_BENEFITS: L[] = [
  { tr: "Her alıcı kendi toptan fiyatını ve MOQ'sunu görür", en: "Every buyer sees their own wholesale price and MOQ" },
  { tr: "Geçmiş siparişlerden tek tıkla yeniden sipariş", en: "One-tap reorder from any past order" },
  { tr: "Onaylanan her sipariş otomatik faturaya bağlanır", en: "Every confirmed order auto-ties to an invoice" },
];

const TRUSTED = ["Northwind", "Parable", "Formwork", "Cedarworks", "Lumen", "Harvest", "Brightline", "Meridian"];

const HOW_STEPS: { n: string; icon: typeof Upload; title: L; body: L }[] = [
  {
    n: "01",
    icon: Upload,
    title: { tr: "Kataloğu yükle", en: "Upload your catalog" },
    body: { tr: "Ürünlerini, koli boyutlarını ve kademeli toptan fiyatlarını CSV ile içe aktar ya da ERP'inden senkronla.", en: "Import products, case sizes and tiered wholesale prices via CSV — or sync from your ERP." },
  },
  {
    n: "02",
    icon: Mail,
    title: { tr: "Alıcıları davet et", en: "Invite your buyers" },
    body: { tr: "İşletmeleri e-postayla davet et, ödeme vadesi ve fiyat kademesi ata. Onaylananlar portala girer.", en: "Invite businesses by email, assign payment terms and a price tier. Approved buyers enter the portal." },
  },
  {
    n: "03",
    icon: Package,
    title: { tr: "Onlar sipariş versin", en: "They order" },
    body: { tr: "Alıcıların kendi fiyatlarını görür, MOQ kurallarına uyar ve 7/24 kendi başlarına sipariş verir.", en: "Buyers see their pricing, respect MOQ rules and place orders themselves — 24/7." },
  },
  {
    n: "04",
    icon: Truck,
    title: { tr: "Sen karşıla", en: "You fulfill" },
    body: { tr: "Siparişleri tek panelden onayla, faturalandır ve kargola. Stok ve cari otomatik güncellenir.", en: "Confirm, invoice and ship from one panel. Stock and balances update automatically." },
  },
];

type CompareValue = boolean | L | string;
const COMPARE: { feature: L; email: CompareValue; store: CompareValue; wholesale: CompareValue }[] = [
  { feature: { tr: "Alıcıya özel fiyat", en: "Buyer-specific pricing" }, email: { tr: "Manuel", en: "Manual" }, store: false, wholesale: true },
  { feature: { tr: "Kademeli miktar indirimi", en: "Tiered quantity discounts" }, email: false, store: { tr: "Sınırlı", en: "Limited" }, wholesale: true },
  { feature: { tr: "MOQ zorunluluğu", en: "MOQ enforcement" }, email: { tr: "El yordamı", en: "By hand" }, store: false, wholesale: true },
  { feature: { tr: "Tek tıkla tekrar sipariş", en: "One-tap reorder" }, email: false, store: { tr: "Kısmi", en: "Partial" }, wholesale: true },
  { feature: { tr: "Ödeme vadesi (Net 30)", en: "Payment terms (Net 30)" }, email: { tr: "E-tabloda", en: "In a spreadsheet" }, store: false, wholesale: true },
  { feature: { tr: "Otomatik faturalama", en: "Automated invoicing" }, email: false, store: { tr: "Kısmi", en: "Partial" }, wholesale: true },
  { feature: { tr: "Sipariş süresi", en: "Time to order" }, email: { tr: "Saatler", en: "Hours" }, store: { tr: "Dakikalar", en: "Minutes" }, wholesale: { tr: "Saniyeler", en: "Seconds" } },
];

const TESTIMONIALS: { quote: L; name: string; role: L; initials: string; metric: L }[] = [
  { quote: { tr: "Sipariş alma süremizi %70 düşürdük. Alıcılar kendileri giriyor, biz sadece onaylıyoruz.", en: "We cut order-taking time by 70%. Buyers enter orders themselves; we just confirm." }, name: "Maria Gomez", role: { tr: "Satış Md. · Northwind", en: "Head of Sales · Northwind" }, initials: "MG", metric: { tr: "Sipariş süresi -%70", en: "Order time -70%" } },
  { quote: { tr: "Telefon ve e-posta siparişleri bitti. Her şey portalda, fiyatlar her zaman doğru.", en: "No more phone and email orders. It's all in the portal, and prices are always right." }, name: "Liam Chen", role: { tr: "Kurucu · Parable", en: "Founder · Parable" }, initials: "LC", metric: { tr: "0 fiyat hatası", en: "0 price errors" } },
  { quote: { tr: "Kademeli fiyat ve MOQ kuralları otomatik. Artık 'yanlış fiyat verdim' yok.", en: "Tiered pricing and MOQ rules are automatic. No more 'I quoted the wrong price.'" }, name: "Nadia Park", role: { tr: "Operasyon · Formwork", en: "Ops · Formwork" }, initials: "NP", metric: { tr: "%100 doğru fiyat", en: "100% correct pricing" } },
  { quote: { tr: "Tekrar sipariş özelliği ortalama sepet tutarımızı belirgin artırdı.", en: "Repeat ordering noticeably lifted our average order value." }, name: "Aisha Khan", role: { tr: "CEO · Lumen", en: "CEO · Lumen" }, initials: "AK", metric: { tr: "Sepet +%22", en: "AOV +22%" } },
  { quote: { tr: "Kataloğu yükledik, alıcıları davet ettik, aynı gün ilk sipariş geldi.", en: "We uploaded the catalog, invited buyers, and the first order landed same day." }, name: "Diego Santos", role: { tr: "Sahip · Harvest", en: "Owner · Harvest" }, initials: "DS", metric: { tr: "1 günde canlı", en: "Live in a day" } },
  { quote: { tr: "Net-30 vadeleri ve faturalar tek yerde. Muhasebe ekibimiz bayıldı.", en: "Net-30 terms and invoices in one place. Our accounting team loves it." }, name: "Sven Olsen", role: { tr: "Finans · Meridian", en: "Finance · Meridian" }, initials: "SO", metric: { tr: "Mutabakat -8s/hafta", en: "Recon -8h/wk" } },
];

/* Who Wholesale is for — use-case cards. */
const USE_CASES: { icon: string; title: L; body: L }[] = [
  { icon: "coffee", title: { tr: "Yiyecek & içecek markaları", en: "Food & beverage brands" }, body: { tr: "Kafelere ve marketlere koli bazlı, kademeli fiyatla sat; tekrar siparişi otomatikleştir.", en: "Sell to cafés and grocers by the case at tiered prices; automate the reorder." } },
  { icon: "shirt", title: { tr: "Tekstil & aksesuar", en: "Apparel & accessories" }, body: { tr: "Beden/renk varyantlı line sheet'ler, sezonluk kataloglar ve mağaza bazlı fiyat.", en: "Size/color line sheets, seasonal catalogs and store-specific pricing." } },
  { icon: "sparkles", title: { tr: "Güzellik & cilt bakımı", en: "Beauty & skincare" }, body: { tr: "Perakendecilere MOQ ve kademeli indirimle sat; stoğu ERP'inle senkron tut.", en: "Sell to retailers with MOQ and tier discounts; keep stock synced with your ERP." } },
  { icon: "package", title: { tr: "Distribütörler", en: "Distributors" }, body: { tr: "Yüzlerce SKU ve onaylı alıcıyı tek portalda yönet; rollerle ekibini yetkilendir.", en: "Manage hundreds of SKUs and approved buyers in one portal; gate your team with roles." } },
];

/* Control & reliability strip — what a serious wholesaler needs to trust it. */
const CONTROL: { icon: typeof Users; title: L; body: L }[] = [
  { icon: Users, title: { tr: "Onaylı alıcılar", en: "Approved buyers only" }, body: { tr: "Portala yalnızca davet ettiğin işletmeler girer; herkese açık fiyat yok.", en: "Only businesses you invite can enter the portal; no public pricing." } },
  { icon: Layers, title: { tr: "Sen fiyatı yönetirsin", en: "You control the price" }, body: { tr: "Kademeler, indirimler ve özel anlaşmalar tamamen senin elinde — anlık güncellenir.", en: "Tiers, discounts and custom agreements are entirely yours — updated instantly." } },
  { icon: ReceiptText, title: { tr: "Defterler her zaman denk", en: "Books that balance" }, body: { tr: "Her sipariş bir faturaya bağlanır; bakiye, kredi limiti ve vade hep güncel.", en: "Every order ties to an invoice; balances, credit limits and terms stay current." } },
];

/* Deep-dive feature blocks (alternating). */
const DEEP_DIVE: { eyebrow: L; title: L; body: L; points: L[]; reverse?: boolean }[] = [
  {
    eyebrow: { tr: "Katalog", en: "Catalog" },
    title: { tr: "Her alıcıya kendi koleksiyonu", en: "Every buyer, their own assortment" },
    body: { tr: "Alıcı grubuna göre ürünleri göster ya da gizle. Özel SKU'lar, sezonluk line sheet'ler ve mağazaya özel fiyat — hepsi tek katalogdan yönetilir.", en: "Show or hide products per buyer group. Custom SKUs, seasonal line sheets and store-specific prices — all managed from one catalog." },
    points: [
      { tr: "Alıcı grubuna göre görünürlük", en: "Per-group product visibility" },
      { tr: "Sezonluk & gizli koleksiyonlar", en: "Seasonal & hidden assortments" },
      { tr: "Koli boyutu ve stok seviyeleri", en: "Case sizes and stock levels" },
    ],
  },
  {
    eyebrow: { tr: "Fiyatlandırma", en: "Pricing" },
    title: { tr: "Doğru fiyat, otomatik uygulanır", en: "The right price, applied automatically" },
    body: { tr: "Miktar kademeleri ve alıcı grubu fiyatları tanımla; sepet doğru birim fiyatı kendi seçer. MOQ eşiğin altındaki sepetler sipariş veremez.", en: "Define quantity breaks and buyer-group prices; the cart picks the right unit price itself. Carts below your MOQ threshold can't check out." },
    points: [
      { tr: "Miktar kademeleri (1-11, 12-47, 48+)", en: "Quantity breaks (1-11, 12-47, 48+)" },
      { tr: "Bronze → Platinum alıcı grupları", en: "Bronze → Platinum buyer groups" },
      { tr: "Ürün & koli başına MOQ", en: "Per-product and per-case MOQ" },
    ],
    reverse: true,
  },
  {
    eyebrow: { tr: "Faturalama", en: "Invoicing" },
    title: { tr: "Sipariş → fatura → ödeme", en: "Order → invoice → paid" },
    body: { tr: "Onaylanan her sipariş otomatik bir faturaya bağlanır. Net-30 gibi vadeleri uygula, ödeme durumunu takip et, cari hesabı her zaman güncel tut.", en: "Every confirmed order ties to an invoice. Apply terms like net-30, track payment status, and keep account balances always current." },
    points: [
      { tr: "Otomatik fatura oluşturma", en: "Automatic invoice creation" },
      { tr: "Net-15 / Net-30 / Prepaid vadeleri", en: "Net-15 / Net-30 / Prepaid terms" },
      { tr: "Kredi limiti & bakiye takibi", en: "Credit-limit & balance tracking" },
    ],
  },
];

/* Integration logos for the strip. */
const INTEGRATIONS: { name: string; glyph: "db" | "card" | "erp" | "mail" }[] = [
  { name: "Supabase", glyph: "db" },
  { name: "Stripe Invoicing", glyph: "card" },
  { name: "ERP / Inventory", glyph: "erp" },
  { name: "Resend", glyph: "mail" },
];

export default function LandingPage() {
  const { t, lang } = useLang();
  const m = appConfig.marketing;
  const tt = (v: L) => v[lang];

  const sectionCopy = {
    demoTitle: { tr: "Bir alıcı saniyeler içinde sipariş versin", en: "Watch a buyer order in seconds" } as L,
    demoSub: { tr: "Ürün ekle, miktarı koli koli artır, doğru kademe fiyatını gör ve MOQ kontrolünden geçince siparişi ver.", en: "Add products, bump quantities by the case, watch the tier price apply, clear the MOQ check, and place the order." } as L,
    featuresTitle: { tr: "B2B toptan satış için ihtiyacın olan her şey", en: "Everything you need to sell wholesale" } as L,
    featuresSub: { tr: "Katalogdan tekrar siparişe, faturaya kadar tek panel.", en: "From catalog to reorder to invoice, in one panel." } as L,
    howTitle: { tr: "Dört adımda canlı", en: "Live in four steps" } as L,
    howSub: { tr: "Yükle, davet et, sipariş gelsin, karşıla. Aradaki her şeyi Wholesale halleder.", en: "Upload, invite, they order, you fulfill. Wholesale handles everything in between." } as L,
    portalTitle: { tr: "Alıcı portalına yakından bak", en: "Inside the buyer portal" } as L,
    portalSub: { tr: "Alıcıların yalnızca kendilerine atanan kataloğu, fiyatı ve vadeleri görür.", en: "Buyers see only the catalog, pricing and terms assigned to them." } as L,
    useCasesTitle: { tr: "Wholesale kimler için?", en: "Who Wholesale is for" } as L,
    useCasesSub: { tr: "Tekrar eden siparişlerle toptan satan her marka için bir akış.", en: "A flow for every brand selling wholesale on repeat." } as L,
    deepTitle: { tr: "Katalogdan deftere kadar", en: "From catalog to the ledger" } as L,
    deepSub: { tr: "Üç katman, tek panel: katalog, fiyatlandırma, faturalama.", en: "Three layers, one panel: catalog, pricing, invoicing." } as L,
    integrationsTitle: { tr: "Sevdiğin araçlarla çalışır", en: "Works with the tools you love" } as L,
    integrationsSub: { tr: "Supabase, Stripe, ERP'in ve e-postanı dakikalar içinde bağla.", en: "Wire Supabase, Stripe, your ERP and email in minutes." } as L,
    compareTitle: { tr: "Neden Wholesale?", en: "Why Wholesale?" } as L,
    compareSub: { tr: "E-posta/telefon siparişleri ve genel mağaza yazılımıyla karşılaştır.", en: "Compared to email/phone orders and generic store software." } as L,
    controlTitle: { tr: "Kontrol sende kalır", en: "You stay in control" } as L,
    controlSub: { tr: "Toptan satış güven ister: kim ne fiyata alır, ne zaman öder — hepsi senin elinde.", en: "Wholesale needs trust: who buys at what price, and when they pay — all yours to decide." } as L,
    testimonialsTitle: { tr: "Markalar Wholesale'i seviyor", en: "Brands love Wholesale" } as L,
    testimonialsSub: { tr: "Toptan satan işletmelerden.", en: "From businesses selling wholesale." } as L,
    pricingTitle: { tr: "Basit, büyümeyle ölçeklenen fiyatlandırma", en: "Simple pricing that scales with you" } as L,
    pricingSub: { tr: "Ücretsiz başla. Sadece büyüdükçe yükselt.", en: "Start free. Upgrade only as you grow." } as L,
    popular: { tr: "En popüler", en: "Most popular" } as L,
    faqTitle: { tr: "Sıkça sorulanlar", en: "Frequently asked" } as L,
    faqSub: { tr: "Cevabını bulamadın mı? Ekibimize yaz.", en: "Can't find an answer? Reach our team." } as L,
    ctaTitle: { tr: "Alıcılarını bugün portala taşı", en: "Move your buyers into a portal today" } as L,
    ctaSub: { tr: "Anahtarsız demo modda aç, hazır olunca Supabase ve Stripe'ı bağla.", en: "Open the keyless demo, then wire Supabase and Stripe when you're ready." } as L,
  };

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)" }} aria-hidden />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left copy */}
          <div className="stagger">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-pill">
              <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
              {t(m.badge)}
            </span>
            <h1 className="mt-5 max-w-xl font-display text-[40px] font-extrabold leading-[1.03] tracking-[-0.03em] sm:text-[56px]">
              {t(m.heroTitle)}{" "}
              <span className="bg-gradient-to-br from-[oklch(58%_0.16_262)] to-[oklch(50%_0.17_290)] bg-clip-text text-transparent">
                {t(m.heroAccent)}
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted-foreground">{t(m.heroSubtitle)}</p>

            <ul className="mt-6 space-y-2.5">
              {HERO_BENEFITS.map((b) => (
                <li key={tt(b)} className="flex items-start gap-2.5 text-[15px]">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/12 text-success">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {tt(b)}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                {t(m.heroCtaPrimary)} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 text-[15px] font-semibold text-foreground shadow-pill transition-colors hover:bg-muted"
              >
                {t(m.heroCtaSecondary)}
              </Link>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              {lang === "tr" ? "Kredi kartı gerekmez · Anahtarsız demo · 5 dakikada kurulum" : "No credit card · Keyless demo · 5-minute setup"}
            </p>
          </div>

          {/* Right floating product preview (a buyer order screen) */}
          <div className="relative animate-float-up lg:pl-4">
            <div className="absolute -left-6 -top-6 -z-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl drift" aria-hidden />
            <div className="absolute -bottom-8 -right-4 -z-10 h-44 w-44 rounded-full bg-[oklch(58%_0.16_290)]/10 blur-3xl" aria-hidden />
            <ProductPreview />
          </div>
        </div>

        {/* Trusted-by row */}
        <div className="border-y border-border bg-card/50">
          <div className="mx-auto max-w-6xl px-5 py-6">
            <p className="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {lang === "tr" ? "Toptan satan markalar tarafından kullanılıyor" : "Used by brands that sell wholesale"}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
              {TRUSTED.map((c) => (
                <CompanyMark key={c} name={c} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-soft sm:grid-cols-4">
          {[
            { value: "-70%", label: { tr: "sipariş süresi", en: "order time" } as L },
            { value: "$2.4M+", label: { tr: "işlenen sipariş", en: "orders processed" } as L },
            { value: "640+", label: { tr: "aktif alıcı", en: "active buyers" } as L },
            { value: "24/7", label: { tr: "alıcı portalı", en: "buyer portal" } as L },
          ].map((s) => (
            <div key={s.value} className="bg-card px-5 py-8 text-center">
              <p className="font-display text-3xl font-extrabold tracking-tight">{s.value}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{tt(s.label)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTERACTIVE DEMO ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="label-mono text-primary">{lang === "tr" ? "Canlı sepet" : "Live cart"}</p>
            <h2 className="mt-2 max-w-md font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.demoTitle)}</h2>
            <p className="mt-3 max-w-md text-muted-foreground">{tt(sectionCopy.demoSub)}</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {m.stats.slice(0, 3).map((s) => (
                <div key={s.value} className="rounded-xl border border-border bg-card p-3 shadow-soft">
                  <p className="tnum text-xl font-bold leading-none">{s.value}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{t(s.label)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2.5">
              {[
                { tr: "Miktar koli boyutuna göre artar", en: "Quantities snap to case size" },
                { tr: "Fiyat, kademe geçince düşer", en: "Price drops as you cross a break" },
                { tr: "MOQ altındaki sepet sipariş veremez", en: "Carts below MOQ can't check out" },
              ].map((p) => (
                <p key={p.en} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  {lang === "tr" ? p.tr : p.en}
                </p>
              ))}
            </div>
          </div>
          <CartDemo />
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section id="features" className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.featuresTitle)}</h2>
            <p className="mt-3 text-muted-foreground">{tt(sectionCopy.featuresSub)}</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {m.features.map((f) => (
              <div key={tt(f.title)} className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-pop">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon name={f.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold tracking-tight">{t(f.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(f.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.howTitle)}</h2>
          <p className="mt-3 text-muted-foreground">{tt(sectionCopy.howSub)}</p>
        </div>
        <div className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {HOW_STEPS.map((s, i) => {
            const I = s.icon;
            return (
              <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <I className="h-5 w-5" />
                  </span>
                  <span className="font-display text-3xl font-extrabold text-primary/15">{s.n}</span>
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">{tt(s.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tt(s.body)}</p>
                {i < HOW_STEPS.length - 1 && (
                  <span className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-muted-foreground lg:grid">
                    <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── DEEP-DIVE FEATURE BLOCKS ──────────────────────────────── */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.deepTitle)}</h2>
            <p className="mt-3 text-muted-foreground">{tt(sectionCopy.deepSub)}</p>
          </div>
          <div className="mt-14 space-y-16">
            {DEEP_DIVE.map((d, idx) => (
              <div
                key={tt(d.title)}
                className={cn("grid items-center gap-10 lg:grid-cols-2", d.reverse && "lg:[&>*:first-child]:order-2")}
              >
                <div>
                  <p className="label-mono text-primary">{tt(d.eyebrow)}</p>
                  <h3 className="mt-2 max-w-md font-display text-2xl font-bold tracking-tight sm:text-3xl">{tt(d.title)}</h3>
                  <p className="mt-3 max-w-md text-muted-foreground">{tt(d.body)}</p>
                  <ul className="mt-5 space-y-2.5">
                    {d.points.map((p) => (
                      <li key={tt(p)} className="flex items-start gap-2.5 text-[15px]">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {tt(p)}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* a small illustrative panel */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  {idx === 0 && (
                    <div className="space-y-2.5">
                      {[
                        { sku: "CFE-250", name: lang === "tr" ? "Tek Köken Kahve 250g" : "Single-Origin Coffee 250g", on: true },
                        { sku: "SRM-30", name: lang === "tr" ? "C Vitamini Serum 30ml" : "Vitamin C Serum 30ml", on: true },
                        { sku: "NTB-A5", name: lang === "tr" ? "Keten Defter A5 (gizli)" : "Linen Notebook A5 (hidden)", on: false },
                      ].map((r) => (
                        <div key={r.sku} className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Package className="h-4 w-4" /></span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-semibold leading-tight">{r.name}</p>
                            <p className="tnum text-[11px] text-muted-foreground">{r.sku}</p>
                          </div>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", r.on ? "bg-success/10 text-success" : "bg-muted text-muted-foreground")}>
                            {r.on ? (lang === "tr" ? "görünür" : "visible") : (lang === "tr" ? "gizli" : "hidden")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {idx === 1 && (
                    <div className="space-y-3">
                      <p className="text-[12px] font-medium text-muted-foreground">{lang === "tr" ? "CFE-250 · kademeli fiyat" : "CFE-250 · price breaks"}</p>
                      {[
                        { q: "24–71", p: "$9.20" },
                        { q: "72–143", p: "$8.70" },
                        { q: "144+", p: "$8.40", best: true },
                      ].map((r) => (
                        <div key={r.q} className={cn("flex items-center justify-between rounded-xl border p-3", r.best ? "border-primary/40 bg-primary/[0.05]" : "border-border bg-muted/40")}>
                          <span className="tnum text-[13px] font-medium">{r.q} {lang === "tr" ? "ad." : "u"}</span>
                          <span className="tnum text-[13px] font-semibold">{r.p}{r.best && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[9px] text-primary-foreground">{lang === "tr" ? "en iyi" : "best"}</span>}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {idx === 2 && (
                    <div className="space-y-2.5">
                      {[
                        { inv: "INV-2041", terms: "Net 30", paid: false },
                        { inv: "INV-2039", terms: "Net 15", paid: true },
                        { inv: "INV-2037", terms: "Net 30", paid: true },
                      ].map((r) => (
                        <div key={r.inv} className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3 text-[13px]">
                          <ReceiptText className="h-4 w-4 text-muted-foreground" />
                          <span className="tnum font-semibold">{r.inv}</span>
                          <span className="tnum text-muted-foreground">{r.terms}</span>
                          <span className={cn("ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold", r.paid ? "bg-success/10 text-success" : "bg-warning/15 text-warning-foreground")}>
                            {r.paid ? (lang === "tr" ? "ödendi" : "paid") : (lang === "tr" ? "bekliyor" : "due")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUYER-PORTAL DEEP DIVE ────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="label-mono text-primary">{lang === "tr" ? "Alıcı portalı" : "Buyer portal"}</p>
            <h2 className="mt-2 max-w-md font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.portalTitle)}</h2>
            <p className="mt-3 max-w-md text-muted-foreground">{tt(sectionCopy.portalSub)}</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Layers, title: { tr: "Sadece kendi fiyatları", en: "Only their pricing" }, body: { tr: "Atanan kademe ve indirim otomatik uygulanır.", en: "Their assigned tier and discount apply automatically." } },
                { icon: Ruler, title: { tr: "MOQ görünür", en: "MOQ in view" }, body: { tr: "Her ürünün minimumu ve koli boyutu net.", en: "Each product's minimum and case size are clear." } },
                { icon: RotateCcw, title: { tr: "Tek tıkla tekrar", en: "One-tap reorder" }, body: { tr: "Geçmiş sipariş anında sepete döner.", en: "A past order returns to the cart instantly." } },
                { icon: ReceiptText, title: { tr: "Faturalarını gör", en: "See their invoices" }, body: { tr: "Açık bakiye ve vadeler portalda.", en: "Open balance and terms live in the portal." } },
              ].map((b) => {
                const I = b.icon;
                return (
                  <div key={tt(b.title)} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><I className="h-5 w-5" /></span>
                    <h3 className="mt-3 text-sm font-semibold tracking-tight">{tt(b.title)}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{tt(b.body)}</p>
                  </div>
                );
              })}
            </div>
          </div>
          {/* a portal preview */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-pop">
            <div className="flex items-center gap-2.5 border-b border-border pb-4">
              <span className="grid h-9 w-9 place-items-center rounded-lg text-[10px] font-bold text-white" style={{ backgroundImage: "var(--grad-brand)" }}>PC</span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-tight">Parable Cafés</p>
                <p className="text-[11px] text-muted-foreground">{lang === "tr" ? "Gold kademe · Net 30 · bakiye $18,600" : "Gold tier · Net 30 · balance $18,600"}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              {[
                { name: lang === "tr" ? "Ev Karışımı Kahve 1kg" : "House Blend Coffee 1kg", price: "$18.50", moq: "12" },
                { name: lang === "tr" ? "Vanilya Şurubu 750ml" : "Vanilla Syrup 750ml", price: "$5.40", moq: "24" },
                { name: lang === "tr" ? "Kompostlanabilir Bardak 16oz" : "Compostable Cup 16oz", price: "$6.00", moq: "20" },
                { name: lang === "tr" ? "Espresso Kapsülü — 50'li" : "Espresso Pods — 50ct", price: "$14.00", moq: "12" },
              ].map((r) => (
                <div key={r.name} className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Package className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold leading-tight">{r.name}</p>
                    <p className="tnum text-[11px] text-muted-foreground">MOQ {r.moq}</p>
                  </div>
                  <span className="tnum text-[13px] font-semibold">{r.price}</span>
                  <button className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground"><Plus className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
            {/* portal footer summary */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-[12px]">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <RotateCcw className="h-3.5 w-3.5" />
                {lang === "tr" ? "Son sipariş: 9 gün önce" : "Last order: 9 days ago"}
              </span>
              <button className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 font-semibold text-primary-foreground">
                {lang === "tr" ? "Yeniden sipariş" : "Reorder"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── USE CASES ─────────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.useCasesTitle)}</h2>
            <p className="mt-3 text-muted-foreground">{tt(sectionCopy.useCasesSub)}</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map((u) => (
              <div key={tt(u.title)} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon name={u.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold tracking-tight">{tt(u.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tt(u.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.compareTitle)}</h2>
          <p className="mt-3 text-muted-foreground">{tt(sectionCopy.compareSub)}</p>
        </div>
        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-4 text-left font-medium text-muted-foreground"></th>
                  <th className="px-5 py-4 text-center font-medium text-muted-foreground">{lang === "tr" ? "E-posta / telefon" : "Email / phone"}</th>
                  <th className="px-5 py-4 text-center font-medium text-muted-foreground">{lang === "tr" ? "Genel mağaza" : "Generic store"}</th>
                  <th className="bg-primary/[0.04] px-5 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
                      <Package className="h-4 w-4" />
                      {appConfig.name}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={tt(row.feature)} className={cn("border-b border-border/60 last:border-0", i % 2 === 1 && "bg-muted/20")}>
                    <td className="px-5 py-3.5 font-medium">{tt(row.feature)}</td>
                    <CompareCell value={row.email} lang={lang} />
                    <CompareCell value={row.store} lang={lang} />
                    <CompareCell value={row.wholesale} lang={lang} highlight />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CONTROL & RELIABILITY STRIP ───────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{tt(sectionCopy.controlTitle)}</h2>
          <p className="mt-3 text-muted-foreground">{tt(sectionCopy.controlSub)}</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {CONTROL.map((c) => {
            const I = c.icon;
            return (
              <div key={tt(c.title)} className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <I className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold tracking-tight">{tt(c.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tt(c.body)}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── INTEGRATIONS ──────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{tt(sectionCopy.integrationsTitle)}</h2>
            <p className="mt-3 text-muted-foreground">{tt(sectionCopy.integrationsSub)}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INTEGRATIONS.map((it) => (
              <div key={it.name} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
                <IntegrationGlyph glyph={it.glyph} />
                <div className="min-w-0">
                  <p className="truncate font-semibold tracking-tight">{it.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {it.glyph === "db" ? (lang === "tr" ? "Veritabanı & auth" : "Database & auth") : it.glyph === "card" ? (lang === "tr" ? "Faturalama" : "Invoicing") : it.glyph === "erp" ? (lang === "tr" ? "Stok senkronu" : "Inventory sync") : (lang === "tr" ? "E-posta" : "Email")}
                  </p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {lang === "tr" ? "Hazır" : "Ready"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.testimonialsTitle)}</h2>
          <p className="mt-3 text-muted-foreground">{tt(sectionCopy.testimonialsSub)}</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((tm) => (
            <figure key={tm.name} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
              <Quote className="h-5 w-5 text-primary/30" />
              <blockquote className="mt-3 flex-1 text-[14.5px] leading-relaxed text-foreground/90">
                {tt(tm.quote)}
              </blockquote>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ backgroundImage: "var(--grad-brand)" }}>
                  {tm.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <figcaption className="text-sm font-semibold leading-tight">{tm.name}</figcaption>
                  <p className="truncate text-xs text-muted-foreground">{tt(tm.role)}</p>
                </div>
                <span className="rounded-full bg-success/10 px-2 py-1 text-[11px] font-semibold text-success">{tt(tm.metric)}</span>
              </div>
            </figure>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-warning text-warning" />
          ))}
          <span className="ml-2">{lang === "tr" ? "4.9/5 · 640+ alıcı" : "4.9/5 · 640+ buyers"}</span>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────── */}
      <section id="pricing" className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.pricingTitle)}</h2>
            <p className="mt-3 text-muted-foreground">{tt(sectionCopy.pricingSub)}</p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {m.pricing.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  "flex flex-col rounded-2xl border bg-card p-7 shadow-soft",
                  tier.featured ? "border-primary/40 shadow-pop ring-1 ring-primary/20" : "border-border",
                )}
              >
                {tier.featured && (
                  <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                    <Star className="h-3 w-3 fill-current" />
                    {tt(sectionCopy.popular)}
                  </span>
                )}
                <h3 className="font-semibold tracking-tight">{tier.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold tracking-tight">{tier.price}</span>
                  {tier.period && <span className="text-sm text-muted-foreground">{t(tier.period)}</span>}
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{t(tier.tagline)}</p>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {tier.features.map((f) => (
                    <li key={t(f)} className="flex items-start gap-2.5">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-success/12 text-success">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      {t(f)}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={cn(
                    "mt-7 inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-all",
                    tier.featured
                      ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90"
                      : "border border-border bg-card text-foreground hover:bg-muted",
                  )}
                >
                  {t(tier.cta)}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-20">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.faqTitle)}</h2>
          <p className="mt-3 text-muted-foreground">{tt(sectionCopy.faqSub)}</p>
        </div>
        <div className="mt-10 space-y-3">
          {m.faq.map((f) => (
            <details key={t(f.q)} className="group rounded-xl border border-border bg-card px-5 py-4 shadow-soft">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {t(f.q)}
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors group-open:border-primary group-open:bg-primary group-open:text-primary-foreground">
                  <Plus className="h-3.5 w-3.5 group-open:hidden" />
                  <Minus className="hidden h-3.5 w-3.5 group-open:block" />
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(f.a)}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-16 text-center shadow-pop">
          <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)" }} aria-hidden />
          <span className="pointer-events-none absolute -left-10 top-0 -z-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl drift" aria-hidden />
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-pill">
            <Package className="h-4 w-4 text-primary" />
            <span>{lang === "tr" ? "Toptan sipariş portalı · canlı" : "Wholesale ordering portal · live"}</span>
          </div>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{tt(sectionCopy.ctaTitle)}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{tt(sectionCopy.ctaSub)}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-[15px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              {t(m.heroCtaPrimary)} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-7 text-[15px] font-semibold text-foreground shadow-pill transition-colors hover:bg-muted"
            >
              {t(m.heroCtaSecondary)}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function IntegrationGlyph({ glyph }: { glyph: "db" | "card" | "erp" | "mail" }) {
  const color =
    glyph === "db" ? "var(--color-success)" : glyph === "card" ? "var(--color-primary)" : glyph === "erp" ? "var(--seg-2)" : "var(--color-info)";
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: color }}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        {glyph === "db" && <path d="M4 6 c0 -1.7 3.6 -3 8 -3 s8 1.3 8 3 v12 c0 1.7 -3.6 3 -8 3 s-8 -1.3 -8 -3 z M4 6 c0 1.7 3.6 3 8 3 s8 -1.3 8 -3 M4 12 c0 1.7 3.6 3 8 3 s8 -1.3 8 -3" />}
        {glyph === "card" && <path d="M3 7 h18 v10 h-18 z M3 11 h18" />}
        {glyph === "erp" && <path d="M3 9 L12 4 L21 9 L12 14 Z M3 9 v6 l9 5 9 -5 v-6 M12 14 v6" />}
        {glyph === "mail" && <path d="M3 6 h18 v12 h-18 z M3 7 l9 7 9 -7" />}
      </svg>
    </span>
  );
}

function CompareCell({
  value,
  lang,
  highlight = false,
}: {
  value: boolean | L | string;
  lang: "tr" | "en";
  highlight?: boolean;
}) {
  const text = typeof value === "string" ? value : typeof value === "object" ? value[lang] : null;
  return (
    <td className={cn("px-5 py-3.5 text-center", highlight && "bg-primary/[0.04]")}>
      {typeof value === "boolean" ? (
        value ? (
          <span className={cn("mx-auto grid h-5 w-5 place-items-center rounded-full", highlight ? "bg-primary text-primary-foreground" : "bg-success/12 text-success")}>
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        ) : (
          <span className="mx-auto grid h-5 w-5 place-items-center rounded-full bg-muted text-muted-foreground">
            <Minus className="h-3 w-3" />
          </span>
        )
      ) : (
        <span className={cn("text-[13px] font-medium", highlight ? "text-primary" : "text-muted-foreground")}>{text}</span>
      )}
    </td>
  );
}
