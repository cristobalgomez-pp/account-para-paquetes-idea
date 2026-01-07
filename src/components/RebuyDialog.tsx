import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Minus, Plus, ShoppingCart, CalendarClock, Info } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

interface RebuyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  items: OrderItem[];
  onSubscribe: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
};

export const RebuyDialog = ({
  open,
  onOpenChange,
  orderNumber,
  items,
  onSubscribe,
}: RebuyDialogProps) => {
  const [quantities, setQuantities] = useState<Record<number, number>>(
    items.reduce((acc, item, index) => ({ ...acc, [index]: item.quantity }), {})
  );

  const handleQuantityChange = (index: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [index]: Math.max(0, (prev[index] || 0) + delta),
    }));
  };

  const subtotal = items.reduce(
    (acc, item, index) => acc + item.unitPrice * (quantities[index] || 0),
    0
  );
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const activeItemsCount = Object.values(quantities).filter((q) => q > 0).length;

  const handleAddToCart = () => {
    const itemsToAdd = items
      .map((item, index) => ({
        ...item,
        quantity: quantities[index] || 0,
      }))
      .filter((item) => item.quantity > 0);

    if (itemsToAdd.length === 0) {
      toast.error("Selecciona al menos un artículo");
      return;
    }

    console.log("Agregando al carrito:", itemsToAdd);
    toast.success(`${itemsToAdd.length} artículo(s) agregados al carrito`);
    onOpenChange(false);
  };

  const handleSubscribeClick = () => {
    onOpenChange(false);
    onSubscribe();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Volver a comprar</DialogTitle>
          <DialogDescription>
            Ajusta las cantidades de los artículos de la orden {orderNumber}
          </DialogDescription>
        </DialogHeader>

        {/* Subscription suggestion */}
        <Alert className="bg-primary/10 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            <span className="font-medium">¿Compras frecuentemente estos productos?</span>{" "}
            Ahorra tiempo y nunca te quedes sin inventario.{" "}
            <button
              onClick={handleSubscribeClick}
              className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
            >
              <CalendarClock className="w-3.5 h-3.5" />
              Suscríbete a esta orden
            </button>{" "}
            y recíbela automáticamente cuando la necesites.
          </AlertDescription>
        </Alert>

        {/* Items list */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card
              key={index}
              className={quantities[index] === 0 ? "opacity-50" : ""}
            >
              <CardContent className="py-3">
                <div className="flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.unitPrice)} c/u
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(index, -1)}
                      disabled={quantities[index] === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {quantities[index]}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(index, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="w-24 text-right">
                    <p className="font-semibold">
                      {formatCurrency(item.unitPrice * (quantities[index] || 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Totals */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">IVA (16%)</span>
            <span>{formatCurrency(iva)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={activeItemsCount === 0}
            className="gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Agregar al carrito ({activeItemsCount})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
