import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const RealisationsPage = () => {
  const { data: realisations, isLoading } = useQuery({
    queryKey: ["realisations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("realisations").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data || [];
    },
  });

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
                    <div className="group">
                      <div className="flex flex-col md:hidden">
                        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
                          <img src={r.image_url || "/placeholder.svg"} alt={r.title} loading="lazy" className="h-full w-full object-cover" />
                        </div>
                        <div className="bg-[#1a1a1a] px-6 py-8">
                          <h2 className="mb-3 font-display text-xl font-bold leading-tight text-background">{r.title}</h2>
                          <p className="text-sm leading-relaxed text-background/70">{r.description}</p>
                        </div>
                      </div>
                      <div className="hidden md:grid md:grid-cols-2" style={{ minHeight: "500px" }}>
                        {imageFirst ? (
                          <>
                            <div className="relative overflow-hidden"><img src={r.image_url || "/placeholder.svg"} alt={r.title} loading="lazy" className="h-full w-full object-cover" /></div>
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
                            <div className="relative overflow-hidden"><img src={r.image_url || "/placeholder.svg"} alt={r.title} loading="lazy" className="h-full w-full object-cover" /></div>
                          </>
                        )}
                      </div>
                    </div>
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

export default RealisationsPage;
