/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  app.config.ts — the single source of truth for this starter.            │
 * │                                                                          │
 * │  Every user-facing string is bilingual: { tr: "...", en: "..." }.        │
 * │  The guided setup (run `/setup`, or say "bu projeyi kur") edits this      │
 * │  file plus app/globals.css and .env.local.                               │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 *  WHOLESALE — a B2B wholesale ordering portal for brands & distributors.
 *  Buyers log in, see their wholesale pricing & MOQ, and place repeat orders in
 *  seconds. Modeled on real, profitable products (OrderWerks, NuORDER).
 *  English brand; copy toggles TR/EN.
 */
import type { L } from "@/lib/i18n/config";

export type IconName = string;

export interface NavItem {
  label: L;
  href: string;
  icon: IconName;
  /** Optional "Soon" / "Beta" style badge shown muted in the sidebar. */
  badge?: L;
  /** Render as disabled/muted (e.g. a not-yet-shipped section). */
  muted?: boolean;
}

export interface NavGroup {
  label: L;
  items: NavItem[];
}

export interface Feature {
  icon: IconName;
  title: L;
  body: L;
}

export interface Stat {
  value: string;
  label: L;
}

export interface PricingTier {
  name: string;
  price: string;
  period?: L;
  tagline: L;
  features: L[];
  cta: L;
  featured?: boolean;
}

export interface FaqItem {
  q: L;
  a: L;
}

export interface Integration {
  key: string;
  name: string;
  envVars: string[];
  required: boolean;
  docsUrl: string;
  purpose: string;
}

export interface AppConfig {
  name: string;
  tagline: L;
  description: L;
  domain: string;
  logoText: string;
  accentName: string;
  marketing: {
    badge: L;
    heroTitle: L;
    heroAccent: L;
    heroSubtitle: L;
    heroCtaPrimary: L;
    heroCtaSecondary: L;
    features: Feature[];
    stats: Stat[];
    pricing: PricingTier[];
    faq: FaqItem[];
  };
  /** Sidebar navigation, grouped (Workspace / Management). */
  navGroups: NavGroup[];
  /** Flat nav (kept for the topbar title lookup + back-compat). */
  nav: NavItem[];
  integrations: Integration[];
}

export const appConfig: AppConfig = {
  name: "Wholesale",
  tagline: {
    tr: "Alıcılarını saniyeler içinde yeniden sipariş ettir.",
    en: "Let your buyers reorder in seconds.",
  },
  description: {
    tr: "Markalar ve distribütörler için B2B toptan sipariş portalı. Alıcıların giriş yapar, kendi toptan fiyatlarını ve minimum sipariş miktarını görür, tek tıkla tekrar sipariş verir. Sen de siparişleri, faturaları ve cari hesapları tek panelde yönetirsin.",
    en: "A B2B wholesale ordering portal for brands and distributors. Buyers log in, see their own wholesale pricing and MOQ, and place repeat orders in one tap. You manage orders, invoices and account balances in one panel.",
  },
  domain: "wholesale.app",
  logoText: "W",
  accentName: "indigo",

  marketing: {
    badge: { tr: "B2B toptan sipariş portalı", en: "B2B wholesale ordering portal" },
    heroTitle: {
      tr: "Alıcıların saniyeler içinde",
      en: "Let your buyers reorder",
    },
    heroAccent: {
      tr: "yeniden sipariş versin.",
      en: "in seconds.",
    },
    heroSubtitle: {
      tr: "E-posta ve telefon siparişlerini bırak. Alıcılarına kendi toptan fiyatlarını, kademeli indirimleri ve MOQ kurallarını gösteren markalı bir portal ver. Onlar sipariş verir, sen tek panelden karşılarsın.",
      en: "Drop the email and phone orders. Give buyers a branded portal that shows their wholesale pricing, tiered discounts and MOQ rules. They order, you fulfill — all in one panel.",
    },
    heroCtaPrimary: { tr: "Ücretsiz başla", en: "Start free" },
    heroCtaSecondary: { tr: "Canlı demoyu gör", en: "See the live demo" },
    features: [
      { icon: "book-open", title: { tr: "Özel kataloglar", en: "Custom catalogs" }, body: { tr: "Her alıcıya kendi koleksiyonunu göster — özel SKU'lar, gizli ürünler ve sezonluk listeler.", en: "Show each buyer their own assortment — custom SKUs, hidden products and seasonal line sheets." } },
      { icon: "layers", title: { tr: "Kademeli fiyatlandırma", en: "Tiered pricing" }, body: { tr: "Miktara ve alıcı grubuna göre fiyat kademeleri tanımla. Doğru fiyat otomatik uygulanır.", en: "Define price breaks by quantity and buyer group. The right price applies automatically." } },
      { icon: "ruler", title: { tr: "MOQ kuralları", en: "MOQ rules" }, body: { tr: "Ürün ve koli başına minimum sipariş miktarını zorunlu kıl; eksik sepetler sipariş veremez.", en: "Enforce minimum order quantities per product and case; carts below MOQ can't check out." } },
      { icon: "repeat", title: { tr: "Tekrar sipariş", en: "Repeat ordering" }, body: { tr: "Geçmiş siparişlerden tek tıkla yeniden sipariş; en çok alınanlar her zaman elinin altında.", en: "One-tap reorder from past orders; top buys are always a click away." } },
      { icon: "users", title: { tr: "Alıcı hesapları", en: "Buyer accounts" }, body: { tr: "Her işletme için ödeme vadesi, kredi limiti ve bakiye. Onaylı alıcılar kendi koşullarını görür.", en: "Payment terms, credit limit and balance per business. Approved buyers see their own terms." } },
      { icon: "receipt-text", title: { tr: "Faturalama", en: "Invoicing" }, body: { tr: "Onaylanan her sipariş otomatik faturaya bağlanır; net-30 vadeler ve ödeme takibi dahil.", en: "Every confirmed order ties to an invoice — net-30 terms and payment tracking included." } },
    ],
    stats: [
      { value: "-70%", label: { tr: "sipariş süresi", en: "order time" } },
      { value: "24/7", label: { tr: "alıcı portalı", en: "buyer portal" } },
      { value: "$0", label: { tr: "kurulum", en: "to set up" } },
      { value: "1", label: { tr: "tek panel", en: "single panel" } },
    ],
    pricing: [
      { name: "Starter", price: "$0", period: { tr: "/ay", en: "/mo" }, tagline: { tr: "İlk alıcılarını topla.", en: "Onboard your first buyers." }, features: [{ tr: "5 alıcıya kadar", en: "Up to 5 buyers" }, { tr: "1 katalog", en: "1 catalog" }, { tr: "Temel MOQ kuralları", en: "Basic MOQ rules" }, { tr: "Manuel faturalama", en: "Manual invoicing" }], cta: { tr: "Başla", en: "Get started" } },
      { name: "Growth", price: "$79", period: { tr: "/ay", en: "/mo" }, tagline: { tr: "Büyüyen markalar için.", en: "For scaling brands." }, features: [{ tr: "Sınırsız alıcı", en: "Unlimited buyers" }, { tr: "Çoklu katalog & kademeli fiyat", en: "Multi-catalog & tiered pricing" }, { tr: "Otomatik faturalama", en: "Automated invoicing" }, { tr: "ERP & stok senkronu", en: "ERP & inventory sync" }, { tr: "Öncelikli destek", en: "Priority support" }], cta: { tr: "Ücretsiz dene", en: "Start free trial" }, featured: true },
      { name: "Distributor", price: "Custom", tagline: { tr: "Kurumsal distribütörler için.", en: "For enterprise distributors." }, features: [{ tr: "Growth'taki her şey", en: "Everything in Growth" }, { tr: "Roller & onay akışları", en: "Roles & approval flows" }, { tr: "Özel fiyat anlaşmaları", en: "Custom price agreements" }, { tr: "SLA & denetim kaydı", en: "SLA & audit log" }, { tr: "Özel hesap yöneticisi", en: "Dedicated manager" }], cta: { tr: "Satışa ulaş", en: "Contact sales" } },
    ],
    faq: [
      { q: { tr: "Alıcılarım nasıl giriş yapacak?", en: "How do my buyers log in?" }, a: { tr: "Onları e-postayla davet edersin; markalı portalına giriş yapıp yalnızca kendilerine atanan katalog, fiyat ve vadeleri görürler.", en: "You invite them by email; they log into your branded portal and see only the catalog, pricing and terms assigned to them." } },
      { q: { tr: "Kademeli fiyatlandırma nasıl çalışıyor?", en: "How does tiered pricing work?" }, a: { tr: "Her ürün için miktar kademeleri (örn. 1-11, 12-47, 48+) ve alıcı grubu fiyatları tanımlarsın. Doğru birim fiyat sepette otomatik uygulanır.", en: "For each product you define quantity breaks (e.g. 1-11, 12-47, 48+) and buyer-group prices. The right unit price applies automatically in the cart." } },
      { q: { tr: "MOQ (minimum sipariş) zorunlu mu?", en: "Is MOQ enforced?" }, a: { tr: "İstersen. Ürün ve koli başına minimumlar koyabilir, eşiğin altındaki sepetlerin sipariş vermesini engelleyebilirsin.", en: "If you want it to be. You can set per-product and per-case minimums and block carts below the threshold from checking out." } },
      { q: { tr: "Faturalama dahil mi?", en: "Is invoicing included?" }, a: { tr: "Evet. Onaylanan her sipariş otomatik bir faturaya bağlanır; net-30 gibi vadeleri ve ödeme durumunu takip edersin.", en: "Yes. Every confirmed order ties to an invoice; you track terms like net-30 and payment status." } },
      { q: { tr: "ERP veya stoğuma bağlanır mı?", en: "Does it connect to my ERP or inventory?" }, a: { tr: "Stok ve sipariş senkronu için bir ERP/envanter entegrasyonu sağlanır; anahtar yoksa demo verisiyle çalışır.", en: "An ERP/inventory integration keeps stock and orders in sync; without a key it runs on demo data." } },
      { q: { tr: "Denemek için anahtar gerekli mi?", en: "Do I need keys to try it?" }, a: { tr: "Hayır. Gerçekçi alıcı, sipariş ve ürün verisiyle demo modda açılır — hemen tıklayabilirsin.", en: "No. It boots in demo mode with realistic buyers, orders and products — click around immediately." } },
      { q: { tr: "Teknoloji nedir?", en: "What's the stack?" }, a: { tr: "Next.js 16, React 19, Tailwind v4. Supabase, Stripe Invoicing, bir ERP senkronu ve e-posta ile bağlanır.", en: "Next.js 16, React 19, Tailwind v4. Wires to Supabase, Stripe Invoicing, an ERP sync and email." } },
      { q: { tr: "Yayına alabilir miyim?", en: "Can I deploy it?" }, a: { tr: "Evet — standart bir Next.js uygulaması. Vercel'e veya herhangi bir Node sunucusuna gönder.", en: "Yes — it's a standard Next.js app. Push to Vercel or any Node host." } },
    ],
  },

  navGroups: [
    {
      label: { tr: "Çalışma alanı", en: "Workspace" },
      items: [
        { label: { tr: "Panel", en: "Dashboard" }, href: "/dashboard", icon: "layout-dashboard" },
        { label: { tr: "Siparişler", en: "Orders" }, href: "/orders", icon: "shopping-cart" },
        { label: { tr: "Katalog", en: "Catalog" }, href: "/catalog", icon: "book-open" },
        { label: { tr: "Alıcılar", en: "Buyers" }, href: "/buyers", icon: "users" },
        { label: { tr: "Faturalar", en: "Invoices" }, href: "/invoices", icon: "receipt-text" },
      ],
    },
    {
      label: { tr: "Yönetim", en: "Management" },
      items: [
        { label: { tr: "Fiyat kademeleri", en: "Pricing tiers" }, href: "/pricing-tiers", icon: "layers" },
        { label: { tr: "Stok senkronu", en: "Inventory sync" }, href: "/inventory", icon: "boxes" },
        { label: { tr: "Raporlar", en: "Reports" }, href: "/reports", icon: "chart-no-axes-column" },
        { label: { tr: "Entegrasyonlar", en: "Integrations" }, href: "/settings", icon: "plug" },
      ],
    },
  ],

  nav: [
    { label: { tr: "Panel", en: "Dashboard" }, href: "/dashboard", icon: "layout-dashboard" },
    { label: { tr: "Siparişler", en: "Orders" }, href: "/orders", icon: "shopping-cart" },
    { label: { tr: "Katalog", en: "Catalog" }, href: "/catalog", icon: "book-open" },
    { label: { tr: "Ayarlar", en: "Settings" }, href: "/settings", icon: "settings" },
  ],

  integrations: [
    {
      key: "supabase",
      name: "Supabase",
      envVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
      required: false,
      docsUrl: "https://supabase.com/dashboard/project/_/settings/api",
      purpose: "Database & buyer auth. Without it, the app runs in demo mode.",
    },
    {
      key: "stripe",
      name: "Stripe Invoicing",
      envVars: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
      required: false,
      docsUrl: "https://dashboard.stripe.com/apikeys",
      purpose: "Invoices, net-30 terms and wholesale payment collection. Demo data without it.",
    },
    {
      key: "erp_sync",
      name: "ERP / Inventory Sync",
      envVars: ["ERP_API_URL", "ERP_API_KEY"],
      required: false,
      docsUrl: "https://www.cin7.com/developers/",
      purpose: "Two-way sync of products, stock levels and orders with your ERP/inventory system.",
    },
    {
      key: "resend",
      name: "Resend (email)",
      envVars: ["RESEND_API_KEY"],
      required: false,
      docsUrl: "https://resend.com/api-keys",
      purpose: "Buyer invites, order confirmations and invoice emails. Logged to console without it.",
    },
  ],
};

export default appConfig;
