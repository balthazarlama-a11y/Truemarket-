import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeCheck, Heart, Filter, X, SlidersHorizontal } from "lucide-react";

const products = [
  { id: 1, name: "Anillo de Oro 18K con Diamante", category: "Joyas", originalPrice: 890000, price: 620000, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop", verified: true, condition: "Excelente" },
  { id: 2, name: "iPhone 14 Pro Max 256GB", category: "Electrónica", originalPrice: 1200000, price: 850000, image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=400&fit=crop", verified: true, condition: "Como Nuevo" },
  { id: 3, name: "Rolex Submariner Date", category: "Relojes", originalPrice: 12000000, price: 9500000, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", verified: true, condition: "Excelente" },
  { id: 4, name: "MacBook Pro M2 14\"", category: "Electrónica", originalPrice: 2400000, price: 1800000, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop", verified: true, condition: "Muy Bueno" },
  { id: 5, name: "Collar de Plata 925 con Perlas", category: "Joyas", originalPrice: 320000, price: 195000, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop", verified: true, condition: "Nuevo" },
  { id: 6, name: "Sony WH-1000XM5", category: "Electrónica", originalPrice: 450000, price: 320000, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop", verified: true, condition: "Como Nuevo" },
  { id: 7, name: "Pulsera de Oro Rosa 14K", category: "Joyas", originalPrice: 480000, price: 350000, image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop", verified: true, condition: "Excelente" },
  { id: 8, name: "iPad Pro 12.9\" M2", category: "Electrónica", originalPrice: 1500000, price: 1100000, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop", verified: true, condition: "Como Nuevo" },
  { id: 9, name: "Aros de Diamante 0.5ct", category: "Joyas", originalPrice: 1200000, price: 890000, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop", verified: true, condition: "Nuevo" },
];

const categories = ["Todas", "Joyas", "Electrónica", "Relojes"];
const conditions = ["Nuevo", "Como Nuevo", "Excelente", "Muy Bueno", "Bueno"];

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);
}

function calculateDiscount(original: number, current: number) {
  return Math.round(((original - current) / original) * 100);
}

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [priceRange, setPriceRange] = useState([0, 15000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const filteredProducts = products.filter(p => 
    (selectedCategory === "Todas" || p.category === selectedCategory) &&
    p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtros
                  </h3>
                  <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setShowFilters(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">Categoría</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Button
                          key={cat}
                          variant={selectedCategory === cat ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(cat)}
                          className={selectedCategory === cat ? "bg-gradient-trust" : ""}
                          data-testid={`filter-category-${cat.toLowerCase()}`}
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">Rango de Precio</h4>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={15000000}
                      step={100000}
                      className="mb-2"
                      data-testid="slider-price-range"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">Estado</h4>
                    <div className="space-y-2">
                      {conditions.map((condition) => (
                        <div key={condition} className="flex items-center gap-2">
                          <Checkbox id={condition} data-testid={`filter-condition-${condition.toLowerCase().replace(/\s+/g, '-')}`} />
                          <label htmlFor={condition} className="text-sm text-muted-foreground cursor-pointer">
                            {condition}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="verified-only" defaultChecked data-testid="filter-verified-only" />
                      <label htmlFor="verified-only" className="text-sm text-foreground cursor-pointer flex items-center gap-1.5">
                        <BadgeCheck className="w-4 h-4 text-primary" />
                        Solo Verificados
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                    Catálogo
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {filteredProducts.length} productos verificados
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="lg:hidden"
                    onClick={() => setShowFilters(true)}
                    data-testid="button-show-filters"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48" data-testid="select-sort">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevancia</SelectItem>
                      <SelectItem value="price-low">Menor precio</SelectItem>
                      <SelectItem value="price-high">Mayor precio</SelectItem>
                      <SelectItem value="discount">Mayor descuento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    href={`/producto/${product.id}`}
                    className="group bg-card rounded-2xl border border-border overflow-hidden card-hover animate-fade-up opacity-0"
                    style={{ animationDelay: `${0.05 * index}s`, animationFillMode: 'forwards' }}
                    data-testid={`catalog-product-${product.id}`}
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
                        data-testid={`button-favorite-catalog-${product.id}`}
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}