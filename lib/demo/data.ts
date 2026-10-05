/**
 * Demo data — what makes the kit feel alive with zero API keys. Labels are
 * bilingual ({ tr, en }); the UI resolves them to the active language. Proper
 * nouns and free text (business names, emails, SKUs) stay as-is. Replace with
 * real queries once setup wires Supabase / Stripe / your ERP.
 *
 * Wholesale ordering portal: buyers place repeat orders at wholesale prices.
 */
import type { L } from "@/lib/i18n/config";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "paid";

/* ── Top stat row ───────────────────────────────────────────────────────────── */
export interface DKpi {
  label: L;
  value: string;
  delta?: number;
  hint?: L;
}

const vsLast: L = { tr: "geçen aya göre", en: "vs last month" };

export const kpis: DKpi[] = [
  { label: { tr: "Siparişler", en: "Orders" }, value: "318", delta: 14.2, hint: vsLast },
  { label: { tr: "Gelir", en: "Revenue" }, value: "$182,400", delta: 11.6, hint: vsLast },
  { label: { tr: "Aktif alıcı", en: "Active buyers" }, value: "64", delta: 6.3, hint: vsLast },
  { label: { tr: "Ort. sipariş tutarı", en: "Avg order value" }, value: "$574", delta: 4.1, hint: vsLast },
];

/* ── Summary cards (top of the cockpit) ───────────────────────────────────────── */
export const summary = {
  openOrders: {
    label: { tr: "Açık siparişler", en: "Open orders" } as L,
    value: 28,
    valueUsd: 16480,
    countLabel: { tr: "onay bekliyor", en: "awaiting confirm" } as L,
    count: 9,
  },
  outstanding: {
    label: { tr: "Açık bakiye", en: "Outstanding balance" } as L,
    value: 42190,
    overdue: 3,
  },
  revenue30d: {
    label: { tr: "Son 30 gün gelir", en: "Revenue · 30d" } as L,
    value: 182400,
  },
};

/* ── Orders list ──────────────────────────────────────────────────────────────── */
export interface OrderLine {
  sku: string;
  name: string;
  qty: number;
  unit: number; // wholesale unit price applied (after tier)
}

export interface OrderRow {
  id: string;
  number: string;
  buyer: string; // contact
  business: string;
  email: string;
  items: number; // distinct line count
  units: number; // total units
  total: number;
  status: OrderStatus;
  date: string;
  terms: string; // payment terms label
  ship: string; // ship-to city
  lines: OrderLine[];
}

export const orders: OrderRow[] = [
  {
    id: "o1",
    number: "WO-4821",
    buyer: "Maria Gomez",
    business: "Northwind Grocers",
    email: "maria@northwind.co",
    items: 4,
    units: 312,
    total: 4288.4,
    status: "confirmed",
    date: "2026-06-13T09:12:00Z",
    terms: "Net 30",
    ship: "Austin, TX",
    lines: [
      { sku: "CFE-250", name: "Single-Origin Coffee 250g", qty: 144, unit: 8.4 },
      { sku: "TEA-100", name: "Loose-Leaf Tea Tin 100g", qty: 96, unit: 6.2 },
      { sku: "MUG-12", name: "Ceramic Mug — Case of 12", qty: 48, unit: 21.0 },
      { sku: "FLT-50", name: "Paper Filters — Box 50", qty: 24, unit: 3.1 },
    ],
  },
  {
    id: "o2",
    number: "WO-4820",
    buyer: "Liam Chen",
    business: "Parable Cafés",
    email: "liam@parable.io",
    items: 3,
    units: 540,
    total: 6120.0,
    status: "shipped",
    date: "2026-06-12T16:40:00Z",
    terms: "Net 30",
    ship: "Portland, OR",
    lines: [
      { sku: "CFE-1KG", name: "House Blend Coffee 1kg", qty: 240, unit: 18.5 },
      { sku: "SYR-750", name: "Vanilla Syrup 750ml", qty: 180, unit: 5.4 },
      { sku: "CUP-16", name: "Compostable Cup 16oz — 50ct", qty: 120, unit: 6.0 },
    ],
  },
  {
    id: "o3",
    number: "WO-4819",
    buyer: "Nadia Park",
    business: "Formwork Studio Store",
    email: "nadia@formwork.studio",
    items: 5,
    units: 196,
    total: 2940.0,
    status: "pending",
    date: "2026-06-12T11:05:00Z",
    terms: "Prepaid",
    ship: "Brooklyn, NY",
    lines: [
      { sku: "NTB-A5", name: "Linen Notebook A5", qty: 60, unit: 7.2 },
      { sku: "PEN-FN", name: "Fineliner Pen — 6 pack", qty: 48, unit: 9.5 },
      { sku: "STK-001", name: "Sticker Sheet Assortment", qty: 40, unit: 2.4 },
      { sku: "TOT-CV", name: "Canvas Tote Bag", qty: 24, unit: 11.0 },
      { sku: "CRD-10", name: "Greeting Card — 10 pack", qty: 24, unit: 6.8 },
    ],
  },
  {
    id: "o4",
    number: "WO-4818",
    buyer: "Tom Reilly",
    business: "Cedarworks Hardware",
    email: "tom@cedarworks.com",
    items: 3,
    units: 84,
    total: 1512.0,
    status: "paid",
    date: "2026-06-11T14:22:00Z",
    terms: "Net 15",
    ship: "Denver, CO",
    lines: [
      { sku: "WAX-500", name: "Furniture Wax 500ml", qty: 36, unit: 12.0 },
      { sku: "BRS-2", name: 'Brass Brush 2"', qty: 24, unit: 8.5 },
      { sku: "OIL-1L", name: "Tung Oil 1L", qty: 24, unit: 16.0 },
    ],
  },
  {
    id: "o5",
    number: "WO-4817",
    buyer: "Aisha Khan",
    business: "Lumen Skincare",
    email: "aisha@lumen.app",
    items: 4,
    units: 432,
    total: 7344.0,
    status: "confirmed",
    date: "2026-06-11T08:48:00Z",
    terms: "Net 30",
    ship: "Miami, FL",
    lines: [
      { sku: "SRM-30", name: "Vitamin C Serum 30ml", qty: 144, unit: 19.0 },
      { sku: "CLN-150", name: "Gentle Cleanser 150ml", qty: 120, unit: 9.5 },
      { sku: "MSK-5", name: "Clay Mask — 5 pack", qty: 96, unit: 14.0 },
      { sku: "BAL-15", name: "Lip Balm 15ml", qty: 72, unit: 4.5 },
    ],
  },
  {
    id: "o6",
    number: "WO-4816",
    buyer: "Diego Santos",
    business: "Harvest Provisions",
    email: "diego@harvest.farm",
    items: 2,
    units: 288,
    total: 2160.0,
    status: "shipped",
    date: "2026-06-10T19:30:00Z",
    terms: "Net 30",
    ship: "Sacramento, CA",
    lines: [
      { sku: "JAM-340", name: "Fruit Preserve 340g", qty: 168, unit: 5.0 },
      { sku: "HNY-500", name: "Wildflower Honey 500g", qty: 120, unit: 10.5 },
    ],
  },
  {
    id: "o7",
    number: "WO-4815",
    buyer: "Emma Wright",
    business: "Brightline Pet Co.",
    email: "emma@brightline.dev",
    items: 3,
    units: 156,
    total: 1872.0,
    status: "pending",
    date: "2026-06-10T10:15:00Z",
    terms: "Prepaid",
    ship: "Seattle, WA",
    lines: [
      { sku: "TRT-200", name: "Dog Treats 200g", qty: 72, unit: 4.8 },
      { sku: "TOY-RP", name: "Rope Toy — Large", qty: 48, unit: 6.5 },
      { sku: "BWL-S", name: "Steel Bowl — Small", qty: 36, unit: 9.0 },
    ],
  },
  {
    id: "o8",
    number: "WO-4814",
    buyer: "Sven Olsen",
    business: "Meridian Outfitters",
    email: "sven@meridian.co",
    items: 4,
    units: 220,
    total: 5060.0,
    status: "paid",
    date: "2026-06-09T13:05:00Z",
    terms: "Net 30",
    ship: "Minneapolis, MN",
    lines: [
      { sku: "SCK-WL", name: "Merino Socks — Pair", qty: 96, unit: 11.0 },
      { sku: "BNI-AC", name: "Acrylic Beanie", qty: 60, unit: 8.0 },
      { sku: "GLV-TC", name: "Touch Gloves", qty: 40, unit: 13.0 },
      { sku: "BTL-1L", name: "Insulated Bottle 1L", qty: 24, unit: 18.0 },
    ],
  },
];

export const STATUS_META: Record<OrderStatus, { tr: string; en: string; tone: string }> = {
  pending: { tr: "bekliyor", en: "pending", tone: "text-warning-foreground bg-warning/15" },
  confirmed: { tr: "onaylandı", en: "confirmed", tone: "text-info bg-info/10" },
  shipped: { tr: "kargolandı", en: "shipped", tone: "text-[--color-status-shipped] bg-[--color-status-shipped]/10" },
  paid: { tr: "ödendi", en: "paid", tone: "text-success bg-success/10" },
};

/* ── Product catalog (tiered wholesale pricing + MOQ) ──────────────────────────── */
export interface PriceBreak {
  min: number; // min qty for this tier
  price: number; // unit price
}

export interface Product {
  sku: string;
  name: string;
  category: L;
  moq: number; // minimum order quantity
  caseSize: number;
  stock: number;
  msrp: number; // retail reference
  breaks: PriceBreak[]; // tiered wholesale prices
}

export const products: Product[] = [
  {
    sku: "CFE-250",
    name: "Single-Origin Coffee 250g",
    category: { tr: "Kahve", en: "Coffee" },
    moq: 24,
    caseSize: 12,
    stock: 1840,
    msrp: 16.0,
    breaks: [
      { min: 24, price: 9.2 },
      { min: 72, price: 8.7 },
      { min: 144, price: 8.4 },
    ],
  },
  {
    sku: "CFE-1KG",
    name: "House Blend Coffee 1kg",
    category: { tr: "Kahve", en: "Coffee" },
    moq: 12,
    caseSize: 6,
    stock: 960,
    msrp: 34.0,
    breaks: [
      { min: 12, price: 20.0 },
      { min: 60, price: 19.0 },
      { min: 120, price: 18.5 },
    ],
  },
  {
    sku: "TEA-100",
    name: "Loose-Leaf Tea Tin 100g",
    category: { tr: "Çay", en: "Tea" },
    moq: 24,
    caseSize: 12,
    stock: 1320,
    msrp: 12.5,
    breaks: [
      { min: 24, price: 6.8 },
      { min: 96, price: 6.2 },
    ],
  },
  {
    sku: "SRM-30",
    name: "Vitamin C Serum 30ml",
    category: { tr: "Cilt bakımı", en: "Skincare" },
    moq: 36,
    caseSize: 12,
    stock: 720,
    msrp: 38.0,
    breaks: [
      { min: 36, price: 20.0 },
      { min: 96, price: 19.0 },
      { min: 240, price: 18.0 },
    ],
  },
  {
    sku: "NTB-A5",
    name: "Linen Notebook A5",
    category: { tr: "Kırtasiye", en: "Stationery" },
    moq: 20,
    caseSize: 10,
    stock: 540,
    msrp: 15.0,
    breaks: [
      { min: 20, price: 7.6 },
      { min: 60, price: 7.2 },
    ],
  },
  {
    sku: "JAM-340",
    name: "Fruit Preserve 340g",
    category: { tr: "Gıda", en: "Pantry" },
    moq: 48,
    caseSize: 24,
    stock: 2160,
    msrp: 9.5,
    breaks: [
      { min: 48, price: 5.4 },
      { min: 168, price: 5.0 },
    ],
  },
  {
    sku: "SCK-WL",
    name: "Merino Socks — Pair",
    category: { tr: "Tekstil", en: "Apparel" },
    moq: 24,
    caseSize: 12,
    stock: 880,
    msrp: 22.0,
    breaks: [
      { min: 24, price: 11.8 },
      { min: 96, price: 11.0 },
    ],
  },
  {
    sku: "TRT-200",
    name: "Dog Treats 200g",
    category: { tr: "Evcil hayvan", en: "Pet" },
    moq: 36,
    caseSize: 12,
    stock: 1440,
    msrp: 9.0,
    breaks: [
      { min: 36, price: 5.0 },
      { min: 72, price: 4.8 },
    ],
  },
];

/** Resolve the wholesale unit price for a given quantity (tier lookup). */
export function priceForQty(p: Product, qty: number): number {
  let price = p.breaks[0].price;
  for (const b of p.breaks) if (qty >= b.min) price = b.price;
  return price;
}

/* ── Buyers list ──────────────────────────────────────────────────────────────── */
export interface Buyer {
  id: string;
  business: string;
  contact: string;
  terms: string;
  creditLimit: number;
  balance: number;
  orders: number;
  tier: string; // pricing tier name
}

export const buyers: Buyer[] = [
  { id: "b1", business: "Northwind Grocers", contact: "Maria Gomez", terms: "Net 30", creditLimit: 25000, balance: 8420, orders: 38, tier: "Gold" },
  { id: "b2", business: "Parable Cafés", contact: "Liam Chen", terms: "Net 30", creditLimit: 40000, balance: 18600, orders: 52, tier: "Gold" },
  { id: "b3", business: "Formwork Studio Store", contact: "Nadia Park", terms: "Prepaid", creditLimit: 0, balance: 0, orders: 11, tier: "Silver" },
  { id: "b4", business: "Cedarworks Hardware", contact: "Tom Reilly", terms: "Net 15", creditLimit: 15000, balance: 1512, orders: 24, tier: "Silver" },
  { id: "b5", business: "Lumen Skincare", contact: "Aisha Khan", terms: "Net 30", creditLimit: 50000, balance: 22040, orders: 41, tier: "Platinum" },
  { id: "b6", business: "Harvest Provisions", contact: "Diego Santos", terms: "Net 30", creditLimit: 20000, balance: 5180, orders: 29, tier: "Silver" },
  { id: "b7", business: "Brightline Pet Co.", contact: "Emma Wright", terms: "Prepaid", creditLimit: 0, balance: 0, orders: 7, tier: "Bronze" },
];

/* ── Order volume over time ──────────────────────────────────────────────────── */
export const volume: { label: string; value: number }[] = [
  { label: "Jan", value: 112000 },
  { label: "Feb", value: 128400 },
  { label: "Mar", value: 121900 },
  { label: "Apr", value: 146200 },
  { label: "May", value: 163800 },
  { label: "Jun", value: 182400 },
];

export const volumeMeta = {
  title: { tr: "Sipariş hacmi", en: "Order volume" } as L,
  subtitle: { tr: "Son 6 ay · aylık gelir", en: "Last 6 months · monthly revenue" } as L,
  delta: "+11.4%",
};

/* ── Quick-reorder (top reorder products) ─────────────────────────────────────── */
export interface ReorderItem {
  sku: string;
  name: string;
  lastQty: number;
  unit: number;
  cadence: L; // e.g. "every 2 weeks"
}

export const reorder: ReorderItem[] = [
  { sku: "CFE-250", name: "Single-Origin Coffee 250g", lastQty: 144, unit: 8.4, cadence: { tr: "2 haftada bir", en: "every 2 weeks" } },
  { sku: "CFE-1KG", name: "House Blend Coffee 1kg", lastQty: 240, unit: 18.5, cadence: { tr: "Haftalık", en: "weekly" } },
  { sku: "SRM-30", name: "Vitamin C Serum 30ml", lastQty: 144, unit: 19.0, cadence: { tr: "Aylık", en: "monthly" } },
  { sku: "JAM-340", name: "Fruit Preserve 340g", lastQty: 168, unit: 5.0, cadence: { tr: "3 haftada bir", en: "every 3 weeks" } },
];

/* ── Pricing tiers panel ──────────────────────────────────────────────────────── */
export interface PricingTierRow {
  name: string;
  discount: string; // off MSRP
  minVolume: string; // qualifying monthly volume
  buyers: number;
  color: string;
}

export const pricingTiers: PricingTierRow[] = [
  { name: "Bronze", discount: "30%", minVolume: "$0", buyers: 12, color: "var(--seg-4)" },
  { name: "Silver", discount: "40%", minVolume: "$2,500/mo", buyers: 26, color: "var(--seg-1)" },
  { name: "Gold", discount: "48%", minVolume: "$7,500/mo", buyers: 19, color: "var(--seg-2)" },
  { name: "Platinum", discount: "55%", minVolume: "$20,000/mo", buyers: 7, color: "var(--seg-3)" },
];

/* ── Activity feed ────────────────────────────────────────────────────────────── */
export interface DActivity {
  id: string;
  who: string;
  action: L;
  target: string;
  at: string;
  tone: "neutral" | "success" | "warning" | "info";
}

export const activity: DActivity[] = [
  { id: "a1", who: "Maria Gomez", action: { tr: "sipariş verdi:", en: "placed order" }, target: "WO-4821", at: "2026-06-13T09:12:00Z", tone: "info" },
  { id: "a2", who: "System", action: { tr: "fatura ödendi:", en: "invoice paid" }, target: "INV-2041", at: "2026-06-13T08:40:00Z", tone: "success" },
  { id: "a3", who: "Lumen Skincare", action: { tr: "Platinum kademeye yükseldi", en: "upgraded to Platinum" }, target: "", at: "2026-06-12T19:20:00Z", tone: "success" },
  { id: "a4", who: "System", action: { tr: "düşük stok:", en: "low stock" }, target: "SRM-30 · 720u", at: "2026-06-12T16:05:00Z", tone: "warning" },
  { id: "a5", who: "Cedarworks Hardware", action: { tr: "yeniden sipariş etti", en: "reordered" }, target: "WO-4818", at: "2026-06-11T11:48:00Z", tone: "neutral" },
];

/* ── Recent invoices (dashboard panel) ────────────────────────────────────────── */
export interface InvoiceRow {
  id: string;
  number: string;
  business: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  due: string;
}

export const invoices: InvoiceRow[] = [
  { id: "i1", number: "INV-2041", business: "Northwind Grocers", amount: 4288.4, status: "pending", due: "2026-07-13" },
  { id: "i2", number: "INV-2040", business: "Parable Cafés", amount: 6120.0, status: "pending", due: "2026-07-12" },
  { id: "i3", number: "INV-2039", business: "Cedarworks Hardware", amount: 1512.0, status: "paid", due: "2026-06-26" },
  { id: "i4", number: "INV-2038", business: "Lumen Skincare", amount: 7344.0, status: "overdue", due: "2026-06-10" },
  { id: "i5", number: "INV-2037", business: "Meridian Outfitters", amount: 5060.0, status: "paid", due: "2026-06-24" },
];

/* ── Landing interactive demo: a buyer's cart at wholesale prices ─────────────── */
export interface DemoCatalogItem {
  sku: string;
  name: L;
  moq: number;
  step: number;
  breaks: PriceBreak[];
}

export const demoCatalog: DemoCatalogItem[] = [
  {
    sku: "CFE-250",
    name: { tr: "Tek Köken Kahve 250g", en: "Single-Origin Coffee 250g" },
    moq: 24,
    step: 12,
    breaks: [
      { min: 24, price: 9.2 },
      { min: 72, price: 8.7 },
      { min: 144, price: 8.4 },
    ],
  },
  {
    sku: "TEA-100",
    name: { tr: "Demlik Çay Kutusu 100g", en: "Loose-Leaf Tea Tin 100g" },
    moq: 24,
    step: 12,
    breaks: [
      { min: 24, price: 6.8 },
      { min: 96, price: 6.2 },
    ],
  },
  {
    sku: "MUG-12",
    name: { tr: "Seramik Kupa — 12'li Koli", en: "Ceramic Mug — Case of 12" },
    moq: 12,
    step: 12,
    breaks: [
      { min: 12, price: 22.0 },
      { min: 48, price: 21.0 },
    ],
  },
];

export function demoPriceForQty(item: DemoCatalogItem, qty: number): number {
  let price = item.breaks[0].price;
  for (const b of item.breaks) if (qty >= b.min) price = b.price;
  return price;
}
