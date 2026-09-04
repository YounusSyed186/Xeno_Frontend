import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ChevronDown, ArrowUpRight, ShoppingBag, User, LogOut, Shield } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useAuthContext } from "@/stores/auth.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProducts } from "@/hooks/useProducts";

const links = [
  { label: "Products", to: "/products" },
  { label: "Design Studio", to: "/studio" },
  { label: "Bulk Orders", to: "/bulk-orders" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const { itemCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuthContext();

  // Fetch products for mega menu
  const { data: productsData } = useProducts({ per_page: 20 });
  const products = productsData?.products || [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [pathname]);

  return (
    <header
      className={cn("fixed inset-x-0 top-0 z-50 pointer-events-none transition-all duration-500", scrolled ? "py-2" : "py-4")}
      onMouseLeave={() => setMega(false)}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <nav
          aria-label="Main"
          className="pointer-events-auto flex items-center justify-between rounded-full bg-black/85 backdrop-blur-xl border border-white/10 px-5 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] transition-all duration-500 flex-nowrap"
        >
          {/* Logo Mark + Title */}
          <Link to="/" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Logo />
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden items-center gap-1.5 xl:flex">
            {links.map((l) => (
              <li key={l.label} onMouseEnter={() => setMega(l.to === "/products")}>
                <Link
                  to={l.to}
                  activeProps={{ className: "text-white font-semibold" }}
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {l.label}
                  {l.to === "/products" ? <ChevronDown className="size-3.5 opacity-70" aria-hidden="true" /> : null}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Cart Icon Button */}
            <Link
              to="/cart"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:bg-white/10 hover:border-white/30"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="size-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#5ef046] text-black text-[10px] font-extrabold px-1 shadow-[0_0_8px_rgba(94,240,70,0.6)]">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:bg-white/10 hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Account Menu"
                  >
                    <User className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-black/95 border border-white/15 backdrop-blur-xl text-white shadow-[0_10px_35px_rgba(0,0,0,0.9)] p-2 rounded-2xl">
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="text-sm font-semibold text-white">{user?.name || "Account"}</div>
                    {user?.email && (
                      <div className="text-xs text-zinc-400 font-normal truncate">{user.email}</div>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10 my-1" />
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-white/10 focus:text-white px-3 py-2 text-sm text-zinc-200">
                    <Link to={isAdmin ? "/admin" : "/account"} className="flex items-center gap-2.5 w-full">
                      {isAdmin ? <Shield className="size-4 text-[#5ef046]" /> : <User className="size-4 text-zinc-400" />}
                      <span>{isAdmin ? "Admin Portal" : "My Account"}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10 my-1" />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="rounded-xl cursor-pointer focus:bg-red-500/20 text-red-400 focus:text-red-300 px-3 py-2 text-sm flex items-center gap-2.5"
                  >
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="hidden text-sm font-medium text-zinc-200 hover:text-white px-3.5 py-1.5 transition-colors sm:inline-flex cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Primary Neon Action Button */}
            {isAuthenticated ? (
              <Link
                to="/studio"
                className="inline-flex items-center justify-center rounded-full bg-[#5ef046] px-5 py-2 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95 whitespace-nowrap"
              >
                Design Studio
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="inline-flex items-center justify-center rounded-full bg-[#5ef046] px-5 py-2 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95 whitespace-nowrap cursor-pointer"
              >
                Sign Up
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white xl:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>

        {/* Mega menu - now uses real products from API */}
        <div
          className={cn(
            "glass-panel mt-2 hidden origin-top rounded-3xl p-6 transition-all duration-300 pointer-events-auto xl:block bg-black/90 border border-white/10 backdrop-blur-xl",
            mega ? "scale-100 opacity-100" : "-translate-y-2 scale-[0.99] opacity-0 pointer-events-none",
          )}
          aria-hidden={!mega}
        >
          <div className="grid gap-8 lg:grid-cols-[repeat(4,1fr)_0.9fr]">
            {/* Featured Products */}
            <div key="featured">
              <h3 className="text-[0.7rem] uppercase tracking-[0.22em] text-zinc-400 font-semibold">Featured Products</h3>
              <ul className="mt-4 space-y-1">
                {products.slice(0, 4).map((p: any) => (
                  <li key={p.id}>
                    <Link
                      to="/products/$slug"
                      params={{ slug: p.slug }}
                      tabIndex={mega ? 0 : -1}
                      className="group block rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <span className="flex items-center gap-1.5">
                        {p.name}
                        <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-[#5ef046]" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div key="categories">
              <h3 className="text-[0.7rem] uppercase tracking-[0.22em] text-zinc-400 font-semibold">Categories</h3>
              <ul className="mt-4 space-y-1">
                <li>
                  <Link to="/products" search={{ category: "t-shirts" }} tabIndex={mega ? 0 : -1} className="group block rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
                    <span className="flex items-center gap-1.5">T-Shirts <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-[#5ef046]" aria-hidden="true" /></span>
                  </Link>
                </li>
                <li>
                  <Link to="/products" search={{ category: "hoodies" }} tabIndex={mega ? 0 : -1} className="group block rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
                    <span className="flex items-center gap-1.5">Hoodies <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-[#5ef046]" aria-hidden="true" /></span>
                  </Link>
                </li>
                <li>
                  <Link to="/products" search={{ category: "bags" }} tabIndex={mega ? 0 : -1} className="group block rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
                    <span className="flex items-center gap-1.5">Bags <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-[#5ef046]" aria-hidden="true" /></span>
                  </Link>
                </li>
                <li>
                  <Link to="/products" search={{ category: "mugs" }} tabIndex={mega ? 0 : -1} className="group block rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
                    <span className="flex items-center gap-1.5">Mugs <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-[#5ef046]" aria-hidden="true" /></span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Collections */}
            <div key="collections">
              <h3 className="text-[0.7rem] uppercase tracking-[0.22em] text-zinc-400 font-semibold">Collections</h3>
              <ul className="mt-4 space-y-1">
                <li>
                  <Link to="/products" search={{ collection: "summer-collection" }} tabIndex={mega ? 0 : -1} className="group block rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
                    <span className="flex items-center gap-1.5">Summer Collection <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-[#5ef046]" aria-hidden="true" /></span>
                  </Link>
                </li>
                <li>
                  <Link to="/products" search={{ collection: "winter-collection" }} tabIndex={mega ? 0 : -1} className="group block rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
                    <span className="flex items-center gap-1.5">Winter Collection <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-[#5ef046]" aria-hidden="true" /></span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* All Products Link */}
            <div key="all-products">
              <h3 className="text-[0.7rem] uppercase tracking-[0.22em] text-zinc-400 font-semibold">All Products</h3>
              <ul className="mt-4 space-y-1">
                {products.slice(0, 6).map((p: any) => (
                  <li key={p.id}>
                    <Link
                      to="/products/$slug"
                      params={{ slug: p.slug }}
                      tabIndex={mega ? 0 : -1}
                      className="group block rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <span className="flex items-center gap-1.5">
                        {p.name}
                        <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-[#5ef046]" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-semibold text-white">Not sure what you need?</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Build a product live in the Design Studio and send it straight to our team.
              </p>
              <Link to="/studio" tabIndex={mega ? 0 : -1} className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#5ef046] px-4 py-2.5 text-xs font-bold text-black hover:bg-[#4de035]">
                Open Design Studio
              </Link>
            </div>
          </div>
        </div>

        {open ? (
          <div className="glass-panel mt-2 max-h-[75vh] overflow-y-auto rounded-3xl p-4 pointer-events-auto xl:hidden bg-black/90 border border-white/10 backdrop-blur-xl">
            <ul className="grid gap-1">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="block rounded-2xl px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                {isAuthenticated ? (
                  <Link to="/studio" className="inline-flex w-full items-center justify-center rounded-full bg-[#5ef046] py-3 text-sm font-extrabold text-black">
                    Design Studio
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setOpen(false); openAuthModal('register'); }}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#5ef046] py-3 text-sm font-extrabold text-black cursor-pointer"
                  >
                    Sign Up
                  </button>
                )}
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </header>
  );
}