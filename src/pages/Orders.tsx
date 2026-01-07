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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "sonner";

type PaymentStatus = "paid" | "pending" | "failed";
type ShippingStatus = "delivered" | "shipped" | "processing" | "pending";
type InvoiceStatus = "invoiced" | "pending";

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: string;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  invoiceStatus: InvoiceStatus;
  items: OrderItem[];
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
    items: [
      { name: "MacBook Pro 14\"", quantity: 1, price: "$999.00" },
      { name: "Magic Mouse", quantity: 1, price: "$129.00" },
      { name: "USB-C Cable", quantity: 2, price: "$61.00" },
    ],
  },
  {
    id: "2",
    orderNumber: "#1002",
    date: "2026-01-04",
    total: "$890.50",
    paymentStatus: "paid",
    shippingStatus: "shipped",
    invoiceStatus: "pending",
    items: [
      { name: "iPhone 15 Pro Case", quantity: 2, price: "$98.00" },
      { name: "AirPods Pro", quantity: 1, price: "$792.50" },
    ],
  },
  {
    id: "3",
    orderNumber: "#1003",
    date: "2026-01-03",
    total: "$2,100.00",
    paymentStatus: "pending",
    shippingStatus: "processing",
    invoiceStatus: "pending",
    items: [
      { name: "iPad Pro 12.9\"", quantity: 1, price: "$1,299.00" },
      { name: "Apple Pencil", quantity: 1, price: "$129.00" },
      { name: "Magic Keyboard", quantity: 1, price: "$349.00" },
      { name: "iPad Case", quantity: 1, price: "$199.00" },
      { name: "Screen Protector", quantity: 2, price: "$124.00" },
    ],
  },
  {
    id: "4",
    orderNumber: "#1004",
    date: "2026-01-02",
    total: "$450.00",
    paymentStatus: "paid",
    shippingStatus: "pending",
    invoiceStatus: "pending",
    items: [
      { name: "Apple Watch Series 9", quantity: 1, price: "$450.00" },
    ],
  },
  {
    id: "5",
    orderNumber: "#1005",
    date: "2026-01-01",
    total: "$3,200.00",
    paymentStatus: "failed",
    shippingStatus: "pending",
    invoiceStatus: "pending",
    items: [
      { name: "MacBook Air M3", quantity: 2, price: "$2,398.00" },
      { name: "Magic Trackpad", quantity: 1, price: "$149.00" },
      { name: "Thunderbolt Cable", quantity: 3, price: "$653.00" },
    ],
  },
  {
    id: "6",
    orderNumber: "#1006",
    date: "2025-12-28",
    total: "$675.25",
    paymentStatus: "paid",
    shippingStatus: "delivered",
    invoiceStatus: "invoiced",
    items: [
      { name: "HomePod Mini", quantity: 2, price: "$198.00" },
      { name: "Apple TV 4K", quantity: 1, price: "$477.25" },
    ],
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
                      <Link 
                        to={`/orders/${order.orderNumber.replace('#', '')}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                      <HoverCard openDelay={200} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          <p className="text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors underline decoration-dashed underline-offset-2">
                            {order.items.length} artículos
                          </p>
                        </HoverCardTrigger>
                        <HoverCardContent align="start" className="w-72">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-foreground">
                              Artículos en {order.orderNumber}
                            </h4>
                            <div className="divide-y divide-border">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground truncate">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                                  </div>
                                  <span className="text-sm font-medium text-foreground ml-2">{item.price}</span>
                                </div>
                              ))}
                            </div>
                            <div className="pt-2 border-t border-border flex justify-between">
                              <span className="text-sm font-semibold">Total</span>
                              <span className="text-sm font-semibold">{order.total}</span>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
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