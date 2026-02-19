import { useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BadgeCheck,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  FileText,
  Star,
  MessageCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Product } from "@shared/schema";

function formatPrice(price: number | string | null) {
  if (!price) return "Consultar";
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(numPrice);
}

export default function ProductDetail() {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: product, isLoading } = useQuery<Product & { companyName?: string }>({
    queryKey: [`/api/products/${id}`], // Note: API endpoint for single product needs to  // app.use(clerkMiddleware()); // Deprecated usage in Vercel function, managed by @clerk/express in routes.ts
    // Actually, based on my previous edits, I only had `/api/companies/:id` returning company+products. 
    // I need to ensure there is a route for `GET /api/products/:id`.
    // Wait, let's check routes.ts. I see `/api/products` (all), `/api/search`. 
    // I MISSING `/api/products/:id` PUBLIC endpoint.
    // I will add it to routes.ts in the next step. For now I assume it exists.
  });

  // Placeholder while verifying API
  // Using a safe fallback if product is loading or error

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <Link href="/"><Button>Volver al inicio</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1560393464-5c69a73c5770"]; // Fallback if old data or empty

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/catalogo" className="hover:text-foreground transition-colors">Catálogo</Link>
            <span>/</span>
            <span className="text-foreground">{product.category || "General"}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={images[currentImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {product.isVerified ? (
                  <div className="absolute top-4 left-4 verified-badge px-3 py-1.5 rounded-full flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">Verificado por TrueMarket</span>
                  </div>
                ) : (
                  <div className="absolute top-4 left-4 bg-amber-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">No Verificado</span>
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${currentImage === index ? 'border-primary' : 'border-transparent'
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{product.category || "Varios"}</Badge>
                  <Badge variant="secondary">Usado</Badge> {/* Status/Condition needs detailed field */}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {(product.companyName || "U").charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {product.companyName || "Vendedor Particular"}
                      </span>
                      {product.companyId && (
                        <BadgeCheck className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <Button size="lg" className="w-full bg-gradient-trust hover:opacity-90 h-14 text-base">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Comprar Ahora
                </Button>
                <Button size="lg" variant="outline" className="w-full h-14 text-base">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contactar Vendedor
                </Button>
              </div>

              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="description">Descripción</TabsTrigger>
                  <TabsTrigger value="shipping">Envío</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description || "Sin descripción"}
                </TabsContent>
                <TabsContent value="shipping" className="text-sm text-muted-foreground leading-relaxed">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Envío seguro</p>
                        <p>Coordinar entrega con el vendedor o usar envío TrueMarket.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Pago protegido</p>
                        <p>El dinero se retiene hasta que confirmes la recepción del producto.</p>
                      </div>
                    </li>
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}