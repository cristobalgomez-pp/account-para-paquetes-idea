import { Truck, Package, CheckCircle2, Clock, MapPin, Box } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TrackingEvent {
  date: string;
  time: string;
  status: string;
  location: string;
  description: string;
}

interface TrackingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  trackingNumber: string;
  shippingStatus: "delivered" | "shipped" | "processing" | "pending";
}

// Checkpoint stages for e-commerce order
const CHECKPOINTS = [
  { id: "confirmed", label: "Confirmado", icon: CheckCircle2 },
  { id: "processing", label: "Procesando", icon: Box },
  { id: "shipped", label: "Enviado", icon: Truck },
  { id: "in_transit", label: "En tránsito", icon: MapPin },
  { id: "delivered", label: "Entregado", icon: Package },
];

// Map shipping status to checkpoint index
const STATUS_TO_CHECKPOINT: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 3,
  delivered: 4,
};

// Demo tracking events based on status
const getTrackingEvents = (status: string, trackingNumber: string): TrackingEvent[] => {
  const baseEvents: TrackingEvent[] = [
    {
      date: "2026-01-02",
      time: "10:30",
      status: "Pedido confirmado",
      location: "Sistema",
      description: "Tu pedido ha sido confirmado y está siendo preparado",
    },
  ];

  if (status === "pending") return baseEvents;

  const processingEvents: TrackingEvent[] = [
    ...baseEvents,
    {
      date: "2026-01-03",
      time: "09:15",
      status: "En preparación",
      location: "Centro de distribución CDMX",
      description: "Tu pedido está siendo empacado",
    },
  ];

  if (status === "processing") return processingEvents.reverse();

  const shippedEvents: TrackingEvent[] = [
    ...processingEvents,
    {
      date: "2026-01-03",
      time: "14:45",
      status: "Enviado",
      location: "Centro de distribución CDMX",
      description: `Paquete enviado con número de rastreo ${trackingNumber}`,
    },
    {
      date: "2026-01-04",
      time: "08:00",
      status: "En tránsito",
      location: "Centro de distribución Querétaro",
      description: "Tu paquete está en camino",
    },
    {
      date: "2026-01-05",
      time: "06:30",
      status: "En reparto",
      location: "Tu ciudad",
      description: "El paquete salió a reparto",
    },
  ];

  if (status === "shipped") return shippedEvents.reverse();

  const deliveredEvents: TrackingEvent[] = [
    ...shippedEvents,
    {
      date: "2026-01-05",
      time: "14:22",
      status: "Entregado",
      location: "Tu dirección",
      description: "Paquete entregado exitosamente",
    },
  ];

  return deliveredEvents.reverse();
};

const getStatusBadge = (status: string) => {
  const config: Record<string, { label: string; variant: "success" | "info" | "warning" | "pending" }> = {
    delivered: { label: "Entregado", variant: "success" },
    shipped: { label: "En camino", variant: "info" },
    processing: { label: "Procesando", variant: "pending" },
    pending: { label: "Pendiente", variant: "warning" },
  };
  const statusConfig = config[status] || config.pending;
  return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

export function TrackingDialog({
  open,
  onOpenChange,
  orderNumber,
  trackingNumber,
  shippingStatus,
}: TrackingDialogProps) {
  const currentCheckpoint = STATUS_TO_CHECKPOINT[shippingStatus] ?? 0;
  const trackingEvents = getTrackingEvents(shippingStatus, trackingNumber);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle>Rastreo de Orden {orderNumber}</DialogTitle>
                {getStatusBadge(shippingStatus)}
              </div>
              <DialogDescription>
                Número de rastreo: <span className="font-mono font-medium text-foreground">{trackingNumber}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Checkpoints */}
        <div className="py-4">
          <div className="relative">
            {/* Progress Bar Background */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full" />
            
            {/* Progress Bar Fill */}
            <div
              className="absolute top-5 left-0 h-1 bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(currentCheckpoint / (CHECKPOINTS.length - 1)) * 100}%` }}
            />

            {/* Checkpoint Icons */}
            <div className="relative flex justify-between">
              {CHECKPOINTS.map((checkpoint, index) => {
                const isCompleted = index <= currentCheckpoint;
                const isCurrent = index === currentCheckpoint;
                const Icon = checkpoint.icon;

                return (
                  <div key={checkpoint.id} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs mt-2 text-center ${
                        isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {checkpoint.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Separator />

        {/* Tracking History */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground mb-3">Historial de envío</h3>
          <div className="space-y-0">
            {trackingEvents.map((event, index) => (
              <div key={index} className="relative pl-6 pb-4">
                {/* Timeline line */}
                {index !== trackingEvents.length - 1 && (
                  <div className="absolute left-[9px] top-3 bottom-0 w-0.5 bg-border" />
                )}
                
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-1 w-[18px] h-[18px] rounded-full border-2 ${
                    index === 0
                      ? "bg-primary border-primary"
                      : "bg-background border-muted-foreground/30"
                  }`}
                >
                  {index === 0 && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* Event content */}
                <div className="ml-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-medium ${index === 0 ? "text-primary" : "text-foreground"}`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(event.date)} • {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery estimate for non-delivered orders */}
        {shippingStatus !== "delivered" && (
          <>
            <Separator />
            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Entrega estimada</p>
                <p className="text-sm text-muted-foreground">
                  {shippingStatus === "shipped"
                    ? "Hoy o mañana antes de las 6:00 PM"
                    : shippingStatus === "processing"
                    ? "3-5 días hábiles"
                    : "Procesando tu pedido..."}
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
