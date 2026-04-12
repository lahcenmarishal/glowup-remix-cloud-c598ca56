import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Lightbulb, PenTool, Rocket } from "lucide-react";

const iconMap: Record<string, any> = { Lightbulb, PenTool, Rocket };

const ConsultingPage = () => {
  const { service } = useParams();

  const { data: services, isLoading } = useQuery({
    queryKey: ["consulting-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("consulting_services").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return (data || []).map((s: any) => ({ ...s, details: Array.isArray(s.details) ? s.details : [] }));
    },
  });

  // If a specific service slug is provided, show detail
  if (service) {
    const filtered = (services || []).filter((s: any) => s.slug === service);
    if (isLoading) return <div className="min-h-screen bg-background"><Navbar /><div className="container mx-auto px-6 py-24 text-muted-foreground">Chargement...</div></div>;
    if (filtered.length === 0) return <div className="min-h-screen bg-background"><Navbar /><div className="container mx-auto px-6 py-24 text-muted-foreground">Service non trouvé</div></div>;
    const s = filtered[0];
    const Icon = iconMap[s.icon] || Lightbulb;
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-[45px]">
          <div className="container mx-auto px-6 py-16 md:px-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Consulting</p>
              <h1 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">{s.title}</h1>
              <div className="grid gap-8 md:grid-cols-2">
                {s.image_url && <div className="overflow-hidden rounded-lg border border-border"><img src={s.image_url} alt={s.title} className="w-full h-auto object-contain" /></div>}
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10"><Icon className="h-6 w-6 text-accent" /></div>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                  <ul className="space-y-2">
                    {s.details.map((d: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-foreground/80"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <a href="/consulting" className="mt-8 inline-flex items-center gap-2 text-sm text-accent hover:underline">← Voir tous les services</a>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // List view
  const filtered = services || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-[45px]">
        {isLoading ? (
          <div className="container mx-auto px-6 py-24 text-muted-foreground">Chargement...</div>
        ) : (
          <div className="flex flex-col">
            {filtered.map((s: any, i: number) => {
              const showSeparator = i > 0;
              const imageFirst = i % 2 === 0;
              return (
                <div key={s.id}>
                  {showSeparator && <div className="h-[3px] bg-background" />}
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                    <a href={`/consulting/${s.slug}`} className="group block">
                      <div className="flex flex-col md:hidden">
                        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
                          <img src={s.image_url || "/placeholder.svg"} alt={s.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="bg-[#1a1a1a] px-6 py-8">
                          <h2 className="mb-3 font-display text-xl font-bold leading-tight text-background">{s.title}</h2>
                          <p className="text-sm leading-relaxed text-background/70">{s.description}</p>
                        </div>
                      </div>
                      <div className={`hidden md:grid md:grid-cols-2`} style={{ minHeight: "500px" }}>
                        {imageFirst ? (
                          <>
                            <div className="relative overflow-hidden"><img src={s.image_url || "/placeholder.svg"} alt={s.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                            <div className="flex flex-col justify-center bg-[#1a1a1a] px-12 py-16 lg:px-20">
                              <h2 className="mb-5 font-display text-3xl font-bold leading-tight text-background lg:text-4xl xl:text-5xl">{s.title}</h2>
                              <p className="max-w-lg text-sm leading-relaxed text-background/70 lg:text-base">{s.description}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col justify-center bg-[#1a1a1a] px-12 py-16 lg:px-20">
                              <h2 className="mb-5 font-display text-3xl font-bold leading-tight text-background lg:text-4xl xl:text-5xl">{s.title}</h2>
                              <p className="max-w-lg text-sm leading-relaxed text-background/70 lg:text-base">{s.description}</p>
                            </div>
                            <div className="relative overflow-hidden"><img src={s.image_url || "/placeholder.svg"} alt={s.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
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

export default ConsultingPage;
