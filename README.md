# Wholesale

> **Let your buyers reorder in seconds.**

A production-grade **Next.js 16** starter for a **B2B wholesale ordering portal** —
buyers log in, see their own wholesale pricing & MOQ, and place repeat orders;
you manage orders, catalog, buyers and invoices from one panel. Inspired by real,
profitable products like **[orderwerks.com](https://orderwerks.com)** and
**[nuorder.com](https://www.nuorder.com)**. Rebrand it in five minutes.

## Quick start

```bash
npm install
npm run dev          # → http://localhost:3000  (runs in demo mode, no keys needed)
```

It boots straight into **demo mode** with realistic buyers, orders, products and
tiered pricing — no database or API keys required.

## Make it yours

Open this folder in **Claude Code** and say:

> **"set up this project"**  (or run **`/setup`**)

Claude interviews you for your **brand**, **logo**, **colors**, and the **API keys
this app needs** (Supabase, Stripe Invoicing, an ERP/inventory sync, an email
provider), then writes your `app.config.ts` and `.env.local` and boots it. Prefer
to do it by hand? Open **`START-HERE.md`**, or follow **`SETUP.md`** — every step
names the exact file to change.

## What's inside

```
app.config.ts            ← single source of truth (brand, copy, nav, integrations)
app/(marketing)/         ← landing page (hero, interactive cart demo, pricing, FAQ)
app/(app)/dashboard/     ← wholesale cockpit (orders + detail drawer, catalog, buyers, tiers)
app/(app)/orders/        ← full orders list with status filter
app/(app)/catalog/       ← product catalog with tiered pricing + MOQ
app/(app)/settings/      ← brand + integration status
components/app/          ← sidebar, topbar, inline-SVG charts
components/marketing/    ← interactive cart demo + product preview + company marks
lib/demo/data.ts         ← sample buyers / orders / products that power demo mode
.env.example             ← the keys this kit can use (all optional)
SETUP.md / START-HERE.md ← the guided-setup script
```

## Design

Clean **light** B2B SaaS system: white surfaces, hairline borders, **indigo**
accent (`oklch(55% 0.15 265)`), **Hanken Grotesk** + **JetBrains Mono**, tabular
prices & quantities. All visuals are **inline SVG / CSS** — no photos. Bilingual
**TR / EN** with a live toggle.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind v4 · lucide-react. No database
required to run — it falls back to realistic demo data.
