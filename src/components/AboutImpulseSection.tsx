import { motion } from "framer-motion";
import { Shield, Lightbulb, Palette, Package, Wrench, HeartPulse, Star, Users } from "lucide-react";

const pillars = [
  { icon: Wrench, title: "Expertise industrielle", desc: "Impulse a longtemps opéré en tant que fabricant OEM pour les plus grandes marques mondiales avant de s'imposer sous son propre nom." },
  { icon: Shield, title: "Qualité certifiée", desc: "Leurs processus de fabrication respectent les normes internationales les plus strictes comme ISO9001, ISO14001 et OHSAS 18001." },
  { icon: HeartPulse, title: "Design Ergonomique", desc: "Le matériel Impulse est conçu pour être intuitif. Des consoles intelligentes aux réglages simplifiés, chaque détail est pensé pour améliorer l'expérience de l'utilisateur." },
  { icon: Package, title: "Polyvalence des Gammes", desc: "Impulse propose un écosystème complet : Cardio-training professionnel, Musculation sectorisée, Charges libres premium, Entraînement fonctionnel et Cross-training." },
];

const whyChoose = [
  { icon: Shield, title: "Robustesse à toute Épreuve", desc: "Conçus pour un usage intensif, les appareils Impulse sont réputés pour leur durabilité exceptionnelle. Chaque structure est soumise à des tests de résistance rigoureux." },
  { icon: Lightbulb, title: "Innovation & Bio-mécanique", desc: "Chaque machine est étudiée pour respecter le mouvement naturel du corps humain, offrant une efficacité d'entraînement optimale tout en minimisant les risques de blessures." },
  { icon: Palette, title: "Design Élégant et Moderne", desc: "Avec des lignes fluides et des finitions premium, nos équipements transforment votre espace de sport en un lieu moderne et attractif." },
];

const whyMaroc = [
  { icon: Users, title: "Conseil personnalisé", desc: "Accompagnement adapté à votre besoin avec un showroom dédié à Bouskoura." },
  { icon: Package, title: "Large choix", desc: "Équipements professionnels et semi-professionnels disponibles." },
  { icon: Star, title: "Installation et SAV", desc: "Équipe technique qualifiée pour la livraison, l'installation et le service après-vente avec stock de pièces d'origine permanent." },
];

const AboutImpulseSection = () => (
  <section className="border-t border-border bg-card py-20">
    <div className="container mx-auto px-6 md:px-16">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">À propos de la marque</p>
        <h2 className="mb-6 font-display text-3xl font-bold text-foreground md:text-4xl">Impulse Fitness : L'Excellence Technologique au Service de la Performance</h2>
        <p className="mb-4 max-w-4xl text-base leading-relaxed text-muted-foreground">Fondée en 1975, Impulse Health Tech Co., Ltd. est devenue une référence incontournable de l'industrie du fitness. Cotée en bourse et forte de plus de 40 ans d'expérience, la marque s'est imposée comme le premier fabricant d'équipements de sport en Chine, avec une présence stratégique dans plus de 200 pays.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-12 mt-8">
        <h3 className="mb-3 font-display text-2xl font-bold text-foreground">Une Marque de Confiance Internationale</h3>
        <p className="max-w-4xl text-base leading-relaxed text-muted-foreground">Impulse Fitness ne se contente pas de fabriquer des machines ; elle conçoit des solutions de santé globales. Fournisseur officiel de nombreuses armées, centres de haute performance sportive et chaînes d'hôtels de luxe à travers le monde, la marque est synonyme de fiabilité industrielle.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-16">
        <h3 className="mb-8 font-display text-2xl font-bold text-foreground">Les 4 Piliers de l'Excellence Impulse</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="rounded-sm border border-border bg-background p-6">
              <p.icon className="mb-4 h-8 w-8 text-accent" />
              <h4 className="mb-2 font-display text-lg font-semibold text-foreground">{p.title}</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
        <h3 className="mb-8 font-display text-2xl font-bold text-foreground">Pourquoi choisir Impulse Fitness pour votre établissement ?</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {whyChoose.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="rounded-sm border border-border bg-background p-6">
              <item.icon className="mb-4 h-8 w-8 text-accent" />
              <h4 className="mb-2 font-display text-lg font-semibold text-foreground">{item.title}</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
        <h3 className="mb-8 font-display text-2xl font-bold text-foreground">Pourquoi choisir Impulse Maroc ?</h3>
        <p className="mb-6 max-w-4xl text-base leading-relaxed text-muted-foreground">En choisissant Impulse Fitness via son distributeur exclusif au Maroc, vous optez pour un partenaire de solutions complètes, avec un accompagnement personnalisé et un showroom dédié à Bouskoura.</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {whyMaroc.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="rounded-sm border border-border bg-background p-6">
              <item.icon className="mb-4 h-8 w-8 text-accent" />
              <h4 className="mb-2 font-display text-lg font-semibold text-foreground">{item.title}</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <h3 className="mb-6 font-display text-2xl font-bold text-foreground">Regardez la vidéo pour en savoir plus</h3>
        <div className="relative w-full overflow-hidden rounded-sm border border-border" style={{ paddingBottom: "56.25%" }}>
          <iframe className="absolute inset-0 h-full w-full" src="https://www.youtube.com/embed/PQwjW5hPKk4" title="Impulse Fitness - Vidéo de présentation" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      </motion.div>
    </div>
  </section>
);

export default AboutImpulseSection;
