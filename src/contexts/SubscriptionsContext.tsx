import { createContext, useContext, useState, ReactNode } from "react";

export interface SubscriptionProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Subscription {
  id: string;
  name: string;
  frequency: string;
  status: "active" | "paused";
  nextDelivery: string;
  createdAt: string;
  products: SubscriptionProduct[];
}

interface SubscriptionsContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  togglePauseSubscription: (id: string) => void;
  updateProductQuantity: (subscriptionId: string, productId: string, delta: number) => void;
  removeProduct: (subscriptionId: string, productId: string) => void;
}

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "1",
    name: "Suministros de Oficina",
    frequency: "monthly",
    status: "active",
    nextDelivery: "2026-02-07",
    createdAt: "2025-11-15",
    products: [
      {
        id: "p1",
        name: "Papel Bond Carta (500 hojas)",
        sku: "PAP-BOND-500",
        price: 149.00,
        quantity: 3,
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop",
      },
      {
        id: "p2",
        name: "Bolígrafos Negros (12 piezas)",
        sku: "BOL-NEG-12",
        price: 89.00,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    id: "2",
    name: "Limpieza Semanal",
    frequency: "weekly",
    status: "active",
    nextDelivery: "2026-01-14",
    createdAt: "2025-12-01",
    products: [
      {
        id: "p3",
        name: "Detergente Multiusos 5L",
        sku: "DET-MULTI-5L",
        price: 299.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    id: "3",
    name: "Café Premium",
    frequency: "biweekly",
    status: "paused",
    nextDelivery: "—",
    createdAt: "2025-10-20",
    products: [
      {
        id: "p4",
        name: "Café Molido Premium 1kg",
        sku: "CAF-PREM-1KG",
        price: 399.00,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop",
      },
      {
        id: "p5",
        name: "Azúcar Mascabado 500g",
        sku: "AZU-MASC-500",
        price: 59.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=100&h=100&fit=crop",
      },
    ],
  },
];

// Helper to calculate next delivery date based on frequency
const calculateNextDelivery = (frequency: string): string => {
  const now = new Date();
  const daysMap: Record<string, number> = {
    daily: 1,
    weekly: 7,
    biweekly: 15,
    monthly: 30,
    bimonthly: 60,
    quarterly: 90,
    semiannual: 180,
  };
  const days = daysMap[frequency] || 30;
  now.setDate(now.getDate() + days);
  return now.toISOString().split("T")[0];
};

export function SubscriptionsProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);

  const addSubscription = (subscription: Subscription) => {
    setSubscriptions((prev) => [...prev, subscription]);
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub))
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
  };

  const togglePauseSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          const newStatus = sub.status === "active" ? "paused" : "active";
          return {
            ...sub,
            status: newStatus,
            nextDelivery: newStatus === "paused" ? "—" : calculateNextDelivery(sub.frequency),
          };
        }
        return sub;
      })
    );
  };

  const updateProductQuantity = (subscriptionId: string, productId: string, delta: number) => {
    setSubscriptions((prev) =>
      prev
        .map((sub) => {
          if (sub.id === subscriptionId) {
            const updatedProducts = sub.products
              .map((product) => {
                if (product.id === productId) {
                  const newQuantity = Math.max(0, product.quantity + delta);
                  return { ...product, quantity: newQuantity };
                }
                return product;
              })
              .filter((product) => product.quantity > 0);

            if (updatedProducts.length === 0) {
              return null;
            }

            return { ...sub, products: updatedProducts };
          }
          return sub;
        })
        .filter(Boolean) as Subscription[]
    );
  };

  const removeProduct = (subscriptionId: string, productId: string) => {
    setSubscriptions((prev) =>
      prev
        .map((sub) => {
          if (sub.id === subscriptionId) {
            const updatedProducts = sub.products.filter((p) => p.id !== productId);
            if (updatedProducts.length === 0) {
              return null;
            }
            return { ...sub, products: updatedProducts };
          }
          return sub;
        })
        .filter(Boolean) as Subscription[]
    );
  };

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        togglePauseSubscription,
        updateProductQuantity,
        removeProduct,
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionsContext);
  if (context === undefined) {
    throw new Error("useSubscriptions must be used within a SubscriptionsProvider");
  }
  return context;
}
