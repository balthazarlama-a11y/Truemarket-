import { Link } from "wouter";
import { BadgeCheck, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    id: 1,
    name: "Anillo de Oro 18K con Diamante",
    category: "Joyas",
    originalPrice: 890000,
    price: 620000,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
    verified: true,
    condition: "Excelente",
  },
  {
    id: 2,
    name: "iPhone 14 Pro Max 256GB",
    category: "Electrónica",
    originalPrice: 1200000,
    price: 850000,
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=400&fit=crop",
    verified: true,
    condition: "Como Nuevo",
  },
  {
    id: 3,
    name: "Rolex Submariner Date",
    category: "Relojes",
    originalPrice: 12000000,
    price: 9500000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    verified: true,
    condition: "Excelente",
  },
  {
    id: 4,
    name: "MacBook Pro M2 14\"",
    category: "Electrónica",
    originalPrice: 2400000,
    price: 1800000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    verified: true,
    condition: "Muy Bueno",
  },
  {
    id: 5,
    name: "Collar de Plata 925 con Perlas",
    category: "Joyas",
    originalPrice: 320000,
    price: 195000,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    verified: true,
    condition: "Nuevo",
  },
  {
    id: 6,
    name: "Sony WH-1000XM5",
    category: "Electrónica",
    originalPrice: 450000,
    price: 320000,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
    verified: true,
    condition: "Como Nuevo",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);
}

function calculateDiscount(original: number, current: number) {
  return Math.round(((original - current) / original) * 100);
}

export function FeaturedProducts() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Productos Destacados
            </h2>
            <p className="text-muted-foreground">
              Los mejores productos verificados, seleccionados para ti
            </p>
          </div>
          <Link href="/catalogo">
            <Button variant="outline" className="group" data-testid="button-ver-todos">
              Ver Todos
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/producto/${product.id}`}
              className="group bg-card rounded-2xl border border-border overflow-hidden card-hover animate-fade-up opacity-0"
              style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}
              data-testid={`product-card-${product.id}`}
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.verified && (
                    <div className="verified-badge px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <BadgeCheck className="w-3.5 h-3.5 text-white" />
                      <span className="text-xs font-medium text-white">Verificado</span>
                    </div>
                  )}
                  <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-foreground">
                    -{calculateDiscount(product.originalPrice, product.price)}%
                  </Badge>
                </div>
                <button 
                  className="absolute top-3 right-3 w-9 h-9 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
                  onClick={(e) => { e.preventDefault(); }}
                  data-testid={`button-favorite-${product.id}`}
                >
                  <Heart className="w-4 h-4 text-foreground" />
                </button>
              </div>
              
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {product.condition}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}