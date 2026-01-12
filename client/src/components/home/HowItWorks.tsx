import { Upload, Search, Shield, Truck, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Publicación",
    description: "El vendedor sube su producto con fotos y detalles. Completa verificación de identidad (KYC).",
    color: "bg-blue-500",
  },
  {
    icon: Search,
    title: "Verificación",
    description: "El producto es enviado a una tienda verificadora aliada (joyería o técnico) para inspección física.",
    color: "bg-amber-500",
  },
  {
    icon: Shield,
    title: "Certificación",
    description: "Nuestros expertos validan autenticidad, estado y materiales. El producto recibe el sello TrueMarket.",
    color: "bg-emerald-500",
  },
  {
    icon: Truck,
    title: "Despacho Seguro",
    description: "El comprador paga con protección. El producto se envía desde nuestra bodega verificada.",
    color: "bg-purple-500",
  },
  {
    icon: CheckCircle2,
    title: "Satisfacción",
    description: "El dinero se libera al vendedor solo cuando el comprador confirma la recepción.",
    color: "bg-primary",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            Proceso Transparente
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Cómo Funciona TrueMarket
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Un proceso diseñado para eliminar el fraude y garantizar transacciones seguras 
            tanto para compradores como vendedores.
          </p>
        </div>
        
        <div className="relative">
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-border" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.title} 
                className="relative text-center animate-fade-up opacity-0"
                style={{ animationDelay: `${0.15 * index}s`, animationFillMode: 'forwards' }}
              >
                <div className="relative z-10 mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${step.color} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-card rounded-full border-2 border-border flex items-center justify-center text-sm font-bold text-foreground">
                    {index + 1}
                  </div>
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
        </div>
      </div>
    </section>
  );
}