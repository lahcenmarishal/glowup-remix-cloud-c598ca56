import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Save, GripVertical, ImageIcon, Eye, EyeOff, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  author_name: string;
  author_role: string;
  content: string;
  rating: number;
}

interface Realisation {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image_url: string | null;
  location: string;
  client_name: string;
  is_active: boolean;
  sort_order: number;
  testimonials?: Testimonial[];
}

const categories = [
  { value: "salle-de-sport", label: "Salle de sport" },
  { value: "domicile", label: "Domicile" },
  { value: "hotel", label: "Hôtel" },
  { value: "centre-de-loisirs", label: "Centre de loisirs" },
];

const AdminRealisations = () => {
  const qc = useQueryClient();
  const [editItems, setEditItems] = useState<Realisation[] | null>(null);
  const [testimonials, setTestimonials] = useState<Record<string, Testimonial[]>>({});

  const { data: realisations, isLoading } = useQuery({
    queryKey: ["admin-realisations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("realisations")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      
      // Fetch testimonials for each
      const { data: allTestimonials } = await supabase
        .from("testimonials")
        .select("*");
      
      const testMap: Record<string, Testimonial[]> = {};
      (allTestimonials || []).forEach((t: any) => {
        if (!testMap[t.realisation_id]) testMap[t.realisation_id] = [];
        testMap[t.realisation_id].push(t);
      });
      setTestimonials(testMap);

      return (data || []) as Realisation[];
    },
  });

  const current = editItems || realisations || [];

  const updateField = (index: number, field: keyof Realisation, value: any) => {
    const updated = [...current];
    updated[index] = { ...updated[index], [field]: value };
    setEditItems(updated);
  };

  const handleImageUpload = async (index: number, file: File) => {
    const ext = file.name.split(".").pop();
    const path = `realisations/${Date.now()}-${index}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) { toast.error("Erreur upload image"); return; }
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
    updateField(index, "image_url", urlData.publicUrl);
    toast.success("Image uploadée !");
  };

  const addItem = () => {
    const newId = crypto.randomUUID();
    const newItem: Realisation = {
      id: newId,
      title: "Nouvelle réalisation",
      slug: `realisation-${Date.now()}`,
      category: "salle-de-sport",
      description: "",
      image_url: null,
      location: "",
      client_name: "",
      is_active: true,
      sort_order: current.length,
    };
    setEditItems([...current, newItem]);
  };

  const removeItem = async (index: number) => {
    const item = current[index];
    await supabase.from("realisations").delete().eq("id", item.id);
    setEditItems(current.filter((_, i) => i !== index));
    const newTest = { ...testimonials };
    delete newTest[item.id];
    setTestimonials(newTest);
    toast.success("Réalisation supprimée");
    qc.invalidateQueries({ queryKey: ["admin-realisations"] });
  };

  // Testimonial management
  const addTestimonial = (realisationId: string) => {
    const newTest: Testimonial = {
      id: crypto.randomUUID(),
      author_name: "",
      author_role: "",
      content: "",
      rating: 5,
    };
    setTestimonials({
      ...testimonials,
      [realisationId]: [...(testimonials[realisationId] || []), newTest],
    });
  };

  const updateTestimonial = (realisationId: string, testIndex: number, field: keyof Testimonial, value: any) => {
    const tests = [...(testimonials[realisationId] || [])];
    tests[testIndex] = { ...tests[testIndex], [field]: value };
    setTestimonials({ ...testimonials, [realisationId]: tests });
  };

  const removeTestimonial = async (realisationId: string, testIndex: number) => {
    const tests = [...(testimonials[realisationId] || [])];
    const removed = tests[testIndex];
    await supabase.from("testimonials").delete().eq("id", removed.id);
    setTestimonials({
      ...testimonials,
      [realisationId]: tests.filter((_, i) => i !== testIndex),
    });
    toast.success("Témoignage supprimé");
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      for (const [i, item] of current.entries()) {
        const payload = {
          title: item.title,
          slug: item.slug,
          category: item.category,
          description: item.description,
          image_url: item.image_url,
          location: item.location || "",
          client_name: item.client_name || "",
          sort_order: i,
          is_active: item.is_active,
        };
        const { data: existing } = await supabase
          .from("realisations")
          .select("id")
          .eq("id", item.id)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase.from("realisations").update(payload).eq("id", item.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("realisations").insert({ ...payload, id: item.id });
          if (error) throw error;
        }

        // Save testimonials
        const tests = testimonials[item.id] || [];
        // Delete existing and re-insert
        await supabase.from("testimonials").delete().eq("realisation_id", item.id);
        if (tests.length > 0) {
          const toInsert = tests.map(t => ({
            realisation_id: item.id,
            author_name: t.author_name,
            author_role: t.author_role || "",
            content: t.content,
            rating: t.rating,
          }));
          const { error } = await supabase.from("testimonials").insert(toInsert);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-realisations"] });
      setEditItems(null);
      toast.success("Réalisations sauvegardées !");
    },
    onError: (e) => { console.error(e); toast.error("Erreur lors de la sauvegarde."); },
  });

  if (isLoading) return <div className="text-muted-foreground">Chargement...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Réalisations</h1>
          <p className="text-sm text-muted-foreground">Gérez votre portfolio de réalisations et témoignages.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={addItem} className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
          <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="inline-flex items-center gap-2 rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50">
            <Save className="h-4 w-4" /> {saveMutation.isPending ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {current.map((item, index) => (
          <div key={item.id} className="rounded-sm border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground">RÉALISATION {index + 1}</span>
                <button onClick={() => updateField(index, "is_active", !item.is_active)} className={`ml-2 rounded-sm px-2 py-0.5 text-xs ${item.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                  {item.is_active ? <><Eye className="mr-1 inline h-3 w-3" />Actif</> : <><EyeOff className="mr-1 inline h-3 w-3" />Inactif</>}
                </button>
              </div>
              <button onClick={() => removeItem(index)} className="text-destructive hover:text-destructive/80">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Image</label>
                {item.image_url ? (
                  <div className="relative aspect-video overflow-hidden rounded-sm border border-border">
                    <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-foreground/0 opacity-0 transition-opacity hover:bg-foreground/30 hover:opacity-100">
                      <span className="rounded-sm bg-background/80 px-3 py-1.5 text-xs font-medium">Changer</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(index, e.target.files[0])} />
                    </label>
                  </div>
                ) : (
                  <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-border bg-secondary/50 transition-colors hover:border-accent/50">
                    <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Cliquez pour uploader</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(index, e.target.files[0])} />
                  </label>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">Titre</label>
                  <input value={item.title} onChange={(e) => updateField(index, "title", e.target.value)} className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">Slug</label>
                  <input value={item.slug} onChange={(e) => updateField(index, "slug", e.target.value)} className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">Catégorie</label>
                  <select value={item.category} onChange={(e) => updateField(index, "category", e.target.value)} className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent">
                    {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-foreground">Client</label>
                    <input value={item.client_name || ""} onChange={(e) => updateField(index, "client_name", e.target.value)} className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-foreground">Localisation</label>
                    <input value={item.location || ""} onChange={(e) => updateField(index, "location", e.target.value)} className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">Description</label>
                  <textarea value={item.description} onChange={(e) => updateField(index, "description", e.target.value)} rows={3} className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mt-5 border-t border-border pt-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MessageSquare className="h-4 w-4 text-accent" /> Témoignages
                </h3>
                <button onClick={() => addTestimonial(item.id)} className="text-xs text-accent hover:underline">+ Ajouter un témoignage</button>
              </div>
              <div className="space-y-3">
                {(testimonials[item.id] || []).map((test, ti) => (
                  <div key={test.id} className="rounded-sm border border-border bg-secondary/30 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} onClick={() => updateTestimonial(item.id, ti, "rating", s)}>
                            <Star className={`h-3.5 w-3.5 ${s <= test.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                          </button>
                        ))}
                      </div>
                      <button onClick={() => removeTestimonial(item.id, ti)} className="text-destructive hover:text-destructive/80"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input value={test.author_name} onChange={(e) => updateTestimonial(item.id, ti, "author_name", e.target.value)} placeholder="Nom de l'auteur" className="rounded-sm border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
                      <input value={test.author_role || ""} onChange={(e) => updateTestimonial(item.id, ti, "author_role", e.target.value)} placeholder="Rôle / Titre" className="rounded-sm border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
                    </div>
                    <textarea value={test.content} onChange={(e) => updateTestimonial(item.id, ti, "content", e.target.value)} rows={2} placeholder="Contenu du témoignage..." className="w-full rounded-sm border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRealisations;
