import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface QuoteItem {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  quantity: number;
}

interface QuoteCartContextType {
  items: QuoteItem[];
  addItem: (product: Omit<QuoteItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const QuoteCartContext = createContext<QuoteCartContextType | null>(null);

export const useQuoteCart = () => {
  const ctx = useContext(QuoteCartContext);
  if (!ctx) throw new Error("useQuoteCart must be used within QuoteCartProvider");
  return ctx;
};

export const QuoteCartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Omit<QuoteItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <QuoteCartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, isOpen, setIsOpen }}>
      {children}
    </QuoteCartContext.Provider>
  );
};
