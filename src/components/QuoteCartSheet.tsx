import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useQuoteCart } from "@/contexts/QuoteCartContext";
import { Minus, Plus, Trash2, FileText } from "lucide-react";

const QuoteCartSheet = () => {
  const { items, removeItem, updateQuantity, isOpen, setIsOpen, itemCount } = useQuoteCart();

  const handleValidate = () => {
    setIsOpen(false);
    window.location.href = "/devis";
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="top" className="flex w-full flex-col sm:absolute sm:right-0 sm:left-auto sm:w-[420px] sm:max-w-md sm:rounded-b-lg max-h-[80vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-display">
            <FileText className="h-5 w-5 text-accent" /> Mon Devis ({itemCount})
          </SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-muted-foreground">
            <FileText className="h-12 w-12 opacity-30" />
            <p className="text-sm">Votre devis est vide</p>
            <p className="text-xs">Ajoutez des équipements depuis le catalogue</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-sm border border-border bg-card p-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm bg-secondary">
                      {item.image_url && <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground leading-tight">{item.name}</p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="rounded-sm bg-secondary p-1 text-muted-foreground hover:text-foreground"><Minus className="h-3 w-3" /></button>
                          <span className="min-w-[24px] text-center text-xs font-medium text-foreground">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded-sm bg-secondary p-1 text-muted-foreground hover:text-foreground"><Plus className="h-3 w-3" /></button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-border pt-4">
          <Button onClick={handleValidate} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <FileText className="h-4 w-4 mr-2" /> Voir le devis
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default QuoteCartSheet;
