import { useState, useRef, useEffect } from "react";
import { Menu, X, FileText, ChevronDown, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQuoteCart } from "@/contexts/QuoteCartContext";
import logo from "@/assets/logo-new.png";

const cardioSubs = [
  { label: "Tapis de course", href: "/professionnel/cardio/tapis-de-course" },
  { label: "Elliptiques", href: "/professionnel/cardio/elliptiques" },
  { label: "Climbmills", href: "/professionnel/cardio/climbmills" },
  { label: "Steppers", href: "/professionnel/cardio/steppers" },
  { label: "Vélos", href: "/professionnel/cardio/velos" },
  { label: "Rameurs", href: "/professionnel/cardio/rameurs" },
];
const muscuSubs = [
  { label: "Multi-stations", href: "/professionnel/musculation/multi-stations" },
  { label: "Mono-stations", href: "/professionnel/musculation/mono-stations" },
  { label: "Charges Libres", href: "/professionnel/musculation/charges-libres" },
  { label: "Charges Guidées", href: "/professionnel/musculation/charges-guidees" },
];
const fonctionnelSubs = [
  { label: "HIIT Cardio", href: "/professionnel/fonctionnel/hiit-cardio" },
  { label: "Cages & Rigs", href: "/professionnel/fonctionnel/cages-rigs" },
];
const cardioSubsRes = [
  { label: "Tapis de course", href: "/residentiel/cardio/tapis-de-course" },
  { label: "Vélo elliptique", href: "/residentiel/cardio/elliptiques" },
  { label: "Climbmills", href: "/residentiel/cardio/climbmills" },
  { label: "Steppers", href: "/residentiel/cardio/steppers" },
  { label: "Vélos", href: "/residentiel/cardio/velos" },
  { label: "Rameurs", href: "/residentiel/cardio/rameurs" },
];
const muscuSubsRes = [
  { label: "Multi-stations", href: "/residentiel/musculation/multi-stations" },
  { label: "Mono-stations", href: "/residentiel/musculation/mono-stations" },
  { label: "Charges Libres", href: "/residentiel/musculation/charges-libres" },
  { label: "Charges Guidées", href: "/residentiel/musculation/charges-guidees" },
];
const fonctionnelSubsRes = [
  { label: "HIIT Cardio", href: "/residentiel/fonctionnel/hiit-cardio" },
  { label: "Cages & Rigs", href: "/residentiel/fonctionnel/cages-rigs" },
];

interface MegaMenuProps { label: string; children: React.ReactNode; }

const MegaMenu = ({ label, children }: MegaMenuProps) => {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const enter = () => { clearTimeout(timeout.current); setOpen(true); };
  const leave = () => { timeout.current = setTimeout(() => setOpen(false), 150); };
  return (
    <div onMouseEnter={enter} onMouseLeave={leave} className="relative">
      <button className="flex items-center gap-1 text-sm font-semibold text-background/70 transition-colors hover:text-background uppercase tracking-wide">
        {label} <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 pt-2">
          <div className="rounded-lg border border-background/10 bg-[#1a1a1a] p-6 shadow-xl min-w-max">{children}</div>
        </div>
      )}
    </div>
  );
};

const SubList = ({ title, items, allLink, allLabel }: { title: string; items: { label: string; href: string }[]; allLink: string; allLabel: string }) => (
  <div>
    <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">{title}</h4>
    <ul className="space-y-1.5">
      {items.map((s) => <li key={s.href}><a href={s.href} className="text-sm text-background/60 transition-colors hover:text-background">{s.label}</a></li>)}
      <li className="pt-1"><a href={allLink} className="text-xs font-semibold text-accent hover:text-accent/80">{allLabel} →</a></li>
    </ul>
  </div>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount, setIsOpen } = useQuoteCart();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const toggleMobile = (key: string) => setMobileExpanded(mobileExpanded === key ? null : key);

  const { data: suggestions } = useQuery({
    queryKey: ["search-suggestions", searchQuery],
    queryFn: async () => {
      const q = searchQuery.trim();
      const { data, error } = await supabase.from("products").select("id, name, image_url, category").eq("is_published", true).or(`name.ilike.%${q}%,category.ilike.%${q}%,subcategory.ilike.%${q}%`).order("sort_order").limit(6);
      if (error) throw error;
      return data;
    },
    enabled: searchQuery.trim().length >= 2,
  });

  const showSuggestions = searchOpen && searchQuery.trim().length >= 2 && suggestions && suggestions.length > 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) setSearchOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/recherche?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false); setSearchQuery(""); setOpen(false);
    }
  };

  const handleSelectSuggestion = (id: string) => {
    window.location.href = `/produit/${id}`;
    setSearchOpen(false); setSearchQuery(""); setOpen(false);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-foreground border-b-[3px] border-background">
      <div className="w-full grid grid-cols-[auto_1fr_auto] items-center px-4 py-2 md:px-8 lg:px-16 lg:grid-cols-[auto_1fr_auto]">
        <Link to="/" className="flex-shrink-0 justify-self-start">
          <img src={logo} alt="IMPULSE FITNESS" className="h-7 w-auto md:h-8" />
        </Link>

        <div className="hidden items-center justify-center gap-8 lg:flex">
          <MegaMenu label="Professionnel">
            <div className="flex gap-10">
              <SubList title="Cardio" items={cardioSubs} allLink="/professionnel/cardio" allLabel="Parcourir tous les produits Cardio" />
              <SubList title="Musculation" items={muscuSubs} allLink="/professionnel/musculation" allLabel="Parcourir tous les produits Musculation" />
              <SubList title="Fonctionnel" items={fonctionnelSubs} allLink="/professionnel/fonctionnel" allLabel="Parcourir tous les produits Fonctionnel" />
            </div>
          </MegaMenu>
          <MegaMenu label="Résidentiel">
            <div className="flex gap-10">
              <SubList title="Cardio" items={cardioSubsRes} allLink="/residentiel/cardio" allLabel="Parcourir tous les produits Cardio" />
              <SubList title="Musculation" items={muscuSubsRes} allLink="/residentiel/musculation" allLabel="Parcourir tous les produits Musculation" />
              <SubList title="Fonctionnel" items={fonctionnelSubsRes} allLink="/residentiel/fonctionnel" allLabel="Parcourir tous les produits Fonctionnel" />
            </div>
          </MegaMenu>
          <a href="/consulting" className="text-sm font-semibold text-background/70 uppercase tracking-wide transition-colors hover:text-background">Consulting</a>
          <a href="/realisations" className="text-sm font-semibold text-background/70 uppercase tracking-wide transition-colors hover:text-background">Réalisations</a>
          <a href="/contact" className="text-sm font-semibold text-background/70 uppercase tracking-wide transition-colors hover:text-background">Contactez-nous</a>
        </div>

        <div className="hidden items-center gap-3 justify-self-end lg:flex">
          <div ref={searchContainerRef} className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher..." autoFocus className="w-56 rounded-sm border border-background/20 bg-background/10 px-3 py-1.5 text-sm text-background placeholder:text-background/50 focus:outline-none focus:ring-1 focus:ring-accent" />
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2 text-background/70 transition-colors hover:text-background"><Search className="h-4 w-4" /></button>
            )}
            {showSuggestions && (
              <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-md border border-background/10 bg-[#1a1a1a] shadow-xl overflow-hidden">
                {suggestions.map((p) => (
                  <button key={p.id} onMouseDown={() => handleSelectSuggestion(p.id)} className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-background/10">
                    {p.image_url && <img src={p.image_url} alt={p.name} className="h-10 w-10 rounded object-cover flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm text-background truncate">{p.name}</p>
                      <p className="text-[10px] text-background/50 uppercase">{p.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setIsOpen(true)} className="relative flex items-center gap-2 rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
            <FileText className="h-4 w-4" /> Voir le devis
            {itemCount > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">{itemCount}</span>}
          </button>
        </div>

        <div className="flex items-center gap-2 justify-self-end lg:hidden">
          <button onClick={() => setIsOpen(true)} className="relative flex items-center gap-2 rounded-sm bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Devis</span>
            {itemCount > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">{itemCount}</span>}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 text-background">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-background/10 bg-foreground px-4 py-4 lg:hidden">
          <div className="space-y-1">
            <button onClick={() => toggleMobile("prof")} className="flex w-full items-center justify-between py-2 text-sm font-semibold text-background/80 uppercase">Professionnel <ChevronDown className={`h-3 w-3 transition-transform ${mobileExpanded === "prof" ? "rotate-180" : ""}`} /></button>
            {mobileExpanded === "prof" && (
              <div className="space-y-1 pl-4 pb-2">
                <p className="text-xs font-bold text-accent uppercase pt-1">Cardio</p>
                {cardioSubs.map(s => <a key={s.href} href={s.href} onClick={() => setOpen(false)} className="block py-1 text-sm text-background/60">{s.label}</a>)}
                <p className="text-xs font-bold text-accent uppercase pt-2">Musculation</p>
                {muscuSubs.map(s => <a key={s.href} href={s.href} onClick={() => setOpen(false)} className="block py-1 text-sm text-background/60">{s.label}</a>)}
                <p className="text-xs font-bold text-accent uppercase pt-2">Fonctionnel</p>
                {fonctionnelSubs.map(s => <a key={s.href} href={s.href} onClick={() => setOpen(false)} className="block py-1 text-sm text-background/60">{s.label}</a>)}
              </div>
            )}
            <button onClick={() => toggleMobile("res")} className="flex w-full items-center justify-between py-2 text-sm font-semibold text-background/80 uppercase">Résidentiel <ChevronDown className={`h-3 w-3 transition-transform ${mobileExpanded === "res" ? "rotate-180" : ""}`} /></button>
            {mobileExpanded === "res" && (
              <div className="space-y-1 pl-4 pb-2">
                <p className="text-xs font-bold text-accent uppercase pt-1">Cardio</p>
                {cardioSubsRes.map(s => <a key={s.href} href={s.href} onClick={() => setOpen(false)} className="block py-1 text-sm text-background/60">{s.label}</a>)}
                <p className="text-xs font-bold text-accent uppercase pt-2">Musculation</p>
                {muscuSubsRes.map(s => <a key={s.href} href={s.href} onClick={() => setOpen(false)} className="block py-1 text-sm text-background/60">{s.label}</a>)}
                <p className="text-xs font-bold text-accent uppercase pt-2">Fonctionnel</p>
                {fonctionnelSubsRes.map(s => <a key={s.href} href={s.href} onClick={() => setOpen(false)} className="block py-1 text-sm text-background/60">{s.label}</a>)}
              </div>
            )}
            <a href="/consulting" onClick={() => setOpen(false)} className="block py-2 text-sm font-semibold text-background/80 uppercase">Consulting</a>
            <a href="/realisations" onClick={() => setOpen(false)} className="block py-2 text-sm font-semibold text-background/80 uppercase">Réalisations</a>
            <a href="/contact" onClick={() => setOpen(false)} className="block py-2 text-sm font-semibold text-background/80 uppercase">Contact</a>
          </div>
          <div className="mt-4">
            <form onSubmit={handleSearch} className="flex-1">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher..." className="w-full rounded-sm border border-background/20 bg-background/10 px-3 py-2 text-sm text-background placeholder:text-background/50 focus:outline-none" />
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
