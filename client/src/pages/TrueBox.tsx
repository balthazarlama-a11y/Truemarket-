import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Gift, Sparkles, ArrowRight, Shield, Package, Star, AlertCircle } from "lucide-react";

const trueBoxes = [
  {
    id: 1,
    name: "TrueBox Básico",
    price: 49990,
    originalValue: 80000,
    verified: true,
    description: "Caja sorpresa con productos verificados. Valor mínimo garantizado de $80.000",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
    category: "Mixto",
    items: ["Joyas o Electrónica", "Productos verificados", "Garantía de valor"],
  },
  {
    id: 2,
    name: "TrueBox Premium",
    price: 99990,
    originalValue: 180000,
    verified: true,
    description: "Caja premium con joyas y electrónica de alta calidad. Valor mínimo garantizado de $180.000",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "Mixto",
    items: ["Joyas verificadas", "Electrónica premium", "Garantía de valor superior"],
  },
  {
    id: 3,
    name: "TrueBox Joyas",
    price: 64990,
    originalValue: 120000,
    verified: false,
    description: "Caja especializada en joyas. Productos seleccionados sin verificación física previa.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
    category: "Joyas",
    items: ["Solo joyas", "Oro, plata, gemas", "Selección manual"],
  },
  {
    id: 4,
    name: "TrueBox Electrónica",
    price: 89990,
    originalValue: 170000,
    verified: true,
    description: "Caja especializada en dispositivos electrónicos verificados y en excelente estado.",
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=400&fit=crop",
    category: "Electrónica",
    items: ["Solo electrónica", "Smartphones, tablets, accesorios", "Estado verificado"],
  },
  {
    id: 5,
    name: "TrueBox Mixto",
    price: 54990,
    originalValue: 100000,
    verified: false,
    description: "Caja mixta con joyas y electrónica sin verificación previa. Gran variedad de productos.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    category: "Mixto",
    items: ["Joyas y electrónica", "Variedad garantizada", "Precio especial"],
  },
  {
    id: 6,
    name: "TrueBox Relojes",
    price: 149990,
    originalValue: 250000,
    verified: true,
    description: "Caja especializada en relojes de alta calidad verificados y autenticados.",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=400&fit=crop",
    category: "Relojes",
    items: ["Solo relojes", "Marcas premium", "Autenticidad garantizada"],
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);
}

export default function TrueBox() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">¡Nueva Experiencia!</span>
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                TrueBox Sorpresa
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed mb-8">
                Cajas misteriosas con joyas y electrónica. 
                Encuentra cajas con productos verificados o sin verificar, todas con valor garantizado superior al precio de compra.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5" />
                  <span>Verificados y No Verificados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Valor Garantizado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  <span>En stock</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
              ¿Cómo funciona?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-trust rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Elige tu TrueBox</h3>
                <p className="text-muted-foreground text-sm">
                  Selecciona el tipo de caja que más te guste
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-trust rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Recibe tu sorpresa</h3>
                <p className="text-muted-foreground text-sm">
                  Te enviamos productos verificados de manera aleatoria
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-trust rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Disfruta tu valor</h3>
                <p className="text-muted-foreground text-sm">
                  Obtén productos con valor garantizado superior al precio pagado
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TrueBox Products */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Elige tu TrueBox
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Encuentra cajas con productos verificados y sin verificar. Todas con garantía de valor
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trueBoxes.map((box, index) => (
                <div
                  key={box.id}
                  className="group bg-card rounded-2xl border border-border overflow-hidden card-hover animate-fade-up opacity-0"
                  style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}
                  data-testid={`truebox-${box.id}`}
                >
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                    <img
                      src={box.image}
                      alt={box.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      {box.verified ? (
                        <Badge className="verified-badge flex items-center gap-1.5">
                          <BadgeCheck className="w-3.5 h-3.5 text-white" />
                          <span className="text-xs font-medium text-white">Verificado</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-500/90 hover:bg-orange-500 flex items-center gap-1.5 border border-orange-400/50">
                          <AlertCircle className="w-3.5 h-3.5 text-white" />
                          <span className="text-xs font-medium text-white">No Verificado</span>
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
                        {box.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {box.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {box.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      {box.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">
                          {formatPrice(box.price)}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(box.originalValue)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Valor mínimo garantizado: {formatPrice(box.originalValue)}
                      </p>
                      <Button 
                        className="w-full bg-gradient-trust hover:opacity-90 transition-opacity" 
                        data-testid={`button-comprar-truebox-${box.id}`}
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Comprar TrueBox
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-trust">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
              ¿Listo para tu sorpresa?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Miles de clientes ya han disfrutado de sus TrueBoxes. Únete a la experiencia.
            </p>
            <Link href="/catalogo">
              <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90">
                Ver Catálogo Completo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
