import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ShoppingCart, User, Menu, X, Shield, LogOut, LayoutDashboard, Building2, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchCompany {
  id: string;
  companyName: string;
  category: string;
  isVerified: boolean;
}
interface SearchProduct {
  id: string;
  name: string;
  price: string | null;
  companyName?: string;
}
interface SearchResults {
  companies: SearchCompany[];
  products: SearchProduct[];
}

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user, logoutMutation } = useAuth();

  const { data: searchResults, isLoading: searchLoading } = useQuery<SearchResults>({
    queryKey: ["/api/search", searchQuery],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      return res.json();
    },
    enabled: searchQuery.length >= 2,
  });

  // Close search on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasResults =
    searchResults &&
    (searchResults.companies.length > 0 || searchResults.products.length > 0);

  const navLinks = [
    { href: "/catalogo", label: "Catálogo" },
    { href: "/como-funciona", label: "Cómo Funciona" },
    { href: "/empresas", label: "Empresas" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 shrink-0" data-testid="link-home">
            <div className="w-9 h-9 rounded-lg verified-badge flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl lg:text-2xl font-bold text-foreground">
              True<span className="text-primary">Market</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Global Search */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-8" ref={searchRef}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos o empresas..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                className="pl-10 bg-muted/50 border-transparent focus:border-primary focus:bg-background"
                data-testid="input-global-search"
              />

              {/* Search Results Dropdown */}
              {showResults && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-xl border border-border shadow-xl z-50 max-h-96 overflow-y-auto">
                  {searchLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  ) : !hasResults ? (
                    <div className="text-center py-6 px-4">
                      <p className="text-sm text-muted-foreground">No se encontraron resultados</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {/* Companies */}
                      {searchResults.companies.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground px-4 py-2 uppercase tracking-wider">
                            Empresas
                          </p>
                          {searchResults.companies.slice(0, 4).map((c) => (
                            <button
                              key={c.id}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                              onClick={() => {
                                setLocation(`/empresas/${c.id}`);
                                setShowResults(false);
                                setSearchQuery("");
                              }}
                            >
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Building2 className="w-4 h-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{c.companyName}</p>
                                <p className="text-xs text-muted-foreground truncate">{c.category}</p>
                              </div>
                              {c.isVerified && (
                                <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Divider */}
                      {searchResults.companies.length > 0 && searchResults.products.length > 0 && (
                        <div className="border-t border-border my-1" />
                      )}

                      {/* Products */}
                      {searchResults.products.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground px-4 py-2 uppercase tracking-wider">
                            Productos
                          </p>
                          {searchResults.products.slice(0, 5).map((p) => (
                            <button
                              key={p.id}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                              onClick={() => {
                                setLocation(`/producto/${p.id}`);
                                setShowResults(false);
                                setSearchQuery("");
                              }}
                            >
                              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                                {p.companyName && (
                                  <p className="text-xs text-muted-foreground truncate">{p.companyName}</p>
                                )}
                              </div>
                              {p.price && (
                                <span className="text-xs font-medium text-primary shrink-0">
                                  ${Number(p.price).toLocaleString("es-CL")}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex" data-testid="button-cart">
              <ShoppingCart className="w-5 h-5" />
            </Button>

            {/* Auth-aware user section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3"
                    data-testid="button-user-menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-trust flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">
                      {user.role === "seller" ? "Empresa" : "Comprador"}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  {user.role === "seller" && (
                    <Link href="/dashboard">
                      <DropdownMenuItem className="cursor-pointer">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 dark:text-red-400"
                    onClick={() => logoutMutation.mutate()}
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" size="sm" className="hidden sm:flex" data-testid="button-login">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button
                    size="sm"
                    className="bg-gradient-trust hover:opacity-90 transition-opacity"
                    data-testid="button-register"
                  >
                    Registrarse
                  </Button>
                </Link>
              </>
            )}

            {user?.role === "seller" && (
              <Link href="/dashboard">
                <Button className="hidden sm:flex bg-gradient-trust hover:opacity-90 transition-opacity" data-testid="button-dashboard">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar productos o empresas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50"
                  data-testid="input-search-mobile"
                />
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  {user.role === "seller" && (
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    className="w-full text-red-600"
                    onClick={() => {
                      logoutMutation.mutate();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-trust" data-testid="button-auth-mobile">
                    Iniciar Sesión / Registrarse
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}