import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { MapPin, Star, Quote } from "lucide-react";

const RealisationsPage = () => {
  const { type } = useParams();

  const { data: realisations, isLoading } = useQuery({
    queryKey: ["realisations"],
    queryFn: async () => { const { data, error } = await supabase.from("realisations").select("*").eq("is_active", true).order("sort_order"); if (error) throw error; return data || []; },
  });

  // Detail view
  if (type) {
    const detail = (realisations || []).find((r: any) => r.slug === type);

    if (!detail) {
      const filtered = (realisations || []).filter((r: any) => r.category === type);
      return (
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-[45px]">
            <div className="flex flex-col">
              {filtered.map((r: any, i: number) => (
                <div key={r.id}>
                  {i > 0 && <div className="h-[3px] bg-background" />}
                  <a href={`/realisations/${r.slug}`} className="group block">
                    <div className="hidden md:grid md:grid-cols-2" style={{ minHeight: "500px" }}>
                      <div className="relative overflow-hidden"><img src={r.image_url || "/placeholder.svg"} alt={r.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                      <div className="flex flex-col justify-center bg-[#1a1a1a] px-12 py-16 lg:px-20">
                        <h2 className="mb-5 font-display text-3xl font-bold leading-tight text-background lg:text-4xl xl:text-5xl">{r.title}</h2>
                        <p className="max-w-lg text-sm leading-relaxed text-background/70 lg:text-base">{r.description}</p>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    return <RealisationDetail detail={detail} />;
  }

  // List view
  const filtered = realisations || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-[45px]">
        {isLoading ? (
          <div className="container mx-auto px-6 py-24 text-muted-foreground">Chargement...</div>
        ) : (
          <div className="flex flex-col">
            {filtered.map((r: any, i: number) => {
              const imageFirst = i % 2 === 0;
              return (
                <div key={r.id}>
                  {i > 0 && <div className="h-[3px] bg-background" />}
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                    <a href={`/realisations/${r.slug}`} className="group block">
                      <div className="flex flex-col md:hidden">
                        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}><img src={r.image_url || "/placeholder.svg"} alt={r.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                        <div className="bg-[#1a1a1a] px-6 py-8">
                          <h2 className="mb-3 font-display text-xl font-bold leading-tight text-background">{r.title}</h2>
                          <p className="text-sm leading-relaxed text-background/70">{r.description}</p>
                        </div>
                      </div>
                      <div className="hidden md:grid md:grid-cols-2" style={{ minHeight: "500px" }}>
                        {imageFirst ? (
                          <>
                            <div className="relative overflow-hidden"><img src={r.image_url || "/placeholder.svg"} alt={r.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                            <div className="flex flex-col justify-center bg-[#1a1a1a] px-12 py-16 lg:px-20">
                              <h2 className="mb-5 font-display text-3xl font-bold leading-tight text-background lg:text-4xl xl:text-5xl">{r.title}</h2>
                              <p className="max-w-lg text-sm leading-relaxed text-background/70 lg:text-base">{r.description}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col justify-center bg-[#1a1a1a] px-12 py-16 lg:px-20">
                              <h2 className="mb-5 font-display text-3xl font-bold leading-tight text-background lg:text-4xl xl:text-5xl">{r.title}</h2>
                              <p className="max-w-lg text-sm leading-relaxed text-background/70 lg:text-base">{r.description}</p>
                            </div>
                            <div className="relative overflow-hidden"><img src={r.image_url || "/placeholder.svg"} alt={r.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                          </>
                        )}
                      </div>
                    </a>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="h-[3px] bg-background" />
      <Footer />
    </div>
  );
};

const RealisationDetail = ({ detail }: { detail: any }) => {
  const { data: testimonials } = useQuery({
    queryKey: ["realisation-testimonials", detail?.id],
    enabled: !!detail?.id,
    queryFn: async () => { const { data, error } = await supabase.from("testimonials").select("*").eq("realisation_id", detail!.id); if (error) throw error; return data || []; },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-[45px]">
        <div className="container mx-auto px-6 py-16 md:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Portfolio</p>
            <h1 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">{detail.title}</h1>
            {detail.image_url && <div className="mb-8 aspect-video overflow-hidden rounded-lg border border-border"><img src={detail.image_url} alt={detail.title} className="h-full w-full object-cover" /></div>}
            <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {detail.client_name && <span className="rounded-full bg-secondary px-3 py-1">{detail.client_name}</span>}
              {detail.location && <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1"><MapPin className="h-3 w-3" /> {detail.location}</span>}
            </div>
            <p className="mb-8 text-sm leading-relaxed text-foreground/80">{detail.description}</p>
            {testimonials && testimonials.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 font-display text-xl font-bold text-foreground">Témoignages</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {testimonials.map((t: any) => (
                    <div key={t.id} className="rounded-lg border border-border bg-card p-5">
                      <Quote className="mb-3 h-5 w-5 text-accent/40" />
                      <p className="mb-4 text-sm italic leading-relaxed text-foreground/80">"{t.content}"</p>
                      <div className="flex items-center justify-between">
                        <div><p className="text-sm font-semibold text-foreground">{t.author_name}</p>{t.author_role && <p className="text-xs text-muted-foreground">{t.author_role}</p>}</div>
                        <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} className={`h-3.5 w-3.5 ${s <= t.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <a href="/realisations" className="inline-flex items-center gap-2 text-sm text-accent hover:underline">← Voir toutes les réalisations</a>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RealisationsPage;
