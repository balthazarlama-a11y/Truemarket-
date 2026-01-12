import { Link } from "wouter";
import { Shield, Truck, CreditCard, MessageCircle } from "lucide-react";

const partners = [
  { name: "Starken", type: "Logística" },
  { name: "Chilexpress", type: "Logística" },
  { name: "Emporio Joyas", type: "Verificador" },
  { name: "TechCheck", type: "Verificador" },
  { name: "Webpay", type: "Pagos" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 border-b border-background/10">
          <div className="text-center mb-8">
            <p className="text-sm text-background/60 uppercase tracking-wider mb-4">
              Aliados de Confianza
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {partners.map((partner) => (
              <div key={partner.name} className="text-center" data-testid={`partner-${partner.name.toLowerCase()}`}>
                <div className="w-20 h-12 bg-background/10 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xs font-semibold text-background/80">{partner.name}</span>
                </div>
                <span className="text-xs text-background/40">{partner.type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg verified-badge flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold">TrueMarket</span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              El marketplace verificado para joyas y electrónica. 
              Cada producto es autenticado físicamente antes de la venta.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Comprar</h4>
            <ul className="space-y-2">
              <li><Link href="/catalogo" className="text-sm text-background/60 hover:text-background transition-colors" data-testid="link-footer-catalogo">Catálogo</Link></li>
              <li><Link href="/catalogo?categoria=joyas" className="text-sm text-background/60 hover:text-background transition-colors" data-testid="link-footer-joyas">Joyas</Link></li>
              <li><Link href="/catalogo?categoria=electronica" className="text-sm text-background/60 hover:text-background transition-colors" data-testid="link-footer-electronica">Electrónica</Link></li>
              <li><Link href="/truebox" className="text-sm text-background/60 hover:text-background transition-colors" data-testid="link-footer-truebox">TrueBox Sorpresa</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Vender</h4>
            <ul className="space-y-2">
              <li><Link href="/vender" className="text-sm text-background/60 hover:text-background transition-colors" data-testid="link-footer-vender">Subir Producto</Link></li>
              <li><Link href="/como-funciona" className="text-sm text-background/60 hover:text-background transition-colors" data-testid="link-footer-como-funciona">Cómo Funciona</Link></li>
              <li><Link href="/verificadores" className="text-sm text-background/60 hover:text-background transition-colors" data-testid="link-footer-verificadores">Verificadores</Link></li>
              <li><Link href="/vendedor-pro" className="text-sm text-background/60 hover:text-background transition-colors" data-testid="link-footer-vendedor-pro">Vendedor Pro</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li><Link href="/ayuda" className="text-sm text-background/60 hover:text-background transition-colors" data-testid="link-footer-ayuda">Centro de Ayuda</Link></li>
              <li><Link href="/contacto" className="text-sm text-background/60 hover:text-background transition-colors" data-testid="link-footer-contacto">Contacto</Link></li>
              <li>
                <a href="https://wa.me/56912345678" className="text-sm text-background/60 hover:text-background transition-colors flex items-center gap-2" data-testid="link-footer-whatsapp">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-background/60">
              <Shield className="w-4 h-4" />
              <span className="text-xs">100% Verificado</span>
            </div>
            <div className="flex items-center gap-2 text-background/60">
              <Truck className="w-4 h-4" />
              <span className="text-xs">Envío Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-background/60">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs">Pago Protegido</span>
            </div>
          </div>
          <p className="text-xs text-background/40">
            © 2026 TrueMarket. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}