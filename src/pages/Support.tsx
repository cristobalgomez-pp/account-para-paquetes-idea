import { useState } from "react";
import { Headphones, Clock, CheckCircle2, AlertCircle, MessageSquare, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupportTicketDialog, SupportTicket } from "@/components/SupportTicketDialog";
import AccountNav from "@/components/AccountNav";

// Demo data for tickets
const demoTickets: (SupportTicket & { orderNumber: string })[] = [
  {
    ticketNumber: "TKT-847291",
    orderNumber: "#1001",
    problemType: "defective_product",
    status: "in_progress",
    createdAt: "2026-01-06",
    events: [
      {
        id: "1",
        date: "06 Ene 2026",
        time: "10:30",
        status: "created",
        title: "Ticket creado",
        description: "El cliente reportó un problema con el producto recibido.",
      },
      {
        id: "2",
        date: "06 Ene 2026",
        time: "11:45",
        status: "in_review",
        title: "En revisión",
        description: "Tu caso ha sido asignado a un agente de soporte.",
        agent: "María González",
      },
      {
        id: "3",
        date: "06 Ene 2026",
        time: "14:20",
        status: "in_progress",
        title: "En proceso",
        description: "Estamos coordinando el envío de un producto de reemplazo.",
        agent: "María González",
      },
    ],
  },
  {
    ticketNumber: "TKT-623847",
    orderNumber: "#1002",
    problemType: "delivery_issues",
    status: "waiting_customer",
    createdAt: "2026-01-05",
    events: [
      {
        id: "1",
        date: "05 Ene 2026",
        time: "09:15",
        status: "created",
        title: "Ticket creado",
        description: "El cliente reportó un problema con la entrega.",
      },
      {
        id: "2",
        date: "05 Ene 2026",
        time: "10:30",
        status: "in_review",
        title: "En revisión",
        description: "Estamos investigando con el servicio de mensajería.",
        agent: "Carlos Ruiz",
      },
      {
        id: "3",
        date: "06 Ene 2026",
        time: "16:00",
        status: "waiting_customer",
        title: "Esperando respuesta",
        description: "Se solicitó información adicional sobre la dirección de entrega.",
        agent: "Carlos Ruiz",
      },
    ],
  },
  {
    ticketNumber: "TKT-512983",
    orderNumber: "#1006",
    problemType: "return_request",
    status: "resolved",
    createdAt: "2025-12-30",
    events: [
      {
        id: "1",
        date: "30 Dic 2025",
        time: "11:00",
        status: "created",
        title: "Ticket creado",
        description: "El cliente solicitó devolución de producto.",
      },
      {
        id: "2",
        date: "30 Dic 2025",
        time: "14:00",
        status: "in_progress",
        title: "Procesando devolución",
        description: "Se generó la guía de devolución.",
        agent: "Ana López",
      },
      {
        id: "3",
        date: "03 Ene 2026",
        time: "10:00",
        status: "resolved",
        title: "Resuelto",
        description: "Devolución completada y reembolso procesado.",
        agent: "Ana López",
      },
    ],
  },
  {
    ticketNumber: "TKT-401827",
    orderNumber: "#1005",
    problemType: "payment_issues",
    status: "closed",
    createdAt: "2025-12-28",
    events: [
      {
        id: "1",
        date: "28 Dic 2025",
        time: "08:30",
        status: "created",
        title: "Ticket creado",
        description: "El cliente reportó un cargo duplicado.",
      },
      {
        id: "2",
        date: "28 Dic 2025",
        time: "12:00",
        status: "in_progress",
        title: "Investigando",
        description: "Se está revisando el historial de transacciones.",
        agent: "Roberto Martínez",
      },
      {
        id: "3",
        date: "29 Dic 2025",
        time: "15:00",
        status: "resolved",
        title: "Resuelto",
        description: "El cargo duplicado fue reembolsado.",
        agent: "Roberto Martínez",
      },
      {
        id: "4",
        date: "02 Ene 2026",
        time: "09:00",
        status: "closed",
        title: "Cerrado",
        description: "Caso cerrado después de confirmación del cliente.",
        agent: "Roberto Martínez",
      },
    ],
  },
];

const PROBLEM_OPTIONS: Record<string, string> = {
  missing_product: "Producto faltante",
  wrong_product: "Producto equivocado",
  defective_product: "Producto defectuoso",
  delivery_issues: "Problemas con la entrega",
  return_request: "Solicitud de devolución",
  payment_issues: "Problemas con mi pago",
  other: "Otro",
};

const TICKET_STATUS_CONFIG = {
  open: { label: "Abierto", variant: "info" as const, icon: AlertCircle },
  in_progress: { label: "En proceso", variant: "pending" as const, icon: Clock },
  waiting_customer: { label: "Esperando respuesta", variant: "warning" as const, icon: MessageSquare },
  resolved: { label: "Resuelto", variant: "success" as const, icon: CheckCircle2 },
  closed: { label: "Cerrado", variant: "secondary" as const, icon: CheckCircle2 },
};

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<(SupportTicket & { orderNumber: string }) | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredTickets = demoTickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      PROBLEM_OPTIONS[ticket.problemType]?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeTickets = demoTickets.filter(
    (t) => t.status === "open" || t.status === "in_progress" || t.status === "waiting_customer"
  ).length;

  const handleTicketClick = (ticket: (SupportTicket & { orderNumber: string })) => {
    setSelectedTicket(ticket);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AccountNav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-support flex items-center justify-center">
              <Headphones className="w-7 h-7 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Soporte</h1>
              <p className="text-muted-foreground">
                {activeTickets} ticket{activeTickets !== 1 ? "s" : ""} activo{activeTickets !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo ticket
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número de ticket, orden o tipo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="open">Abierto</SelectItem>
              <SelectItem value="in_progress">En proceso</SelectItem>
              <SelectItem value="waiting_customer">Esperando respuesta</SelectItem>
              <SelectItem value="resolved">Resuelto</SelectItem>
              <SelectItem value="closed">Cerrado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Headphones className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay tickets</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "No se encontraron tickets con los filtros aplicados."
                  : "No tienes tickets de soporte aún."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const StatusIcon = TICKET_STATUS_CONFIG[ticket.status].icon;
              const lastEvent = ticket.events[ticket.events.length - 1];

              return (
                <Card
                  key={ticket.ticketNumber}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handleTicketClick(ticket)}
                >
                  <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Ticket Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">
                            {ticket.ticketNumber}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">
                            Orden {ticket.orderNumber}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          {PROBLEM_OPTIONS[ticket.problemType]}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {lastEvent.title}: {lastEvent.description}
                        </p>
                      </div>

                      {/* Status & Date */}
                      <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                        <Badge
                          variant={TICKET_STATUS_CONFIG[ticket.status].variant}
                          className="gap-1"
                        >
                          <StatusIcon className="w-3 h-3" />
                          {TICKET_STATUS_CONFIG[ticket.status].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(ticket.createdAt).toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Ticket Dialog */}
        {selectedTicket && (
          <SupportTicketDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            orderNumber={selectedTicket.orderNumber}
            existingTicket={selectedTicket}
          />
        )}
      </div>
    </div>
  );
};

export default Support;
