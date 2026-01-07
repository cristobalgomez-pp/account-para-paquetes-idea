import { useState, useMemo } from "react";
import { CalendarClock, Plus, Minus, Info, Search, X, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useSubscriptions, Subscription, SubscriptionProduct } from "@/contexts/SubscriptionsContext";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  image: string;
  category: string;
}

// Demo products catalog
const PRODUCTS_CATALOG: Product[] = [
  { id: "cat-1", name: "Papel Bond Carta (500 hojas)", sku: "PAP-BOND-500", price: 149.00, image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop", category: "Oficina" },
  { id: "cat-2", name: "Bolígrafos Negros (12 piezas)", sku: "BOL-NEG-12", price: 89.00, image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=100&h=100&fit=crop", category: "Oficina" },
  { id: "cat-3", name: "Detergente Multiusos 5L", sku: "DET-MULTI-5L", price: 299.00, image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=100&h=100&fit=crop", category: "Limpieza" },
  { id: "cat-4", name: "Café Molido Premium 1kg", sku: "CAF-PREM-1KG", price: 399.00, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop", category: "Alimentos" },
  { id: "cat-5", name: "Azúcar Mascabado 500g", sku: "AZU-MASC-500", price: 59.00, image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=100&h=100&fit=crop", category: "Alimentos" },
  { id: "cat-6", name: "Tóner HP Negro", sku: "TON-HP-BLK", price: 850.00, image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=100&h=100&fit=crop", category: "Oficina" },
  { id: "cat-7", name: "Jabón Líquido para Manos 1L", sku: "JAB-LIQ-1L", price: 89.00, image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=100&h=100&fit=crop", category: "Limpieza" },
  { id: "cat-8", name: "Agua Embotellada (24 pack)", sku: "AGU-EMB-24", price: 159.00, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=100&h=100&fit=crop", category: "Alimentos" },
  { id: "cat-9", name: "Clips Metálicos (100 piezas)", sku: "CLI-MET-100", price: 35.00, image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=100&h=100&fit=crop", category: "Oficina" },
  { id: "cat-10", name: "Desinfectante en Aerosol", sku: "DES-AER-500", price: 129.00, image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=100&h=100&fit=crop", category: "Limpieza" },
];

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Cada día" },
  { value: "weekly", label: "Cada semana" },
  { value: "biweekly", label: "Cada 15 días" },
  { value: "monthly", label: "Cada mes" },
  { value: "bimonthly", label: "Cada 2 meses" },
  { value: "quarterly", label: "Cada 3 meses" },
  { value: "semiannual", label: "Cada 6 meses" },
];

interface SelectedProduct extends Product {
  quantity: number;
}

interface CreateSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
};

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

export function CreateSubscriptionDialog({
  open,
  onOpenChange,
}: CreateSubscriptionDialogProps) {
  const { addSubscription } = useSubscriptions();
  const [subscriptionName, setSubscriptionName] = useState("Mi nueva suscripción");
  const [frequency, setFrequency] = useState("monthly");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return PRODUCTS_CATALOG;
    const query = searchQuery.toLowerCase();
    return PRODUCTS_CATALOG.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const addProduct = (product: Product) => {
    const existing = selectedProducts.find((p) => p.id === product.id);
    if (existing) {
      setSelectedProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p))
      );
    } else {
      setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setSelectedProducts((prev) =>
      prev
        .map((p) => {
          if (p.id === productId) {
            const newQty = Math.max(0, p.quantity + delta);
            return { ...p, quantity: newQty };
          }
          return p;
        })
        .filter((p) => p.quantity > 0)
    );
  };

  const subtotal = selectedProducts.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const handleSubmit = () => {
    if (!subscriptionName.trim()) {
      toast.error("Ingresa un nombre para la suscripción");
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error("Agrega al menos un producto a la suscripción");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }

    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      name: subscriptionName.trim(),
      frequency,
      status: "active",
      nextDelivery: calculateNextDelivery(frequency),
      createdAt: new Date().toISOString().split("T")[0],
      products: selectedProducts.map((p): SubscriptionProduct => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: p.price,
        quantity: p.quantity,
        image: p.image,
      })),
    };

    addSubscription(newSubscription);

    const frequencyLabel = FREQUENCY_OPTIONS.find((f) => f.value === frequency)?.label;
    toast.success(
      `¡Suscripción "${subscriptionName}" creada! Recibirás ${selectedProducts.length} producto(s) ${frequencyLabel?.toLowerCase()}`
    );

    resetAndClose();
  };

  const resetAndClose = () => {
    setSubscriptionName("Mi nueva suscripción");
    setFrequency("monthly");
    setSearchQuery("");
    setSelectedProducts([]);
    setAcceptedTerms(false);
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetAndClose();
    } else {
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CalendarClock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Crear nueva suscripción</DialogTitle>
              <DialogDescription>
                Busca y agrega productos para recibir automáticamente
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Subscription Name */}
          <div className="space-y-2">
            <Label htmlFor="sub-name">Nombre de la suscripción</Label>
            <Input
              id="sub-name"
              value={subscriptionName}
              onChange={(e) => setSubscriptionName(e.target.value)}
              placeholder="Ej: Suministros de oficina"
            />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label htmlFor="sub-frequency">Frecuencia de entrega</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="sub-frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Product Search */}
          <div className="space-y-3">
            <Label>Buscar productos</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, SKU o categoría..."
                className="pl-9"
              />
            </div>

            {/* Product Catalog */}
            <ScrollArea className="h-[180px] border rounded-lg">
              <div className="p-2 space-y-2">
                {filteredProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No se encontraron productos
                  </p>
                ) : (
                  filteredProducts.map((product) => {
                    const isSelected = selectedProducts.some((p) => p.id === product.id);
                    return (
                      <div
                        key={product.id}
                        className={`flex items-center gap-3 p-2 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                          isSelected ? "border-primary/50 bg-primary/5" : "border-border"
                        }`}
                        onClick={() => addProduct(product)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.category} • {product.sku}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{formatCurrency(product.price)}</p>
                          {isSelected && (
                            <p className="text-xs text-primary">Agregado</p>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            addProduct(product);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* Selected Products */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Productos seleccionados</Label>
              {selectedProducts.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {selectedProducts.length} producto(s)
                </span>
              )}
            </div>

            {selectedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 border border-dashed rounded-lg">
                <ShoppingBag className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Busca y agrega productos arriba
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(product.price)} c/u
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(product.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">
                        {product.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(product.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => removeProduct(product.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals */}
          {selectedProducts.length > 0 && (
            <div className="space-y-2 bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal por entrega</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA (16%)</span>
                <span>{formatCurrency(iva)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total por entrega</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg border border-border">
            <Checkbox
              id="create-terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <Label
                htmlFor="create-terms"
                className="text-sm font-medium cursor-pointer leading-tight"
              >
                Acepto los términos y condiciones de la suscripción
              </Label>
              <p className="text-xs text-muted-foreground">
                Al suscribirte, aceptas que se realizarán cargos automáticos a tu método de
                pago según la frecuencia seleccionada. Puedes pausar o cancelar en cualquier momento.
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Beneficios de suscribirte</p>
              <ul className="text-muted-foreground text-xs mt-1 space-y-0.5">
                <li>• Entregas automáticas sin preocuparte por reordenar</li>
                <li>• Puedes modificar, pausar o cancelar en cualquier momento</li>
                <li>• Ajusta las cantidades según tus necesidades</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!acceptedTerms || selectedProducts.length === 0 || !subscriptionName.trim()}
          >
            <CalendarClock className="w-4 h-4 mr-2" />
            Crear suscripción
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
