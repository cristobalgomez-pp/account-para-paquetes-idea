import { RefreshCw, ArrowLeft, Pause, Play, Trash2, Plus, Minus, Calendar, Package, Edit, ChevronDown, ChevronUp, Pencil, Check, X } from "lucide-react";
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
import { useSubscriptions, SubscriptionProduct } from "@/contexts/SubscriptionsContext";
import { CreateSubscriptionDialog } from "@/components/CreateSubscriptionDialog";

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Cada día" },
  { value: "weekly", label: "Cada semana" },
  { value: "biweekly", label: "Cada 15 días" },
  { value: "monthly", label: "Cada mes" },
  { value: "bimonthly", label: "Cada 2 meses" },
  { value: "quarterly", label: "Cada 3 meses" },
  { value: "semiannual", label: "Cada 6 meses" },
];

const Subscriptions = () => {
  const {
    subscriptions,
    deleteSubscription: contextDeleteSubscription,
    togglePauseSubscription,
    updateSubscription,
    updateProductQuantity: contextUpdateProductQuantity,
    removeProduct: contextRemoveProduct,
  } = useSubscriptions();
  const [expandedSubscriptions, setExpandedSubscriptions] = useState<Set<string>>(new Set(["1"]));
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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
    const sub = subscriptions.find(s => s.id === subscriptionId);
    if (sub) {
      const newStatus = sub.status === "active" ? "paused" : "active";
      togglePauseSubscription(subscriptionId);
      toast({
        title: newStatus === "paused" ? "Suscripción pausada" : "Suscripción reactivada",
        description: newStatus === "paused"
          ? "Tu suscripción ha sido pausada. No recibirás más entregas hasta que la reactives."
          : "Tu suscripción ha sido reactivada.",
      });
    }
  };

  const deleteSubscription = (subscriptionId: string) => {
    contextDeleteSubscription(subscriptionId);
    toast({
      title: "Suscripción eliminada",
      description: "La suscripción ha sido eliminada permanentemente.",
    });
  };

  const updateFrequency = (subscriptionId: string, newFrequency: string) => {
    updateSubscription(subscriptionId, { frequency: newFrequency });
    toast({
      title: "Frecuencia actualizada",
      description: `La frecuencia ha sido cambiada a "${getFrequencyLabel(newFrequency)}".`,
    });
  };

  const updateProductQuantity = (subscriptionId: string, productId: string, delta: number) => {
    const sub = subscriptions.find(s => s.id === subscriptionId);
    if (sub) {
      const product = sub.products.find(p => p.id === productId);
      if (product && product.quantity + delta <= 0 && sub.products.length === 1) {
        toast({
          title: "Suscripción vacía",
          description: "Se eliminaron todos los productos. La suscripción será eliminada.",
          variant: "destructive",
        });
      }
    }
    contextUpdateProductQuantity(subscriptionId, productId, delta);
  };

  const removeProduct = (subscriptionId: string, productId: string) => {
    const sub = subscriptions.find(s => s.id === subscriptionId);
    if (sub && sub.products.length === 1) {
      toast({
        title: "Suscripción eliminada",
        description: "Se eliminó el último producto. La suscripción ha sido eliminada.",
      });
    } else {
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado de la suscripción.",
      });
    }
    contextRemoveProduct(subscriptionId, productId);
  };

  const startEditingName = (subscriptionId: string, currentName: string) => {
    setEditingNameId(subscriptionId);
    setEditingNameValue(currentName);
  };

  const saveEditingName = () => {
    if (editingNameId && editingNameValue.trim()) {
      updateSubscription(editingNameId, { name: editingNameValue.trim() });
      toast({
        title: "Nombre actualizado",
        description: "El nombre de la suscripción ha sido actualizado.",
      });
    }
    setEditingNameId(null);
    setEditingNameValue("");
  };

  const cancelEditingName = () => {
    setEditingNameId(null);
    setEditingNameValue("");
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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
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
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva suscripción
          </Button>
        </div>

        {subscriptions.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No tienes suscripciones activas</p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear tu primera suscripción
            </Button>
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
                          {editingNameId === subscription.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingNameValue}
                                onChange={(e) => setEditingNameValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveEditingName();
                                  if (e.key === "Escape") cancelEditingName();
                                }}
                                className="text-lg font-semibold bg-background border border-input rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring"
                                autoFocus
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-primary"
                                onClick={saveEditingName}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground"
                                onClick={cancelEditingName}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group">
                              <CardTitle className="text-lg">{subscription.name}</CardTitle>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => startEditingName(subscription.id, subscription.name)}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
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

        <CreateSubscriptionDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </div>
    </div>
  );
};

export default Subscriptions;
