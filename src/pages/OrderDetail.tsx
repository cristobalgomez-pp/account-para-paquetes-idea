import { useState } from "react";
import { 
  ArrowLeft, 
  Package, 
  ReceiptText, 
  Headphones, 
  RefreshCw, 
  CalendarClock, 
  Share2, 
  Printer, 
  Download,
  MapPin,
  CreditCard,
  Truck
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { InvoiceDialog, BillingAddress } from "@/components/InvoiceDialog";

// Demo billing addresses (simulating user's saved addresses)
const initialBillingAddresses: BillingAddress[] = [
  {
    id: "1",
    rfc: "ABC123456789",
    razonSocial: "Empresa Demo S.A. de C.V.",
    usoCfdi: "G03",
    regimenFiscal: "601",
    email: "facturacion@empresademo.com",
    codigoPostal: "06600",
    calle: "Av. Reforma",
    numeroExterior: "222",
    numeroInterior: "Piso 10",
    colonia: "Juárez",
    municipio: "Cuauhtémoc",
    estado: "CMX",
    pais: "México",
    isDefault: true,
  },
];

// Demo: Auto invoicing setting (simulating user preference)
const AUTO_INVOICING_ENABLED = false; // Change to true to test auto-invoicing

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  date: string;
  paymentStatus: "paid" | "pending" | "failed";
  shippingStatus: "delivered" | "shipped" | "processing" | "pending";
  invoiceStatus: "invoiced" | "pending";
  items: OrderItem[];
  subtotal: number;
  iva: number;
  ieps: number;
  shipping: number;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: {
    type: string;
    last4: string;
  };
  trackingNumber?: string;
}

const ordersData: Record<string, OrderDetail> = {
  "1001": {
    id: "1",
    orderNumber: "#1001",
    date: "2026-01-05",
    paymentStatus: "paid",
    shippingStatus: "delivered",
    invoiceStatus: "invoiced",
    items: [
      { name: "MacBook Pro 14\"", quantity: 1, unitPrice: 999.00, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop" },
      { name: "Magic Mouse", quantity: 1, unitPrice: 129.00, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop" },
      { name: "USB-C Cable", quantity: 2, unitPrice: 30.50, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop" },
    ],
    subtotal: 1189.00,
    iva: 190.24,
    ieps: 0,
    shipping: 0,
    total: 1379.24,
    shippingAddress: {
      name: "Juan Pérez",
      street: "Av. Reforma 123, Piso 4",
      city: "Ciudad de México",
      state: "CDMX",
      zip: "06600",
    },
    paymentMethod: {
      type: "Visa",
      last4: "4242",
    },
    trackingNumber: "MX123456789",
  },
  "1002": {
    id: "2",
    orderNumber: "#1002",
    date: "2026-01-04",
    paymentStatus: "paid",
    shippingStatus: "shipped",
    invoiceStatus: "pending",
    items: [
      { name: "iPhone 15 Pro Case", quantity: 2, unitPrice: 49.00, image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100&h=100&fit=crop" },
      { name: "AirPods Pro", quantity: 1, unitPrice: 249.00, image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=100&h=100&fit=crop" },
    ],
    subtotal: 347.00,
    iva: 55.52,
    ieps: 0,
    shipping: 99.00,
    total: 501.52,
    shippingAddress: {
      name: "María García",
      street: "Calle Monterrey 456",
      city: "Guadalajara",
      state: "Jalisco",
      zip: "44100",
    },
    paymentMethod: {
      type: "Mastercard",
      last4: "8888",
    },
    trackingNumber: "MX987654321",
  },
  "1003": {
    id: "3",
    orderNumber: "#1003",
    date: "2026-01-03",
    paymentStatus: "pending",
    shippingStatus: "processing",
    invoiceStatus: "pending",
    items: [
      { name: "iPad Pro 12.9\"", quantity: 1, unitPrice: 1299.00, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop" },
      { name: "Apple Pencil", quantity: 1, unitPrice: 129.00, image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=100&h=100&fit=crop" },
      { name: "Magic Keyboard", quantity: 1, unitPrice: 349.00, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&h=100&fit=crop" },
      { name: "iPad Case", quantity: 1, unitPrice: 199.00, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" },
      { name: "Screen Protector", quantity: 2, unitPrice: 62.00, image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=100&h=100&fit=crop" },
    ],
    subtotal: 2100.00,
    iva: 336.00,
    ieps: 0,
    shipping: 0,
    total: 2436.00,
    shippingAddress: {
      name: "Carlos López",
      street: "Blvd. Independencia 789",
      city: "Monterrey",
      state: "Nuevo León",
      zip: "64000",
    },
    paymentMethod: {
      type: "AMEX",
      last4: "1234",
    },
  },
  "1004": {
    id: "4",
    orderNumber: "#1004",
    date: "2026-01-02",
    paymentStatus: "paid",
    shippingStatus: "pending",
    invoiceStatus: "pending",
    items: [
      { name: "Apple Watch Series 9", quantity: 1, unitPrice: 450.00, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&h=100&fit=crop" },
    ],
    subtotal: 450.00,
    iva: 72.00,
    ieps: 0,
    shipping: 0,
    total: 522.00,
    shippingAddress: {
      name: "Ana Martínez",
      street: "Calle 5 de Mayo 321",
      city: "Puebla",
      state: "Puebla",
      zip: "72000",
    },
    paymentMethod: {
      type: "Visa",
      last4: "9999",
    },
  },
  "1005": {
    id: "5",
    orderNumber: "#1005",
    date: "2026-01-01",
    paymentStatus: "failed",
    shippingStatus: "pending",
    invoiceStatus: "pending",
    items: [
      { name: "MacBook Air M3", quantity: 2, unitPrice: 1199.00, image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&h=100&fit=crop" },
      { name: "Magic Trackpad", quantity: 1, unitPrice: 149.00, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop" },
      { name: "Thunderbolt Cable", quantity: 3, unitPrice: 79.00, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop" },
    ],
    subtotal: 2784.00,
    iva: 445.44,
    ieps: 0,
    shipping: 150.00,
    total: 3379.44,
    shippingAddress: {
      name: "Roberto Sánchez",
      street: "Av. Universidad 654",
      city: "Querétaro",
      state: "Querétaro",
      zip: "76000",
    },
    paymentMethod: {
      type: "Mastercard",
      last4: "5555",
    },
  },
  "1006": {
    id: "6",
    orderNumber: "#1006",
    date: "2025-12-28",
    paymentStatus: "paid",
    shippingStatus: "delivered",
    invoiceStatus: "invoiced",
    items: [
      { name: "HomePod Mini", quantity: 2, unitPrice: 99.00, image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=100&h=100&fit=crop" },
      { name: "Apple TV 4K", quantity: 1, unitPrice: 179.00, image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=100&h=100&fit=crop" },
    ],
    subtotal: 377.00,
    iva: 60.32,
    ieps: 0,
    shipping: 0,
    total: 437.32,
    shippingAddress: {
      name: "Laura Hernández",
      street: "Calle Hidalgo 987",
      city: "León",
      state: "Guanajuato",
      zip: "37000",
    },
    paymentMethod: {
      type: "Visa",
      last4: "3333",
    },
    trackingNumber: "MX456789123",
  },
};

const getPaymentStatusBadge = (status: OrderDetail["paymentStatus"]) => {
  const config = {
    paid: { label: "Pagado", variant: "success" as const },
    pending: { label: "Pendiente", variant: "warning" as const },
    failed: { label: "Fallido", variant: "destructive" as const },
  };
  return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
};

const getShippingStatusBadge = (status: OrderDetail["shippingStatus"]) => {
  const config = {
    delivered: { label: "Entregado", variant: "success" as const },
    shipped: { label: "En camino", variant: "info" as const },
    processing: { label: "Procesando", variant: "pending" as const },
    pending: { label: "Pendiente", variant: "warning" as const },
  };
  return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
};

const OrderDetail = () => {
  const { orderNumber } = useParams();
  const order = ordersData[orderNumber || ""];

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Orden no encontrada</h1>
          <Link to="/orders">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a órdenes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const [billingAddresses, setBillingAddresses] = useState<BillingAddress[]>(initialBillingAddresses);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

  const handleInvoice = () => {
    // Check if auto invoicing is enabled
    if (AUTO_INVOICING_ENABLED) {
      const defaultAddress = billingAddresses.find(a => a.isDefault);
      if (defaultAddress) {
        toast.success(`Orden ${order.orderNumber} facturada automáticamente a ${defaultAddress.razonSocial}`);
        return;
      }
    }
    // Show dialog for manual invoice
    setInvoiceDialogOpen(true);
  };

  const handleAddBillingAddress = (address: BillingAddress) => {
    setBillingAddresses(prev => [...prev, address]);
  };

  const handleConfirmInvoice = (addressId: string) => {
    const address = billingAddresses.find(a => a.id === addressId);
    if (address) {
      console.log(`Facturando orden ${order.orderNumber} a:`, address);
    }
  };

  const handleSupport = () => {
    toast.info(`Creando ticket de soporte para ${order.orderNumber}`);
  };

  const handleRebuy = () => {
    toast.success("Artículos agregados al carrito");
  };

  const handleSubscribe = () => {
    toast.info("Configurando suscripción recurrente...");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Enlace copiado al portapapeles");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    toast.info("Descargando factura...");
  };

  const handleTrackOrder = () => {
    if (order.trackingNumber) {
      toast.info(`Rastreando envío: ${order.trackingNumber}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/orders">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a órdenes
          </Button>
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-orders flex items-center justify-center">
              <Package className="w-7 h-7 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Orden {order.orderNumber}</h1>
              <p className="text-muted-foreground">
                {new Date(order.date).toLocaleDateString("es-MX", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {getPaymentStatusBadge(order.paymentStatus)}
            {getShippingStatusBadge(order.shippingStatus)}
          </div>
        </div>

        {/* Actions */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-2">
              {order.invoiceStatus === "pending" && order.paymentStatus === "paid" && (
                <Button onClick={handleInvoice} variant="default">
                  <ReceiptText className="w-4 h-4 mr-2" />
                  Facturar
                </Button>
              )}
              {order.invoiceStatus === "invoiced" && (
                <Button onClick={handleDownloadInvoice} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar factura
                </Button>
              )}
              <Button onClick={handleRebuy} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Volver a comprar
              </Button>
              <Button onClick={handleSubscribe} variant="outline">
                <CalendarClock className="w-4 h-4 mr-2" />
                Suscribirse
              </Button>
              {order.trackingNumber && (
                <Button onClick={handleTrackOrder} variant="outline">
                  <Truck className="w-4 h-4 mr-2" />
                  Rastrear envío
                </Button>
              )}
              <Button onClick={handleSupport} variant="outline">
                <Headphones className="w-4 h-4 mr-2" />
                Soporte
              </Button>
              <Button onClick={handleShare} variant="ghost" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button onClick={handlePrint} variant="ghost" size="icon">
                <Printer className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Artículos ({order.items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                      <p className="text-sm text-muted-foreground">
                        Precio unitario: {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Summary & Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA (16%)</span>
                  <span>{formatCurrency(order.iva)}</span>
                </div>
                {order.ieps > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IEPS</span>
                    <span>{formatCurrency(order.ieps)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span>{order.shipping === 0 ? "Gratis" : formatCurrency(order.shipping)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dirección de envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.street}</p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </p>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Método de pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{order.paymentMethod.type}</p>
                <p className="text-sm text-muted-foreground">
                  Terminada en {order.paymentMethod.last4}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <InvoiceDialog
          open={invoiceDialogOpen}
          onOpenChange={setInvoiceDialogOpen}
          orderNumber={order.orderNumber}
          billingAddresses={billingAddresses}
          onAddAddress={handleAddBillingAddress}
          onInvoice={handleConfirmInvoice}
        />
      </div>
    </div>
  );
};

export default OrderDetail;
