import { Package, ArrowLeft, MoreHorizontal, FileText, Headphones, Eye, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type PaymentStatus = "paid" | "pending" | "failed";
type ShippingStatus = "delivered" | "shipped" | "processing" | "pending";
type InvoiceStatus = "invoiced" | "pending";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: string;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  invoiceStatus: InvoiceStatus;
  items: number;
}

const orders: Order[] = [
  {
    id: "1",
    orderNumber: "#1001",
    date: "2026-01-05",
    total: "$1,250.00",
    paymentStatus: "paid",
    shippingStatus: "delivered",
    invoiceStatus: "invoiced",
    items: 3,
  },
  {
    id: "2",
    orderNumber: "#1002",
    date: "2026-01-04",
    total: "$890.50",
    paymentStatus: "paid",
    shippingStatus: "shipped",
    invoiceStatus: "pending",
    items: 2,
  },
  {
    id: "3",
    orderNumber: "#1003",
    date: "2026-01-03",
    total: "$2,100.00",
    paymentStatus: "pending",
    shippingStatus: "processing",
    invoiceStatus: "pending",
    items: 5,
  },
  {
    id: "4",
    orderNumber: "#1004",
    date: "2026-01-02",
    total: "$450.00",
    paymentStatus: "paid",
    shippingStatus: "pending",
    invoiceStatus: "pending",
    items: 1,
  },
  {
    id: "5",
    orderNumber: "#1005",
    date: "2026-01-01",
    total: "$3,200.00",
    paymentStatus: "failed",
    shippingStatus: "pending",
    invoiceStatus: "pending",
    items: 4,
  },
  {
    id: "6",
    orderNumber: "#1006",
    date: "2025-12-28",
    total: "$675.25",
    paymentStatus: "paid",
    shippingStatus: "delivered",
    invoiceStatus: "invoiced",
    items: 2,
  },
];

const getPaymentStatusBadge = (status: PaymentStatus) => {
  const config = {
    paid: { label: "Pagado", variant: "success" as const },
    pending: { label: "Pendiente", variant: "warning" as const },
    failed: { label: "Fallido", variant: "destructive" as const },
  };
  return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
};

const getShippingStatusBadge = (status: ShippingStatus) => {
  const config = {
    delivered: { label: "Entregado", variant: "success" as const },
    shipped: { label: "En camino", variant: "info" as const },
    processing: { label: "Procesando", variant: "pending" as const },
    pending: { label: "Pendiente", variant: "warning" as const },
  };
  return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
};

const getInvoiceStatusBadge = (status: InvoiceStatus) => {
  const config = {
    invoiced: { label: "Facturado", variant: "success" as const },
    pending: { label: "Sin facturar", variant: "secondary" as const },
  };
  return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
};

const Orders = () => {
  const handleInvoice = (orderNumber: string) => {
    toast.success(`Iniciando proceso de facturación para ${orderNumber}`);
  };

  const handleSupport = (orderNumber: string) => {
    toast.info(`Creando ticket de soporte para ${orderNumber}`);
  };

  const handleViewDetails = (orderNumber: string) => {
    toast.info(`Viendo detalles de ${orderNumber}`);
  };

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
          <div className="w-14 h-14 rounded-xl bg-orders flex items-center justify-center">
            <Package className="w-7 h-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Órdenes</h1>
            <p className="text-muted-foreground">Historial y estado de tus pedidos</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Pedido</TableHead>
                <TableHead className="font-semibold">Fecha</TableHead>
                <TableHead className="font-semibold">Total</TableHead>
                <TableHead className="font-semibold">Pago</TableHead>
                <TableHead className="font-semibold">Envío</TableHead>
                <TableHead className="font-semibold">Facturación</TableHead>
                <TableHead className="font-semibold text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <span className="font-semibold text-foreground">{order.orderNumber}</span>
                      <p className="text-xs text-muted-foreground">{order.items} artículos</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.date).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="font-medium">{order.total}</TableCell>
                  <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                  <TableCell>{getShippingStatusBadge(order.shippingStatus)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getInvoiceStatusBadge(order.invoiceStatus)}
                      {order.invoiceStatus === "pending" && order.paymentStatus === "paid" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleInvoice(order.orderNumber)}
                        >
                          <ReceiptText className="w-3 h-3 mr-1" />
                          Facturar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewDetails(order.orderNumber)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        {order.invoiceStatus === "invoiced" && (
                          <DropdownMenuItem onClick={() => toast.info("Descargando factura...")}>
                            <FileText className="w-4 h-4 mr-2" />
                            Descargar factura
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleSupport(order.orderNumber)}>
                          <Headphones className="w-4 h-4 mr-2" />
                          Levantar ticket de soporte
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Orders;