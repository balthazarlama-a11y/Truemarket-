import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Search,
    Building2,
    BadgeCheck,
    MapPin,
    Phone,
    ArrowRight,
    Loader2,
    Store,
} from "lucide-react";
import { useState } from "react";

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
    createdAt: string | null;
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

const typeColors: Record<string, string> = {
    retailer: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    verifier: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    dealer: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    realestate: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    electronics: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    jewelry: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

export default function CompanyDirectory() {
    const [searchQuery, setSearchQuery] = useState("");

    const { data: companies, isLoading } = useQuery<Company[]>({
        queryKey: ["/api/companies"],
    });

    const filteredCompanies = companies?.filter((c) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            c.companyName.toLowerCase().includes(q) ||
            c.category?.toLowerCase().includes(q) ||
            c.companyType?.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-1">
                {/* Hero / Header */}
                <section className="relative overflow-hidden bg-gradient-trust py-16 lg:py-24">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-20 w-64 h-64 rounded-full bg-white/30 blur-3xl" />
                        <div className="absolute bottom-10 right-20 w-80 h-80 rounded-full bg-white/20 blur-3xl" />
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                            <Store className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="font-display text-3xl lg:text-5xl font-bold text-white mb-4">
                            Directorio de Empresas
                        </h1>
                        <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                            Descubre empresas verificadas en TrueMarket. Compra con confianza a vendedores que garantizan la autenticidad de sus productos.
                        </p>

                        {/* Search */}
                        <div className="max-w-lg mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar empresas por nombre, categoría..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 text-base bg-white/95 dark:bg-background/95 backdrop-blur-sm border-transparent shadow-lg"
                                data-testid="input-search-companies"
                            />
                        </div>
                    </div>
                </section>

                {/* Directory Content */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : !filteredCompanies || filteredCompanies.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                                <Building2 className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                {searchQuery ? "No se encontraron empresas" : "Aún no hay empresas registradas"}
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                {searchQuery
                                    ? "Intenta con otros términos de búsqueda"
                                    : "Sé el primero en registrar tu empresa en TrueMarket"}
                            </p>
                            {!searchQuery && (
                                <Link href="/registro-empresa">
                                    <Button className="bg-gradient-trust hover:opacity-90">
                                        <Building2 className="w-4 h-4 mr-2" />
                                        Registrar mi Empresa
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-sm text-muted-foreground">
                                    {filteredCompanies.length} empresa{filteredCompanies.length !== 1 ? "s" : ""} encontrada{filteredCompanies.length !== 1 ? "s" : ""}
                                </p>
                                <Link href="/registro-empresa">
                                    <Button variant="outline" size="sm">
                                        <Building2 className="w-4 h-4 mr-2" />
                                        Registrar Empresa
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCompanies.map((company) => (
                                    <CompanyCard key={company.id} company={company} />
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}

function CompanyCard({ company }: { company: Company }) {
    const initials = company.companyName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <Link href={`/empresas/${company.id}`}>
            <article
                className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
                data-testid={`company-card-${company.id}`}
            >
                {/* Banner area */}
                <div className="h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />

                    {/* Verified badge */}
                    {company.isVerified && (
                        <div className="absolute top-3 right-3">
                            <Badge className="bg-primary/90 text-white text-xs gap-1">
                                <BadgeCheck className="w-3 h-3" />
                                Verificada
                            </Badge>
                        </div>
                    )}

                    {/* Logo */}
                    <div className="absolute -bottom-8 left-5">
                        {company.logoUrl ? (
                            <img
                                src={company.logoUrl}
                                alt={company.companyName}
                                loading="lazy"
                                className="w-16 h-16 rounded-xl border-4 border-card object-cover shadow-md bg-card"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-xl border-4 border-card bg-gradient-trust flex items-center justify-center shadow-md">
                                <span className="text-lg font-bold text-white">{initials}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="pt-12 pb-5 px-5">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {company.companyName}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">
                        <Badge
                            variant="secondary"
                            className={`text-xs ${typeColors[company.companyType] || typeColors.other}`}
                        >
                            {companyTypeLabels[company.companyType] || company.companyType}
                        </Badge>
                    </div>

                    {company.description && (
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                            {company.description}
                        </p>
                    )}

                    <div className="mt-4 space-y-1.5">
                        {company.address && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span className="line-clamp-1">{company.address}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            <span>{company.phone}</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            {company.category?.split(",").slice(0, 2).join(", ")}
                        </span>
                        <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            Ver perfil
                            <ArrowRight className="w-3 h-3" />
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
