import { Link } from "wouter";
import { ArrowRight, Shield, BadgeCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/luxury_marketplace_hero_image.png";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-premium">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/10" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 animate-fade-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Verificación Física Garantizada</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Compra y Vende con{" "}
              <span className="text-gradient-gold">Confianza</span>{" "}
              Total
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl animate-fade-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              El primer marketplace chileno donde cada joya y dispositivo electrónico 
              es verificado físicamente por expertos antes de la venta. 
              Sin sorpresas, sin fraudes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <Link href="/catalogo">
                <Button size="lg" className="bg-gradient-trust hover:opacity-90 transition-opacity text-base px-8 h-12" data-testid="button-explorar-catalogo">
                  Explorar Catálogo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/vender">
                <Button size="lg" variant="outline" className="text-base px-8 h-12 border-2" data-testid="button-empezar-vender">
                  Empezar a Vender
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-6 animate-fade-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BadgeCheck className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Verificado</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-gold" />
                </div>
                <p className="text-2xl font-bold text-foreground">$0</p>
                <p className="text-xs text-muted-foreground">Fraudes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">48h</p>
                <p className="text-xs text-muted-foreground">Envío</p>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Joyas y electrónica verificada" 
                className="w-full h-auto object-cover"
                data-testid="img-hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-lg p-4 border border-border animate-fade-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full verified-badge flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Verificado por Expertos</p>
                  <p className="text-xs text-muted-foreground">Autenticidad garantizada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}