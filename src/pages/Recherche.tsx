import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

const RecherchePage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data: products, isLoading } = useQuery({
    queryKey: ["search-products", query],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("is_published", true).or(`name.ilike.%${query}%,category.ilike.%${query}%,subcategory.ilike.%${query}%,short_description.ilike.%${query}%`).order("sort_order").limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!query,
  });

  return (
    <div className="min-h-screen bg-background"><Navbar /><div className="pt-16 md:pt-20"><div className="container mx-auto px-4 py-8 md:px-16">
    <div className="mb-8"><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">Résultats</p><h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Recherche : "{query}"</h1>{products && <p className="mt-2 text-sm text-muted-foreground">{products.length} produit{products.length !== 1 ? "s" : ""} trouvé{products.length !== 1 ? "s" : ""}</p>}</div>
    {isLoading ? (<div className="flex h-40 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>) : products && products.length > 0 ? (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 md:gap-3">{products.map((p) => (<a key={p.id} href={`/produit/${p.id}`} className="group overflow-hidden rounded-sm border border-border bg-card transition-shadow hover:shadow-md"><div className="aspect-square overflow-hidden"><img src={p.image_url || ""} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div><div className="p-2 md:p-3"><p className="text-[9px] font-semibold uppercase text-accent md:text-[10px]">{p.category}</p><h3 className="mt-0.5 text-xs font-semibold text-foreground line-clamp-2 md:mt-1 md:text-sm">{p.name}</h3></div></a>))}</div>
    ) : (<div className="flex flex-col items-center justify-center gap-4 py-20 text-center"><Search className="h-12 w-12 text-muted-foreground/30" /><p className="text-muted-foreground">Aucun produit trouvé pour "{query}"</p><a href="/" className="text-sm text-accent hover:text-accent/80">← Retour à l'accueil</a></div>)}
    </div></div><Footer /></div>
  );
};

export default RecherchePage;
