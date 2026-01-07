import { RefreshCw, ArrowLeft, Pause, Play, Trash2, Plus, Minus, Calendar, Package, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SubscriptionProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
}

interface Subscription {
  id: string;
  name: string;
  frequency: string;
  status: "active" | "paused";
  nextDelivery: string;
  createdAt: string;
  products: SubscriptionProduct[];
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

const DEMO_SUBSCRIPTIONS: Subscription[] = [
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

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(DEMO_SUBSCRIPTIONS);
  const [expandedSubscriptions, setExpandedSubscriptions] = useState<Set<string>>(new Set(["1"]));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (dateString === "—") return "—";
    return new Date(dateString).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getFrequencyLabel = (frequency: string) => {
    return FREQUENCY_OPTIONS.find(opt => opt.value === frequency)?.label || frequency;
  };

  const calculateTotal = (products: SubscriptionProduct[]) => {
    return products.reduce((acc, product) => acc + product.price * product.quantity, 0);
  };

  const toggleExpanded = (subscriptionId: string) => {
    setExpandedSubscriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subscriptionId)) {
        newSet.delete(subscriptionId);
      } else {
        newSet.add(subscriptionId);
      }
      return newSet;
    });
  };

  const togglePause = (subscriptionId: string) => {
    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.id === subscriptionId) {
          const newStatus = sub.status === "active" ? "paused" : "active";
          toast({
            title: newStatus === "paused" ? "Suscripción pausada" : "Suscripción reactivada",
            description: newStatus === "paused"
              ? "Tu suscripción ha sido pausada. No recibirás más entregas hasta que la reactives."
              : "Tu suscripción ha sido reactivada.",
          });
          return {
            ...sub,
            status: newStatus,
            nextDelivery: newStatus === "paused" ? "—" : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          };
        }
        return sub;
      })
    );
  };

  const deleteSubscription = (subscriptionId: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
    toast({
      title: "Suscripción eliminada",
      description: "La suscripción ha sido eliminada permanentemente.",
    });
  };

  const updateFrequency = (subscriptionId: string, newFrequency: string) => {
    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.id === subscriptionId) {
          toast({
            title: "Frecuencia actualizada",
            description: `La frecuencia ha sido cambiada a "${getFrequencyLabel(newFrequency)}".`,
          });
          return { ...sub, frequency: newFrequency };
        }
        return sub;
      })
    );
  };

  const updateProductQuantity = (subscriptionId: string, productId: string, delta: number) => {
    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.id === subscriptionId) {
          const updatedProducts = sub.products
            .map(product => {
              if (product.id === productId) {
                const newQuantity = Math.max(0, product.quantity + delta);
                return { ...product, quantity: newQuantity };
              }
              return product;
            })
            .filter(product => product.quantity > 0);

          if (updatedProducts.length === 0) {
            toast({
              title: "Suscripción vacía",
              description: "Se eliminaron todos los productos. La suscripción será eliminada.",
              variant: "destructive",
            });
            return null;
          }

          return { ...sub, products: updatedProducts };
        }
        return sub;
      }).filter(Boolean) as Subscription[]
    );
  };

  const removeProduct = (subscriptionId: string, productId: string) => {
    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.id === subscriptionId) {
          const updatedProducts = sub.products.filter(p => p.id !== productId);
          if (updatedProducts.length === 0) {
            toast({
              title: "Suscripción eliminada",
              description: "Se eliminó el último producto. La suscripción ha sido eliminada.",
            });
            return null;
          }
          toast({
            title: "Producto eliminado",
            description: "El producto ha sido eliminado de la suscripción.",
          });
          return { ...sub, products: updatedProducts };
        }
        return sub;
      }).filter(Boolean) as Subscription[]
    );
  };

  const activeCount = subscriptions.filter(s => s.status === "active").length;
  const pausedCount = subscriptions.filter(s => s.status === "paused").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-subscriptions flex items-center justify-center">
            <RefreshCw className="w-7 h-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Suscripciones</h1>
            <p className="text-muted-foreground">
              {subscriptions.length} suscripciones ({activeCount} activas, {pausedCount} pausadas)
            </p>
          </div>
        </div>

        {subscriptions.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tienes suscripciones activas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id}>
                <Collapsible
                  open={expandedSubscriptions.has(subscription.id)}
                  onOpenChange={() => toggleExpanded(subscription.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            {expandedSubscriptions.has(subscription.id) ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <div>
                          <CardTitle className="text-lg">{subscription.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                              {subscription.status === "active" ? "Activa" : "Pausada"}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {getFrequencyLabel(subscription.frequency)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePause(subscription.id)}
                          className="gap-1"
                        >
                          {subscription.status === "active" ? (
                            <>
                              <Pause className="w-3 h-3" />
                              Pausar
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" />
                              Reactivar
                            </>
                          )}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive">
                              <Trash2 className="w-3 h-3" />
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar suscripción?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente la suscripción "{subscription.name}" y todos sus productos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteSubscription(subscription.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      {/* Subscription Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Próxima entrega</p>
                            <p className="text-sm font-medium">{formatDate(subscription.nextDelivery)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Total por entrega</p>
                            <p className="text-sm font-medium">{formatPrice(calculateTotal(subscription.products))}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Frecuencia</p>
                            <Select
                              value={subscription.frequency}
                              onValueChange={(value) => updateFrequency(subscription.id, value)}
                            >
                              <SelectTrigger className="h-7 text-xs w-[140px]">
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
                        </div>
                      </div>

                      {/* Products */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-foreground">Productos en esta suscripción</h4>
                        {subscription.products.map((product) => (
                          <div
                            key={product.id}
                            className="flex flex-col sm:flex-row gap-3 p-3 border border-border rounded-lg"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{product.name}</p>
                              <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                              <p className="text-sm font-semibold text-primary mt-1">
                                {formatPrice(product.price)} c/u
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateProductQuantity(subscription.id, product.id, -1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-6 text-center text-sm font-medium">{product.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateProductQuantity(subscription.id, product.id, 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold">{formatPrice(product.price * product.quantity)}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => removeProduct(subscription.id, product.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
