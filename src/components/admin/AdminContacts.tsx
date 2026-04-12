import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminContacts = () => {
  const qc = useQueryClient();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase.from("contact_requests").update({ is_read }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-contacts"] });
      toast.success("Statut mis à jour");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-contacts"] });
      toast.success("Demande supprimée");
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const statusColors = {
    unread: "bg-accent/20 text-accent",
    read: "bg-muted text-muted-foreground",
  };

  if (isLoading) return <div className="text-muted-foreground">Chargement...</div>;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Demandes de contact</h1>

      {!contacts?.length ? (
        <p className="text-sm text-muted-foreground">Aucune demande pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div key={c.id} className="rounded-sm border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-foreground">{c.full_name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${c.is_read ? statusColors.read : statusColors.unread}`}>
                       {c.is_read ? "lu" : "nouveau"}
                     </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.email} {c.phone && `· ${c.phone}`}</p>
                  {c.company && <p className="text-xs text-muted-foreground">Entreprise : {c.company}</p>}
                  {c.message && <p className="mt-2 whitespace-pre-line text-sm text-foreground/80">{c.message}</p>}
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!c.is_read && (
                     <button onClick={() => updateStatus.mutate({ id: c.id, is_read: true })} className="rounded-sm p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Marquer comme lu">
                       <Check className="h-4 w-4" />
                     </button>
                   )}
                  <button
                    onClick={() => { if (confirm("Supprimer cette demande ?")) deleteMutation.mutate(c.id); }}
                    className="rounded-sm p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
