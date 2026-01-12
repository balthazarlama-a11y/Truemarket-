import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  DollarSign,
  Eye,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Settings,
  Store,
  Shield,
} from "lucide-react";

const stats = [
  { label: "Ventas Totales", value: "$2.450.000", change: "+12%", icon: DollarSign },
  { label: "Productos Activos", value: "8", change: "+2", icon: Package },
  { label: "Vistas Este Mes", value: "1.234", change: "+18%", icon: Eye },
  { label: "Tasa de Conversión", value: "4.2%", change: "+0.8%", icon: TrendingUp },
];

const products = [
  { id: 1, name: "Anillo de Oro 18K", price: 620000, status: "active", views: 234, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop" },
  { id: 2, name: "Collar de Plata 925", price: 195000, status: "pending", views: 0, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop" },
  { id: 3, name: "Pulsera de Oro Rosa", price: 350000, status: "active", views: 156, image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=100&h=100&fit=crop" },
  { id: 4, name: "iPhone 13 Pro", price: 680000, status: "sold", views: 412, image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=100&h=100&fit=crop" },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline"; icon: typeof CheckCircle2 }> = {
  active: { label: "Activo", variant: "default", icon: CheckCircle2 },
  pending: { label: "En Verificación", variant: "secondary", icon: Clock },
  sold: { label: "Vendido", variant: "outline", icon: CheckCircle2 },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);
}

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                Panel de Vendedor
              </h1>
              <p className="text-muted-foreground">
                Bienvenido de vuelta, María
              </p>
            </div>
            <Link href="/vender">
              <Button className="bg-gradient-trust" data-testid="button-nuevo-producto">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={stat.label} className="animate-fade-up opacity-0" style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-xs text-primary mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change} vs mes anterior
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview" data-testid="tab-overview">
                <Package className="w-4 h-4 mr-2" />
                Productos
              </TabsTrigger>
              <TabsTrigger value="verification" data-testid="tab-verification-dash">
                <Shield className="w-4 h-4 mr-2" />
                Verificación
              </TabsTrigger>
              <TabsTrigger value="store" data-testid="tab-store">
                <Store className="w-4 h-4 mr-2" />
                Mi Tienda
              </TabsTrigger>
              <TabsTrigger value="settings" data-testid="tab-settings">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Productos</CardTitle>
                  <CardDescription>Gestiona tus productos publicados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product) => {
                      const status = statusConfig[product.status];
                      return (
                        <div
                          key={product.id}
                          className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl"
                          data-testid={`dashboard-product-${product.id}`}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">
                              {product.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye className="w-4 h-4" />
                            {product.views}
                          </div>
                          <Badge variant={status.variant} className="flex items-center gap-1">
                            <status.icon className="w-3 h-3" />
                            {status.label}
                          </Badge>
                          <Button variant="ghost" size="icon" data-testid={`button-more-${product.id}`}>
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification">
              <Card>
                <CardHeader>
                  <CardTitle>Estado de Verificación</CardTitle>
                  <CardDescription>Tu identidad y productos verificados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">Identidad Verificada</h4>
                        <p className="text-sm text-muted-foreground">
                          Tu identidad fue verificada el 10 de Enero, 2026
                        </p>
                      </div>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                        KYC Completo
                      </Badge>
                    </div>

                    <div className="grid gap-4">
                      <h4 className="font-medium text-foreground">Requisitos de Verificación</h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground text-sm">Carnet de Identidad</p>
                            <p className="text-xs text-muted-foreground">Verificado</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground text-sm">Selfie con Documento</p>
                            <p className="text-xs text-muted-foreground">Verificado</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground text-sm">Teléfono</p>
                            <p className="text-xs text-muted-foreground">+56 9 **** 5678</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground text-sm">Email</p>
                            <p className="text-xs text-muted-foreground">m****@gmail.com</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="store">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Tienda</CardTitle>
                  <CardDescription>Personaliza tu perfil de vendedor</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <AlertCircle className="w-6 h-6 text-amber-600" />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">Actualiza a Vendedor Pro</h4>
                        <p className="text-sm text-muted-foreground">
                          Obtén una mini-tienda personalizada y comisiones reducidas
                        </p>
                      </div>
                      <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100" data-testid="button-upgrade-pro">
                        Ver Beneficios
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Nombre de Tienda
                        </label>
                        <Input defaultValue="Joyas María" data-testid="input-store-name" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Descripción
                        </label>
                        <Input defaultValue="Joyas finas de segunda mano verificadas" data-testid="input-store-description" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración</CardTitle>
                  <CardDescription>Ajustes de tu cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Configuración de cuenta próximamente...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}