import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
import { BadgeCheck, Heart, Filter, X, SlidersHorizontal, AlertTriangle, Building2, Loader2 } from "lucide-react";
import { Product, Company } from "@shared/schema";

const categories = ["Todas", "Joyas", "Electrónica", "Relojes", "Autos", "Propiedades"];
const conditions = ["Nuevo", "Como Nuevo", "Excelente", "Muy Bueno", "Bueno"];

function formatPrice(price: number | string | null) {
  if (!price) return "Consultar";
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(numPrice);
}

function calculateDiscount(original: number, current: number) {
  return Math.round(((original - current) / original) * 100);
}

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [priceRange, setPriceRange] = useState([0, 300000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [filterCompany, setFilterCompany] = useState(true);
  const [filterIndividual, setFilterIndividual] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: productsData, isLoading } = useQuery<(Product & { companyName?: string })[]>({
    queryKey: ['/api/products'],
  });

  const products = productsData || [];

  const filteredProducts = products.filter(p => {
    // Search filter
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    const matchesCategory = selectedCategory === "Todas" || p.category === selectedCategory;

    // Price filter (handle null price)
    const price = p.price ? parseFloat(p.price) : 0;
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

    // Verification filter
    const matchesVerification = !verifiedOnly || p.isVerified;

    // Seller type filter
    const isCompany = !!p.companyId;
    const matchesSellerType =
      (filterCompany && isCompany) ||
      (filterIndividual && !isCompany);

    // At least one seller type must be selected
    if (!filterCompany && !filterIndividual) {
      return false;
    }

    return matchesCategory && matchesPrice && matchesVerification && matchesSellerType;
  });

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
                    <h4 className="text-sm font-medium text-foreground mb-3">Buscar</h4>
                    <Input
                      placeholder="Nombre del producto..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mb-4"
                    />

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
                      max={300000000}
                      step={selectedCategory === "Propiedades" || selectedCategory === "Autos" ? 1000000 : 100000}
                      className="mb-2"
                      data-testid="slider-price-range"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="verified-only"
                        checked={verifiedOnly}
                        onCheckedChange={(checked) => setVerifiedOnly(checked === true)}
                        data-testid="filter-verified-only"
                      />
                      <label htmlFor="verified-only" className="text-sm text-foreground cursor-pointer flex items-center gap-1.5">
                        <BadgeCheck className="w-4 h-4 text-primary" />
                        Solo Verificados
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">Tipo de Vendedor</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="filter-company"
                          checked={filterCompany}
                          onCheckedChange={(checked) => setFilterCompany(checked === true)}
                          data-testid="filter-company"
                        />
                        <label htmlFor="filter-company" className="text-sm text-muted-foreground cursor-pointer flex items-center gap-1.5">
                          <Building2 className="w-4 h-4" />
                          Empresas
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="filter-individual"
                          checked={filterIndividual}
                          onCheckedChange={(checked) => setFilterIndividual(checked === true)}
                          data-testid="filter-individual"
                        />
                        <label htmlFor="filter-individual" className="text-sm text-muted-foreground cursor-pointer">
                          Particulares
                        </label>
                      </div>
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
                    {filteredProducts.length} productos {verifiedOnly ? 'verificados' : 'disponibles'}
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

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-card rounded-2xl border border-border h-[400px] animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => {
                    // Use first image or fallback
                    const image = (product.images && product.images.length > 0)
                      ? product.images[0]
                      : "https://images.unsplash.com/photo-1560393464-5c69a73c5770";

                    return (
                      <Link
                        key={product.id}
                        href={`/producto/${product.id}`}
                        className="group bg-card rounded-2xl border border-border overflow-hidden card-hover animate-fade-up opacity-0"
                        style={{ animationDelay: `${0.05 * index}s`, animationFillMode: 'forwards' }}
                        data-testid={`catalog-product-${product.id}`}
                      >
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          <img
                            src={image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.isVerified ? (
                              <div className="verified-badge px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                <BadgeCheck className="w-3.5 h-3.5 text-white" />
                                <span className="text-xs font-medium text-white">Verificado</span>
                              </div>
                            ) : (
                              <div className="bg-amber-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-white" />
                                <span className="text-xs font-medium text-white">No Verificado</span>
                              </div>
                            )}
                            {product.companyName && (
                              <div className="bg-blue-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-white" />
                                <span className="text-xs font-medium text-white">
                                  Empresa
                                </span>
                              </div>
                            )}
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
                              {product.category || "Varios"}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-foreground">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}