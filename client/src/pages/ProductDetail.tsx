import { useState } from "react";
import { Link, useParams } from "wouter";
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
} from "lucide-react";

const product = {
  id: 1,
  name: "Anillo de Oro 18K con Diamante Solitario 0.5ct",
  category: "Joyas",
  subcategory: "Anillos",
  originalPrice: 890000,
  price: 620000,
  images: [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop",
  ],
  verified: true,
  condition: "Excelente",
  verificationReport: {
    verifier: "Emporio Joyas",
    date: "15 de Enero, 2026",
    material: "Oro 18K (750)",
    weight: "4.2g",
    diamond: "0.5ct, Color G, Claridad VS1",
    authenticity: "Certificado",
  },
  description: `Elegante anillo de compromiso con diamante solitario de 0.5 quilates montado en oro de 18 quilates. 
  
El diamante presenta un corte brillante redondo con excelentes proporciones, color G (casi incoloro) y claridad VS1 (muy ligeramente incluido). 

Este anillo fue verificado en nuestro aliado Emporio Joyas, donde se confirmó la autenticidad del oro y las características del diamante. Incluye certificado de autenticidad.`,
  seller: {
    name: "María González",
    rating: 4.9,
    sales: 23,
    verified: true,
  },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);
}

function calculateDiscount(original: number, current: number) {
  return Math.round(((original - current) / original) * 100);
}

export default function ProductDetail() {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors" data-testid="breadcrumb-home">Inicio</Link>
            <span>/</span>
            <Link href="/catalogo" className="hover:text-foreground transition-colors" data-testid="breadcrumb-catalogo">Catálogo</Link>
            <span>/</span>
            <span className="text-foreground">{product.category}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={product.images[currentImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  data-testid="img-product-main"
                />
                
                {product.verified && (
                  <div className="absolute top-4 left-4 verified-badge px-3 py-1.5 rounded-full flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">Verificado por TrueMarket</span>
                  </div>
                )}

                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
                  data-testid="button-prev-image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
                  data-testid="button-next-image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                    data-testid={`button-thumbnail-${index}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{product.category}</Badge>
                  <Badge variant="secondary">{product.condition}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                    data-testid="button-favorite-detail"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" data-testid="button-share">
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
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                  -{calculateDiscount(product.originalPrice, product.price)}% ahorro
                </Badge>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {product.seller.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{product.seller.name}</span>
                      {product.seller.verified && (
                        <BadgeCheck className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.seller.rating}</span>
                      <span>•</span>
                      <span>{product.seller.sales} ventas</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <Button size="lg" className="w-full bg-gradient-trust hover:opacity-90 h-14 text-base" data-testid="button-comprar">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Comprar Ahora
                </Button>
                <Button size="lg" variant="outline" className="w-full h-14 text-base" data-testid="button-contactar">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contactar Vendedor
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Verificado</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Envío Seguro</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <CreditCard className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Pago Protegido</p>
                </div>
              </div>

              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="description" data-testid="tab-description">Descripción</TabsTrigger>
                  <TabsTrigger value="verification" data-testid="tab-verification">Verificación</TabsTrigger>
                  <TabsTrigger value="shipping" data-testid="tab-shipping">Envío</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </TabsContent>
                <TabsContent value="verification">
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground">Reporte de Verificación</span>
                    </div>
                    <dl className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Verificador</dt>
                        <dd className="font-medium text-foreground">{product.verificationReport.verifier}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Fecha</dt>
                        <dd className="font-medium text-foreground">{product.verificationReport.date}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Material</dt>
                        <dd className="font-medium text-foreground">{product.verificationReport.material}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Peso</dt>
                        <dd className="font-medium text-foreground">{product.verificationReport.weight}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-muted-foreground">Diamante</dt>
                        <dd className="font-medium text-foreground">{product.verificationReport.diamond}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-muted-foreground">Autenticidad</dt>
                        <dd className="font-medium text-primary flex items-center gap-1">
                          <BadgeCheck className="w-4 h-4" />
                          {product.verificationReport.authenticity}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </TabsContent>
                <TabsContent value="shipping" className="text-sm text-muted-foreground leading-relaxed">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Envío desde bodega TrueMarket</p>
                        <p>Todos los productos son despachados desde nuestra bodega verificada.</p>
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