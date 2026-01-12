import { Heart, Plus, Minus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import AccountNav from "@/components/AccountNav";

interface FavoriteProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  image: string;
}

const DEMO_FAVORITES: FavoriteProduct[] = [
  {
    id: "1",
    name: "Laptop Profesional 15.6\"",
    sku: "LAP-PRO-156",
    price: 24999.00,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Monitor Ultra HD 27\"",
    sku: "MON-UHD-27",
    price: 8499.00,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&h=200&fit=crop",
  },
  {
    id: "3",
    name: "Teclado Mecánico RGB",
    sku: "TEC-MEC-RGB",
    price: 2199.00,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200&h=200&fit=crop",
  },
  {
    id: "4",
    name: "Mouse Inalámbrico Ergonómico",
    sku: "MOU-ERG-001",
    price: 899.00,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop",
  },
  {
    id: "5",
    name: "Audífonos Bluetooth Premium",
    sku: "AUD-BT-PRE",
    price: 3499.00,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
  },
];

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>(DEMO_FAVORITES);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    DEMO_FAVORITES.reduce((acc, product) => ({ ...acc, [product.id]: 1 }), {})
  );

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  };

  const handleAddToCart = (product: FavoriteProduct) => {
    const quantity = quantities[product.id] || 1;
    toast({
      title: "Agregado al carrito",
      description: `${quantity}x ${product.name} agregado al carrito.`,
    });
  };

  const handleRemoveFavorite = (productId: string) => {
    setFavorites(prev => prev.filter(p => p.id !== productId));
    toast({
      title: "Eliminado de favoritos",
      description: "El producto ha sido eliminado de tus favoritos.",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <AccountNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-favorites flex items-center justify-center">
            <Heart className="w-7 h-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Favoritos</h1>
            <p className="text-muted-foreground">Tus productos guardados ({favorites.length})</p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aún no tienes favoritos guardados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    <p className="text-lg font-bold text-primary mt-1">{formatPrice(product.price)}</p>
                  </div>

                  {/* Quantity Controls & Add to Cart */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(product.id, -1)}
                        disabled={quantities[product.id] <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-medium text-foreground">
                        {quantities[product.id] || 1}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(product.id, 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="gap-2 whitespace-nowrap"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Agregar
                    </Button>

                    {/* Remove from Favorites */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveFavorite(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
