import { useState } from "react";
import { CalendarClock, Plus, Minus, Info } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

interface SubscriptionItem extends OrderItem {
  subscriptionQuantity: number;
}

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  items: OrderItem[];
}

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Cada día" },
  { value: "weekly", label: "Cada semana" },
  { value: "biweekly", label: "Cada 15 días" },
  { value: "monthly", label: "Cada mes" },
  { value: "bimonthly", label: "Cada 2 meses" },
  { value: "quarterly", label: "Cada 3 meses" },
  { value: "semiannual", label: "Cada 6 meses" },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
};

export function SubscriptionDialog({
  open,
  onOpenChange,
  orderNumber,
  items,
}: SubscriptionDialogProps) {
  const [subscriptionItems, setSubscriptionItems] = useState<SubscriptionItem[]>(
    items.map((item) => ({ ...item, subscriptionQuantity: item.quantity }))
  );
  const [frequency, setFrequency] = useState("monthly");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const updateQuantity = (index: number, delta: number) => {
    setSubscriptionItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const newQty = Math.max(0, item.subscriptionQuantity + delta);
          return { ...item, subscriptionQuantity: newQty };
        }
        return item;
      })
    );
  };

  const activeItems = subscriptionItems.filter((item) => item.subscriptionQuantity > 0);
  const subtotal = activeItems.reduce(
    (acc, item) => acc + item.unitPrice * item.subscriptionQuantity,
    0
  );
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const handleSubscribe = () => {
    if (!acceptedTerms) {
      toast.error("Debes aceptar los términos y condiciones para continuar");
      return;
    }

    if (activeItems.length === 0) {
      toast.error("Debes seleccionar al menos un producto para suscribirte");
      return;
    }

    const frequencyLabel = FREQUENCY_OPTIONS.find((f) => f.value === frequency)?.label;
    toast.success(
      `¡Suscripción creada! Recibirás ${activeItems.length} producto(s) ${frequencyLabel?.toLowerCase()}`
    );
    onOpenChange(false);
    
    // Reset state
    setAcceptedTerms(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when closing
      setSubscriptionItems(
        items.map((item) => ({ ...item, subscriptionQuantity: item.quantity }))
      );
      setFrequency("monthly");
      setAcceptedTerms(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CalendarClock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Suscribirse a la Orden {orderNumber}</DialogTitle>
              <DialogDescription>
                Recibe estos productos de forma automática en el intervalo que prefieras
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Frequency Selection */}
        <div className="space-y-2">
          <Label htmlFor="frequency">Frecuencia de entrega</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger id="frequency" className="w-full">
              <SelectValue placeholder="Selecciona la frecuencia" />
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

        {/* Products */}
        <div className="space-y-3">
          <Label>Productos a suscribir</Label>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {subscriptionItems.map((item, index) => (
              <div
                key={index}
                className={`flex gap-3 p-3 rounded-lg border transition-colors ${
                  item.subscriptionQuantity > 0
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-muted/30 opacity-60"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(item.unitPrice)} c/u
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(index, -1)}
                    disabled={item.subscriptionQuantity === 0}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.subscriptionQuantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(index, 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Totals */}
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

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg border border-border">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
            className="mt-0.5"
          />
          <div className="space-y-1">
            <Label
              htmlFor="terms"
              className="text-sm font-medium cursor-pointer leading-tight"
            >
              Acepto los términos y condiciones de la suscripción
            </Label>
            <p className="text-xs text-muted-foreground">
              Al suscribirte, aceptas que se realizarán cargos automáticos a tu método de
              pago según la frecuencia seleccionada. Puedes pausar o cancelar tu suscripción
              en cualquier momento desde la sección de Suscripciones.
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">
              Beneficios de suscribirte
            </p>
            <ul className="text-muted-foreground text-xs mt-1 space-y-0.5">
              <li>• Entregas automáticas sin preocuparte por reordenar</li>
              <li>• Puedes modificar, pausar o cancelar en cualquier momento</li>
              <li>• Ajusta las cantidades según tus necesidades</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubscribe}
            disabled={!acceptedTerms || activeItems.length === 0}
          >
            <CalendarClock className="w-4 h-4 mr-2" />
            Crear suscripción
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
