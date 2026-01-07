import { BarChart3, ArrowLeft, TrendingUp, Package, Clock, AlertCircle, ShoppingCart, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Demo data - Monthly spending by product category (stacked)
const monthlySpendingData = [
  { month: "Ago", limpieza: 2400, oficina: 1800, alimentos: 1200, tecnologia: 800 },
  { month: "Sep", limpieza: 2100, oficina: 2200, alimentos: 1400, tecnologia: 600 },
  { month: "Oct", limpieza: 2800, oficina: 1600, alimentos: 1100, tecnologia: 1200 },
  { month: "Nov", limpieza: 2200, oficina: 2400, alimentos: 1600, tecnologia: 900 },
  { month: "Dic", limpieza: 3100, oficina: 2000, alimentos: 1800, tecnologia: 1400 },
  { month: "Ene", limpieza: 2600, oficina: 2100, alimentos: 1300, tecnologia: 1100 },
];

const chartConfig = {
  limpieza: {
    label: "Limpieza",
    color: "hsl(221 83% 53%)",
  },
  oficina: {
    label: "Oficina",
    color: "hsl(262 83% 58%)",
  },
  alimentos: {
    label: "Alimentos",
    color: "hsl(142 71% 45%)",
  },
  tecnologia: {
    label: "Tecnología",
    color: "hsl(31 97% 50%)",
  },
} satisfies ChartConfig;

// Demo purchase history
const purchaseHistory = [
  { id: 1, date: "2025-01-05", product: "Papel Higiénico 24 rollos", quantity: 2, total: 580, category: "limpieza" },
  { id: 2, date: "2025-01-03", product: "Café Molido 1kg", quantity: 3, total: 450, category: "alimentos" },
  { id: 3, date: "2024-12-28", product: "Cartuchos de Tinta HP", quantity: 4, total: 1200, category: "oficina" },
  { id: 4, date: "2024-12-20", product: "Desinfectante Multiusos 5L", quantity: 2, total: 380, category: "limpieza" },
  { id: 5, date: "2024-12-15", product: "Hojas Blancas Paquete 500", quantity: 5, total: 425, category: "oficina" },
];

// Demo restock recommendations
const restockRecommendations = [
  { 
    id: 1, 
    product: "Papel Higiénico 24 rollos", 
    avgDaysBetweenPurchases: 15, 
    lastPurchase: "2025-01-05", 
    recommendedDate: "2025-01-20",
    urgency: "normal",
    purchaseCount: 8,
  },
  { 
    id: 2, 
    product: "Café Molido 1kg", 
    avgDaysBetweenPurchases: 21, 
    lastPurchase: "2025-01-03", 
    recommendedDate: "2025-01-24",
    urgency: "normal",
    purchaseCount: 6,
  },
  { 
    id: 3, 
    product: "Cartuchos de Tinta HP", 
    avgDaysBetweenPurchases: 45, 
    lastPurchase: "2024-12-28", 
    recommendedDate: "2025-02-11",
    urgency: "low",
    purchaseCount: 4,
  },
  { 
    id: 4, 
    product: "Desinfectante Multiusos 5L", 
    avgDaysBetweenPurchases: 30, 
    lastPurchase: "2024-12-20", 
    recommendedDate: "2025-01-19",
    urgency: "soon",
    purchaseCount: 5,
  },
  { 
    id: 5, 
    product: "Hojas Blancas Paquete 500", 
    avgDaysBetweenPurchases: 25, 
    lastPurchase: "2024-12-15", 
    recommendedDate: "2025-01-09",
    urgency: "urgent",
    purchaseCount: 3,
  },
];

// Calculate data reliability based on order count
const totalOrders = 12; // Demo value
const calculateReliability = (orderCount: number): { percentage: number; label: string; description: string } => {
  if (orderCount < 3) {
    return { 
      percentage: 15, 
      label: "Muy baja", 
      description: "Se necesitan más órdenes para generar predicciones confiables" 
    };
  } else if (orderCount < 6) {
    return { 
      percentage: 35, 
      label: "Baja", 
      description: "Las predicciones están mejorando, pero aún son preliminares" 
    };
  } else if (orderCount < 12) {
    return { 
      percentage: 60, 
      label: "Moderada", 
      description: "Los datos comienzan a mostrar patrones más claros" 
    };
  } else if (orderCount < 24) {
    return { 
      percentage: 80, 
      label: "Alta", 
      description: "Las predicciones son bastante confiables basadas en tu historial" 
    };
  } else {
    return { 
      percentage: 95, 
      label: "Muy alta", 
      description: "Excelente historial de compras para predicciones precisas" 
    };
  }
};

const reliability = calculateReliability(totalOrders);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getUrgencyBadge = (urgency: string) => {
  switch (urgency) {
    case "urgent":
      return <Badge variant="destructive">Urgente</Badge>;
    case "soon":
      return <Badge className="bg-orange-500 hover:bg-orange-600">Pronto</Badge>;
    case "normal":
      return <Badge variant="secondary">Normal</Badge>;
    default:
      return <Badge variant="outline">Bajo</Badge>;
  }
};

const Analytics = () => {
  const totalSpentThisMonth = monthlySpendingData[monthlySpendingData.length - 1];
  const currentMonthTotal = totalSpentThisMonth.limpieza + totalSpentThisMonth.oficina + totalSpentThisMonth.alimentos + totalSpentThisMonth.tecnologia;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-analytics flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Estadísticas y actividad de tu cuenta</p>
          </div>
        </div>

        {/* Data Reliability Indicator */}
        <Card className="mb-8 border-2 border-dashed">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg">Confiabilidad de los datos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{reliability.label}</span>
                  <span className="text-sm text-muted-foreground">{reliability.percentage}%</span>
                </div>
                <Progress value={reliability.percentage} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">{reliability.description}</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                  <p className="text-xs text-muted-foreground">órdenes totales</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Entre más órdenes realices, más precisas serán las recomendaciones de reabastecimiento.
            </p>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gasto este mes</p>
                  <p className="text-2xl font-bold">{formatPrice(currentMonthTotal)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Productos comprados</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Productos a reabastecer</p>
                  <p className="text-2xl font-bold">{restockRecommendations.filter(r => r.urgency === "urgent" || r.urgency === "soon").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Spending Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Gasto mensual por tipo de producto
            </CardTitle>
            <CardDescription>Desglose de gastos por categoría en los últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <BarChart data={monthlySpendingData} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value, name) => (
                        <span className="flex items-center gap-2">
                          <span>{chartConfig[name as keyof typeof chartConfig]?.label}</span>
                          <span className="font-bold">{formatPrice(value as number)}</span>
                        </span>
                      )}
                    />
                  } 
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="limpieza" stackId="a" fill="var(--color-limpieza)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="oficina" stackId="a" fill="var(--color-oficina)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="alimentos" stackId="a" fill="var(--color-alimentos)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="tecnologia" stackId="a" fill="var(--color-tecnologia)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Purchase History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Historial de compras recientes
              </CardTitle>
              <CardDescription>Últimas compras realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseHistory.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{purchase.product}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(purchase.date)} • Cantidad: {purchase.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-sm ml-4">{formatPrice(purchase.total)}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Ver historial completo
              </Button>
            </CardContent>
          </Card>

          {/* Restock Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Recomendaciones de reabastecimiento
              </CardTitle>
              <CardDescription>Basado en tu frecuencia de compra</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {restockRecommendations.map((item) => (
                  <div key={item.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-medium text-sm">{item.product}</p>
                      {getUrgencyBadge(item.urgency)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="block">Frecuencia promedio:</span>
                        <span className="font-medium text-foreground">cada {item.avgDaysBetweenPurchases} días</span>
                      </div>
                      <div>
                        <span className="block">Próxima compra sugerida:</span>
                        <span className="font-medium text-foreground">{formatDate(item.recommendedDate)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      Basado en {item.purchaseCount} compras anteriores
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
