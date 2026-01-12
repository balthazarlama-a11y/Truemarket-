import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Search,
  Shield,
  Truck,
  CheckCircle2,
  CreditCard,
  MessageCircle,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

const buyerSteps = [
  {
    icon: Search,
    title: "Explora el Catálogo",
    description: "Navega por productos verificados con fotos reales, reportes de autenticidad y precios transparentes.",
  },
  {
    icon: BadgeCheck,
    title: "Confía en la Verificación",
    description: "Cada producto tiene un sello de verificación que confirma su autenticidad y estado real.",
  },
  {
    icon: CreditCard,
    title: "Paga con Seguridad",
    description: "Tu pago queda protegido. El dinero se retiene hasta que confirmes la recepción del producto.",
  },
  {
    icon: Truck,
    title: "Recibe tu Producto",
    description: "El producto es enviado desde nuestra bodega verificada con seguimiento en tiempo real.",
  },
];

const sellerSteps = [
  {
    icon: Upload,
    title: "Sube tu Producto",
    description: "Completa el formulario con fotos y detalles. Verifica tu identidad (solo la primera vez).",
  },
  {
    icon: Shield,
    title: "Verificación Física",
    description: "Envía tu producto a nuestra bodega o llévalo a una tienda verificadora aliada.",
  },
  {
    icon: BadgeCheck,
    title: "Certificación TrueMarket",
    description: "Expertos validan autenticidad y estado. Tu producto recibe el sello de verificación.",
  },
  {
    icon: CheckCircle2,
    title: "Venta y Cobro",
    description: "Una vez vendido y entregado, recibes tu dinero directamente en tu cuenta.",
  },
];

const faqs = [
  {
    question: "¿Cuánto cuesta publicar un producto?",
    answer: "Publicar es gratis. Solo cobramos una comisión del 8% sobre el precio de venta cuando tu producto se vende exitosamente.",
  },
  {
    question: "¿Qué pasa si el comprador no está satisfecho?",
    answer: "El comprador tiene 48 horas para reportar cualquier problema. Si el producto no coincide con la descripción, procesamos un reembolso completo.",
  },
  {
    question: "¿Cómo funciona la verificación de joyas?",
    answer: "Nuestros aliados joyeros verifican el material (oro, plata, platino), peso, quilataje y autenticidad de las piedras preciosas con equipos profesionales.",
  },
  {
    question: "¿Qué pasa si mi producto no pasa la verificación?",
    answer: "Si detectamos que el producto no es auténtico o no coincide con tu descripción, lo devolvemos sin costo y no se publica.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 lg:py-24 bg-gradient-premium">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              100% Transparente
            </span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Cómo Funciona TrueMarket
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un proceso diseñado para eliminar el fraude y garantizar transacciones seguras 
              tanto para compradores como vendedores.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Para Compradores
              </h2>
              <p className="text-muted-foreground">
                Compra con total confianza, sabiendo que cada producto ha sido verificado
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {buyerSteps.map((step, index) => (
                <div 
                  key={step.title}
                  className="relative text-center animate-fade-up opacity-0"
                  style={{ animationDelay: `${0.15 * index}s`, animationFillMode: 'forwards' }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/catalogo">
                <Button size="lg" className="bg-gradient-trust" data-testid="button-explorar-now">
                  Explorar Catálogo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Para Vendedores
              </h2>
              <p className="text-muted-foreground">
                Vende tus productos con el respaldo de nuestra verificación
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sellerSteps.map((step, index) => (
                <div 
                  key={step.title}
                  className="relative text-center animate-fade-up opacity-0"
                  style={{ animationDelay: `${0.15 * index}s`, animationFillMode: 'forwards' }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gold/10 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-gold" />
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/vender">
                <Button size="lg" variant="outline" className="border-2" data-testid="button-empezar-vender-how">
                  Empezar a Vender
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Preguntas Frecuentes
              </h2>
            </div>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-card rounded-xl p-6 border border-border animate-fade-up opacity-0"
                  style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}
                >
                  <h3 className="font-semibold text-foreground mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">¿Tienes más preguntas?</p>
              <a href="https://wa.me/56912345678">
                <Button variant="outline" data-testid="button-whatsapp-contact">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contáctanos por WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}