import { useEffect, useState, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ChevronDown, ArrowRight, ArrowUpRight, ShoppingBag, User, LogOut, Shield, Sparkles, Layers, Shirt } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useAuthContext } from "@/stores/auth.store";
import { useCollections, useCategories } from "@/hooks/useProducts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const primaryLinks = [
  { label: "T-Shirts", to: "/custom-t-shirts", hasMenu: true },
  { label: "Wedding Cards", to: "/wedding-cards", hasMenu: false },
  { label: "Stickers", to: "/stickers", hasMenu: false },
  { label: "Bulk Orders", to: "/bulk-orders", hasMenu: false },
  { label: "About", to: "/about", hasMenu: false },
  { label: "Contact", to: "/contact", hasMenu: false },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const { data: collectionsData } = useCollections();
  const collectionsList = (Array.isArray(collectionsData) ? collectionsData : (collectionsData?.data || [])) as Array<{ id: number; name: string; slug: string }>;

  const { data: categoriesData } = useCategories();
  const categoriesList = (Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data || [])) as Array<{ id: number; name: string; slug: string }>;

  const { itemCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuthContext();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setMega(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setMega(false);
    }, 350);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMega(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [pathname]);

  return (
    <header
      className={cn("fixed inset-x-0 top-0 z-50 pointer-events-none transition-all duration-500", scrolled ? "py-2" : "py-4")}
    >
      <div
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 pointer-events-none"
        onMouseLeave={handleMouseLeave}
      >
        <nav
          aria-label="Main"
          className="pointer-events-auto flex items-center justify-between rounded-full bg-black/85 backdrop-blur-xl border border-white/10 px-5 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] transition-all duration-500 flex-nowrap"
        >
          {/* Logo Mark + Title */}
          <Link to="/" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Logo />
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden items-center gap-1 xl:gap-2 lg:flex">
            {primaryLinks.map((l) => (
              <li
                key={l.label}
                className="relative"
                onMouseEnter={() => {
                  if (l.hasMenu) {
                    handleMouseEnter();
                  } else {
                    handleMouseLeave();
                  }
                }}
              >
                {l.hasMenu ? (
                  <button
                    type="button"
                    onClick={() => setMega((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs xl:text-sm font-medium text-zinc-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                  >
                    <span>{l.label}</span>
                    <ChevronDown className={cn("size-3.5 opacity-70 transition-transform duration-200", mega && "rotate-180 text-[#5ef046]")} aria-hidden="true" />
                  </button>
                ) : (
                  <Link
                    to={l.to}
                    activeProps={{ className: "text-white font-semibold" }}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs xl:text-sm font-medium text-zinc-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {l.label}
                  </Link>
                )}
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

            {/* Customise T-Shirt CTA Button */}
            <Link
              to="/custom-t-shirts"
              className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-full bg-[#5ef046] px-4.5 py-2 text-xs xl:text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="size-3.5" />
              <span>Design Your T-Shirt</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>

        {/* T-Shirts & Collections Mega Menu Dropdown */}
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "glass-panel relative mt-2 origin-top rounded-3xl p-6 transition-all duration-300 bg-black/95 border border-white/10 backdrop-blur-2xl shadow-2xl before:absolute before:-top-6 before:left-0 before:right-0 before:h-8 before:content-['']",
            mega
              ? "block pointer-events-auto scale-100 opacity-100 translate-y-0"
              : "hidden pointer-events-none -translate-y-2 scale-[0.99] opacity-0",
          )}
          aria-hidden={!mega}
        >
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Collections Grid (8 cols) */}
            <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="size-4 text-[#5ef046]" />
                    <h3 className="text-xs uppercase tracking-[0.2em] text-[#5ef046] font-bold">Featured Collections</h3>
                  </div>
                  <Link
                    to="/products"
                    search={{ category: "t-shirts" } as any}
                    className="text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    View All T-Shirts
                  </Link>
                </div>
                
                <div className="grid gap-2 sm:grid-cols-2">
                  <Link
                    to="/products"
                    search={{ collection: "streetwear-drop" } as any}
                    className="group rounded-xl p-3 hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                  >
                    <div className="text-sm font-bold text-white group-hover:text-[#5ef046] transition-colors flex items-center justify-between">
                      <span>Streetwear Drop</span>
                      <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#5ef046]" />
                    </div>
                    <p className="mt-1 text-xs text-zinc-400 leading-snug">
                      240+ GSM heavyweight, boxy drop-shoulder cuts & cyber prints.
                    </p>
                  </Link>

                  <Link
                    to="/products"
                    search={{ collection: "summer-collection" } as any}
                    className="group rounded-xl p-3 hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                  >
                    <div className="text-sm font-bold text-white group-hover:text-[#5ef046] transition-colors flex items-center justify-between">
                      <span>Summer Collection</span>
                      <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#5ef046]" />
                    </div>
                    <p className="mt-1 text-xs text-zinc-400 leading-snug">
                      100% breathable combed cotton tees for casual everyday wear.
                    </p>
                  </Link>

                  <Link
                    to="/products"
                    search={{ collection: "corporate-gifting" } as any}
                    className="group rounded-xl p-3 hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                  >
                    <div className="text-sm font-bold text-white group-hover:text-[#5ef046] transition-colors flex items-center justify-between">
                      <span>Corporate & Team Merch</span>
                      <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#5ef046]" />
                    </div>
                    <p className="mt-1 text-xs text-zinc-400 leading-snug">
                      Polo tees & uniform kits tailored with precision company embroidery.
                    </p>
                  </Link>

                  <Link
                    to="/products"
                    search={{ collection: "winter-collection" } as any}
                    className="group rounded-xl p-3 hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                  >
                    <div className="text-sm font-bold text-white group-hover:text-[#5ef046] transition-colors flex items-center justify-between">
                      <span>Winter Heavyweight</span>
                      <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#5ef046]" />
                    </div>
                    <p className="mt-1 text-xs text-zinc-400 leading-snug">
                      Warm fleeced hoodies, crewnecks and heavyweight winter garments.
                    </p>
                  </Link>

                  <Link
                    to="/products"
                    search={{ collection: "tech-dev-stickers" } as any}
                    className="group rounded-xl p-3 hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                  >
                    <div className="text-sm font-bold text-white group-hover:text-[#5ef046] transition-colors flex items-center justify-between">
                      <span>Developer & Tech Series</span>
                      <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#5ef046]" />
                    </div>
                    <p className="mt-1 text-xs text-zinc-400 leading-snug">
                      Syntax humor, terminal art, and engineer merch.
                    </p>
                  </Link>

                  <Link
                    to="/products"
                    search={{ collection: "cyberpunk-anime-stickers" } as any}
                    className="group rounded-xl p-3 hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                  >
                    <div className="text-sm font-bold text-white group-hover:text-[#5ef046] transition-colors flex items-center justify-between">
                      <span>Cyberpunk & Anime Series</span>
                      <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#5ef046]" />
                    </div>
                    <p className="mt-1 text-xs text-zinc-400 leading-snug">
                      Futuristic neon synthwave & Japanese manga graphics.
                    </p>
                  </Link>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <Link
                  to="/products"
                  search={{ category: "t-shirts" } as any}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5ef046] hover:underline"
                >
                  Explore All T-Shirts <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  to="/products"
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Browse Full Store Catalog →
                </Link>
              </div>
            </div>

            {/* Interactive 3D Studio & Bulk Team Orders (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl border border-[#5ef046]/20 bg-gradient-to-b from-[#5ef046]/10 to-transparent p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5ef046] bg-[#5ef046]/10 border border-[#5ef046]/20 rounded px-2 py-0.5">
                    3D Customizer
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-white">Interactive Design Studio</h4>
                <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">
                  Upload your vector logo, preview on photorealistic 3D fabrics, and place custom orders in seconds.
                </p>
                <div className="mt-4 space-y-2">
                  <Link
                    to="/studio"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#5ef046] hover:bg-[#4de035] px-4 py-2.5 text-xs font-extrabold text-black transition-all hover:shadow-[0_0_15px_rgba(94,240,70,0.4)]"
                  >
                    <Sparkles className="size-3.5" />
                    <span>Launch 3D Studio</span>
                  </Link>
                  <Link
                    to="/bulk-orders"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/15 px-4 py-2 text-xs font-bold text-white transition-all border border-white/10"
                  >
                    <span>Bulk & Team Orders (20+ Pcs)</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Pan-India Delivery</span>
                <span className="text-emerald-400 font-semibold">Ready to Ship</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {open ? (
          <div className="glass-panel mt-2 max-h-[75vh] overflow-y-auto rounded-3xl p-4 pointer-events-auto lg:hidden bg-black/95 border border-white/10 backdrop-blur-2xl">
            <ul className="grid gap-1">
              {primaryLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}

              <li className="my-2 border-t border-white/10" />

              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      to={isAdmin ? "/admin" : "/account"}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/10"
                    >
                      <User className="size-4 text-zinc-400" />
                      <span>{isAdmin ? "Admin Portal" : "My Account"}</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => { setOpen(false); logout(); }}
                      className="flex w-full items-center gap-2 rounded-2xl px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 cursor-pointer"
                    >
                      <LogOut className="size-4" />
                      <span>Logout</span>
                    </button>
                  </li>
                  <li className="pt-2">
                    <Link
                      to="/custom-t-shirts"
                      onClick={() => setOpen(false)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5ef046] py-3 text-sm font-extrabold text-black"
                    >
                      <Sparkles className="size-4" />
                      Design Your T-Shirt
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => { setOpen(false); openAuthModal('login'); }}
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => { setOpen(false); openAuthModal('register'); }}
                      className="inline-flex w-full items-center justify-center rounded-full bg-[#5ef046] py-2.5 text-sm font-extrabold text-black hover:bg-[#4de035] cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        ) : null}
      </div>
    </header>
  );
}