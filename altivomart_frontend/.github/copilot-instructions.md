# Copilot Instructions for Altivomart Frontend

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js e-commerce frontend for Altivomart, a Nigerian pay-on-delivery platform. The project uses:
- Next.js 15.5.3 with App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Lucide React icons

## Design System
Use the Minimal & Trustworthy Blue Palette:
- primary: "#2563EB" (CTA buttons, highlights)
- secondary: "#1E293B" (Navbar, headings)
- accent: "#38BDF8" (Hover states, links)
- background: "#F9FAFB" (Page background)
- success: "#22C55E" (In Stock)
- danger: "#EF4444" (Out of Stock)

## Key Features
1. Homepage with product listing and stock status
2. Product details page with image carousel
3. Checkout page for pay-on-delivery orders
4. Order tracking page
5. Responsive mobile-first design

## Backend Integration
- API base URL: http://localhost:8000/api/
- Endpoints: /products/, /orders/create/, /orders/{id}/

## Code Guidelines
- Use TypeScript for all components
- Follow Next.js App Router patterns
- Implement responsive design with Tailwind
- Use shadcn/ui components for consistent UI
- Focus on trustworthy, clean design for Nigerian market
