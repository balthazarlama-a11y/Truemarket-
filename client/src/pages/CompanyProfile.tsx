import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    BadgeCheck,
    MapPin,
    Phone,
    MessageCircle,
    ArrowLeft,
    Loader2,
    Building2,
    Package,
    Tag,
    Mail,
    ExternalLink,
} from "lucide-react";

interface Company {
    id: string;
    companyName: string;
    companyType: string;
    category: string;
    description: string | null;
    phone: string;
    address: string | null;
    logoUrl: string | null;
    isVerified: boolean;
    viewCount: number | null;
    createdAt: string | null;
}

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: string | null;
    category: string | null;
    imageUrl: string | null;
    status: string | null;
}

interface CompanyDetailResponse {
    company: Company;
    products: Product[];
}

const companyTypeLabels: Record<string, string> = {
    retailer: "Retailer / Tienda",
    verifier: "Empresa Verificadora",
    dealer: "Concesionario",
    realestate: "Inmobiliaria",
    electronics: "Electrónica",
    jewelry: "Joyería",
    other: "Otra",
};

function formatPrice(price: string | null): string {
    if (!price) return "Consultar";
    const num = Number(price);
    if (isNaN(num)) return price;
    return `$${num.toLocaleString("es-CL")}`;
}

export default function CompanyProfile() {
    const params = useParams<{ id: string }>();
    const [contactOpen, setContactOpen] = useState(false);

    const { data, isLoading, error } = useQuery<CompanyDetailResponse>({
        queryKey: [`/api/companies/${params.id}`],
        enabled: !!params.id,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
                        <Building2 className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Empresa no encontrada</h2>
                    <p className="text-muted-foreground mb-6">La empresa que buscas no existe o fue eliminada.</p>
                    <Link href="/empresas">
                        <Button>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al Directorio
                        </Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const { company, products } = data;
    const initials = company.companyName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const categories = company.category?.split(",").filter(Boolean) || [];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-1">
                {/* Banner */}
                <section className="relative h-48 sm:h-64 lg:h-72 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/30 blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
                    </div>
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                        <Link href="/empresas">
                            <Button variant="secondary" size="sm" className="shadow-md backdrop-blur-sm bg-card/80">
                                <ArrowLeft className="w-4 h-4 mr-1.5" />
                                Directorio
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Company Info */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative -mt-14 sm:-mt-16 mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                            {/* Logo */}
                            {company.logoUrl ? (
                                <img
                                    src={company.logoUrl}
                                    alt={company.companyName}
                                    loading="lazy"
                                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-background object-cover shadow-lg bg-card"
                                />
                            ) : (
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-background bg-gradient-trust flex items-center justify-center shadow-lg">
                                    <span className="text-2xl sm:text-3xl font-bold text-white">{initials}</span>
                                </div>
                            )}

                            {/* Name + Badges + CTA */}
                            <div className="flex-1 pb-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                                        {company.companyName}
                                    </h1>
                                    {company.isVerified && (
                                        <Badge className="bg-primary text-white gap-1">
                                            <BadgeCheck className="w-3.5 h-3.5" />
                                            Verificada
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {companyTypeLabels[company.companyType] || company.companyType}
                                </p>
                            </div>

                            {/* CTA — Contact Button */}
                            <div className="sm:pb-1">
                                <Button
                                    size="lg"
                                    className="bg-gradient-trust hover:opacity-90 shadow-lg w-full sm:w-auto"
                                    onClick={() => setContactOpen(true)}
                                    data-testid="button-contact-company"
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Contactar Empresa
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description */}
                            {company.description && (
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground mb-3">Sobre la Empresa</h2>
                                    <p className="text-muted-foreground leading-relaxed">{company.description}</p>
                                </div>
                            )}

                            {/* Categories */}
                            {categories.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground mb-3">Categorías</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((cat) => (
                                            <Badge key={cat} variant="secondary" className="text-sm capitalize">
                                                <Tag className="w-3 h-3 mr-1" />
                                                {cat.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Products */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                        <Package className="w-5 h-5 text-primary" />
                                        Productos
                                        {products.length > 0 && (
                                            <span className="text-sm font-normal text-muted-foreground">
                                                ({products.length})
                                            </span>
                                        )}
                                    </h2>
                                </div>

                                {products.length === 0 ? (
                                    <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
                                        <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground">
                                            Esta empresa aún no ha publicado productos
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {products.map((product) => (
                                            <Link key={product.id} href={`/producto/${product.id}`}>
                                                <article className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
                                                    {product.imageUrl ? (
                                                        <div className="aspect-[4/3] overflow-hidden bg-muted">
                                                            <img
                                                                src={product.imageUrl}
                                                                alt={product.name}
                                                                loading="lazy"
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                                                            <Package className="w-10 h-10 text-muted-foreground/50" />
                                                        </div>
                                                    )}
                                                    <div className="p-4">
                                                        <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                                            {product.name}
                                                        </h3>
                                                        {product.description && (
                                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                                {product.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center justify-between mt-3">
                                                            <span className="font-semibold text-primary">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                            {product.category && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    {product.category}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </article>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Contact Card */}
                            <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
                                <h3 className="font-semibold text-foreground">Información de Contacto</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                        <span className="text-sm text-foreground">{company.phone}</span>
                                    </div>
                                    {company.address && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                            <span className="text-sm text-foreground">{company.address}</span>
                                        </div>
                                    )}
                                </div>
                                <Button
                                    className="w-full bg-gradient-trust hover:opacity-90 mt-2"
                                    onClick={() => setContactOpen(true)}
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Contactar
                                </Button>
                            </div>

                            {/* CTA */}
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6 text-center">
                                <Building2 className="w-8 h-8 text-primary mx-auto mb-3" />
                                <h3 className="font-semibold text-foreground mb-2">¿Tienes una empresa?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Únete a TrueMarket y vende tus productos con garantía de autenticidad.
                                </p>
                                <Link href="/registro-empresa">
                                    <Button className="w-full bg-gradient-trust hover:opacity-90">
                                        Registrar mi Empresa
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            {/* Contact Modal */}
            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-primary" />
                            Contactar a {company.companyName}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        {company.isVerified && (
                            <div className="flex items-center gap-2 text-sm bg-primary/5 rounded-lg p-3 border border-primary/20">
                                <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                                <span className="text-foreground">Esta empresa está verificada por TrueMarket</span>
                            </div>
                        )}

                        <div className="space-y-3">
                            <a
                                href={`tel:${company.phone}`}
                                className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-foreground text-sm">Teléfono</p>
                                    <p className="text-muted-foreground text-sm">{company.phone}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            </a>

                            {company.address && (
                                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-foreground text-sm">Dirección</p>
                                        <p className="text-muted-foreground text-sm">{company.address}</p>
                                    </div>
                                </div>
                            )}

                            <a
                                href={`https://wa.me/${company.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors group border border-green-200 dark:border-green-900"
                            >
                                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-foreground text-sm">WhatsApp</p>
                                    <p className="text-sm text-green-700 dark:text-green-400">Enviar mensaje directo</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </a>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
