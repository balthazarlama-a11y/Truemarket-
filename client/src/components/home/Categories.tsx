import { Link } from "wouter";
import { Gem, Smartphone, Watch, Headphones, Camera, Laptop } from "lucide-react";

const categories = [
  { 
    name: "Joyas de Oro", 
    icon: Gem, 
    count: 24, 
    href: "/catalogo?categoria=joyas-oro",
    color: "bg-amber-100 text-amber-700"
  },
  { 
    name: "Relojes", 
    icon: Watch, 
    count: 18, 
    href: "/catalogo?categoria=relojes",
    color: "bg-slate-100 text-slate-700"
  },
  { 
    name: "Smartphones", 
    icon: Smartphone, 
    count: 32, 
    href: "/catalogo?categoria=smartphones",
    color: "bg-blue-100 text-blue-700"
  },
  { 
    name: "Laptops", 
    icon: Laptop, 
    count: 15, 
    href: "/catalogo?categoria=laptops",
    color: "bg-purple-100 text-purple-700"
  },
  { 
    name: "Audífonos", 
    icon: Headphones, 
    count: 21, 
    href: "/catalogo?categoria=audifonos",
    color: "bg-rose-100 text-rose-700"
  },
  { 
    name: "Cámaras", 
    icon: Camera, 
    count: 12, 
    href: "/catalogo?categoria=camaras",
    color: "bg-emerald-100 text-emerald-700"
  },
];

export function Categories() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Categorías Populares
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explora nuestras categorías principales. Todos los productos son verificados 
            físicamente por expertos antes de ser listados.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className="group bg-card rounded-xl p-6 border border-border card-hover text-center animate-fade-up opacity-0"
              style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}
              data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className={`w-14 h-14 mx-auto mb-4 rounded-xl ${category.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <category.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 text-sm lg:text-base">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {category.count} productos
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}