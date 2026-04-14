import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const ConsultingPage = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["consulting-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("consulting_services").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return (data || []).map((s: any) => ({ ...s, details: Array.isArray(s.details) ? s.details : [] }));
    },
  });

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
              const imageFirst = i % 2 === 0;
              return (
                <div key={s.id}>
                  {i > 0 && <div className="h-[3px] bg-background" />}
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                    <div className="group">
                      <div className="flex flex-col md:hidden">
                        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
                          <img src={s.image_url || "/placeholder.svg"} alt={s.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="bg-[#1a1a1a] px-6 py-8">
                          <h2 className="mb-3 font-display text-xl font-bold leading-tight text-background">{s.title}</h2>
                          <p className="text-sm leading-relaxed text-background/70">{s.description}</p>
                        </div>
                      </div>
                      <div className="hidden md:grid md:grid-cols-2" style={{ minHeight: "500px" }}>
                        {imageFirst ? (
                          <>
                            <div className="relative overflow-hidden"><img src={s.image_url || "/placeholder.svg"} alt={s.title} className="h-full w-full object-cover" /></div>
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
                            <div className="relative overflow-hidden"><img src={s.image_url || "/placeholder.svg"} alt={s.title} className="h-full w-full object-cover" /></div>
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

export default ConsultingPage;
