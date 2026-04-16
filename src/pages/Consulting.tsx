import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const ConsultingPage = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["consulting-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consulting_services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return (data || []).map((s: any) => ({
        ...s,
        details: Array.isArray(s.details) ? s.details : [],
      }));
    },
  });

  const filtered = services || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO SECTION — Style identique au screenshot */}
      <section className="relative h-[520px] w-full overflow-hidden">
        <img
          src="/placeholder.svg"
          alt="Cardio Equipment"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/40" />

        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-2xl text-white">
              <h1 className="font-display text-4xl font-extrabold uppercase leading-tight tracking-wide md:text-5xl lg:text-6xl">
                LIFE FITNESS CARDIO
              </h1>

              <p className="mt-6 text-base leading-relaxed text-white/80 md:text-lg">
                Nous établissons la norme en matière de durabilité cardio depuis
                des décennies. Fournissez à vos utilisateurs les meilleurs
                appareils cardio qui fonctionnent jour après jour, utilisation
                après utilisation.
              </p>

              <a
                href="#"
                className="mt-8 inline-block bg-red-600 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
              >
                Télécharger le catalogue de produits
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-[45px]">
        {isLoading ? (
          <div className="container mx-auto px-6 py-24 text-muted-foreground">
            Chargement...
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map((s: any, i: number) => {
              const imageFirst = i % 2 === 0;
              return (
                <div key={s.id}>
                  {i > 0 && <div className="h-[3px] bg-background" />}

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    <div className="group">
                      {/* Mobile */}
                      <div className="flex flex-col md:hidden">
                        <div
                          className="relative w-full overflow-hidden"
                          style={{ aspectRatio: "16 / 10" }}
                        >
                          <img
                            src={s.image_url || "/placeholder.svg"}
                            alt={s.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="bg-[#1a1a1a] px-6 py-8">
                          <h2 className="mb-4 font-display text-2xl font-bold uppercase leading-tight text-white">
                            {s.title}
                          </h2>

                          <p className="text-sm leading-relaxed text-white/70">
                            {s.description}
                          </p>

                          <a
                            href="/contact"
                            className="mt-8 inline-block bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
                          >
                            Contactez-nous pour une consultation personnalisée
                          </a>
                        </div>
                      </div>

                      {/* Desktop */}
                      <div
                        className="hidden md:grid md:grid-cols-2"
                        style={{ minHeight: "520px" }}
                      >
                        {imageFirst ? (
                          <>
                            <div className="relative overflow-hidden">
                              <img
                                src={s.image_url || "/placeholder.svg"}
                                alt={s.title}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div className="flex flex-col justify-center bg-[#1a1a1a] px-12 py-16 lg:px-20">
                              <h2 className="mb-6 font-display text-3xl font-bold uppercase leading-tight text-white lg:text-4xl xl:text-5xl">
                                {s.title}
                              </h2>

                              <p className="max-w-lg text-base leading-relaxed text-white/70">
                                {s.description}
                              </p>

                              <a
                                href="/contact"
                                className="mt-8 inline-block self-start bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
                              >
                                Contactez-nous pour une consultation personnalisée
                              </a>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col justify-center bg-[#1a1a1a] px-12 py-16 lg:px-20">
                              <h2 className="mb-6 font-display text-3xl font-bold uppercase leading-tight text-white lg:text-4xl xl:text-5xl">
                                {s.title}
                              </h2>

                              <p className="max-w-lg text-base leading-relaxed text-white/70">
                                {s.description}
                              </p>

                              <a
                                href="/contact"
                                className="mt-8 inline-block self-start bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
                              >
                                Contactez-nous pour une consultation personnalisée
                              </a>
                            </div>

                            <div className="relative overflow-hidden">
                              <img
                                src={s.image_url || "/placeholder.svg"}
                                alt={s.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
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
