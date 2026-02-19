import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Eye,
  TrendingUp,
  Plus,
  CheckCircle2,
  Pencil,
  Trash2,
  Shield,
  Store,
  Loader2,
  BadgeCheck,
  ImageIcon,
} from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

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
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  category: string | null;
  images: string[] | null;
  status: string | null;
  createdAt: string | null;
}

function formatPrice(price: string | null): string {
  if (!price) return "Sin precio";
  const num = Number(price);
  if (isNaN(num)) return price;
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(num);
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("products");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [] as string[],
  });

  const { data: company, isLoading: companyLoading } = useQuery<Company>({
    queryKey: ["/api/my/company"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/my/products"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await apiRequest("POST", "/api/my/products", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my/products"] });
      setShowProductModal(false);
      resetForm();
      toast({ title: "Producto creado", description: "Tu producto fue publicado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo crear el producto", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof form }) => {
      const res = await apiRequest("PUT", `/api/my/products/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my/products"] });
      setShowProductModal(false);
      setEditingProduct(null);
      resetForm();
      toast({ title: "Producto actualizado" });
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo actualizar", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/my/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my/products"] });
      setDeleteConfirm(null);
      toast({ title: "Producto eliminado" });
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo eliminar", variant: "destructive" });
    },
  });

  function resetForm() {
    setForm({ name: "", description: "", price: "", category: "", images: [] });
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      images: product.images || [],
    });
    setShowProductModal(true);
  }

  function openNew() {
    setEditingProduct(null);
    resetForm();
    setShowProductModal(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  }

  const isLoading = companyLoading || productsLoading;
  const activeProducts = products?.filter((p) => p.status === "active") || [];
  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                Panel de Empresa
              </h1>
              <p className="text-muted-foreground">
                Bienvenido, {user?.name}
                {company?.isVerified && (
                  <BadgeCheck className="w-4 h-4 text-primary inline ml-1.5 -mt-0.5" />
                )}
              </p>
            </div>
            <Button className="bg-gradient-trust hover:opacity-90" onClick={openNew} data-testid="button-nuevo-producto">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Card className="animate-fade-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Productos Activos</p>
                        <p className="text-2xl font-bold text-foreground">{activeProducts.length}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="animate-fade-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Vistas del Perfil</p>
                        <p className="text-2xl font-bold text-foreground">{company?.viewCount || 0}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <p className="text-xs text-primary mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Total acumulado
                    </p>
                  </CardContent>
                </Card>
                <Card className="animate-fade-up opacity-0" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Estado</p>
                        <p className="text-2xl font-bold text-foreground">
                          {company?.isVerified ? "Verificada" : "Pendiente"}
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${company?.isVerified ? "bg-primary/10" : "bg-amber-100"}`}>
                        <Shield className={`w-6 h-6 ${company?.isVerified ? "text-primary" : "text-amber-600"}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                  <TabsTrigger value="products" data-testid="tab-products">
                    <Package className="w-4 h-4 mr-2" />
                    Productos
                  </TabsTrigger>
                  <TabsTrigger value="store" data-testid="tab-store">
                    <Store className="w-4 h-4 mr-2" />
                    Mi Tienda
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="products">
                  <Card>
                    <CardHeader>
                      <CardTitle>Mis Productos</CardTitle>
                      <CardDescription>
                        Gestiona los productos de tu empresa · {products?.length || 0} total
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!products || products.length === 0 ? (
                        <div className="text-center py-12">
                          <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground mb-4">Aún no tienes productos</p>
                          <Button onClick={openNew} className="bg-gradient-trust hover:opacity-90">
                            <Plus className="w-4 h-4 mr-2" />
                            Subir mi primer producto
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {products.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted/80 transition-colors"
                              data-testid={`dashboard-product-${product.id}`}
                            >
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  loading="lazy"
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-foreground truncate">{product.name}</h4>
                                <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                              </div>
                              <Badge
                                variant={product.status === "active" ? "default" : "secondary"}
                                className="hidden sm:flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                {product.status === "active" ? "Activo" : product.status}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEdit(product)}
                                  data-testid={`button-edit-${product.id}`}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => setDeleteConfirm(product)}
                                  data-testid={`button-delete-${product.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="store">
                  <Card>
                    <CardHeader>
                      <CardTitle>Información de Tienda</CardTitle>
                      <CardDescription>Datos de tu empresa registrada</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {company && (
                        <div className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground block mb-1">Nombre</label>
                              <p className="text-foreground font-medium">{company.companyName}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground block mb-1">Tipo</label>
                              <p className="text-foreground capitalize">{company.companyType}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground block mb-1">Categoría</label>
                              <p className="text-foreground">{company.category}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground block mb-1">Teléfono</label>
                              <p className="text-foreground">{company.phone}</p>
                            </div>
                          </div>
                          {company.description && (
                            <div>
                              <label className="text-sm font-medium text-muted-foreground block mb-1">Descripción</label>
                              <p className="text-foreground">{company.description}</p>
                            </div>
                          )}
                          {company.address && (
                            <div>
                              <label className="text-sm font-medium text-muted-foreground block mb-1">Dirección</label>
                              <p className="text-foreground">{company.address}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      <Footer />

      {/* Create/Edit Product Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Modifica los datos de tu producto" : "Agrega un nuevo producto a tu catálogo"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Nombre *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Anillo de Oro 18K"
                required
                data-testid="input-product-name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Descripción</label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Breve descripción del producto"
                data-testid="input-product-description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Precio (CLP)</label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Ej: 150000"
                  data-testid="input-product-price"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Categoría</label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Ej: Joyería"
                  data-testid="input-product-category"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Imágenes</label>
              {/* Image Upload Component replaces the Input */}
              <ImageUpload
                value={form.images}
                onChange={(newImages) => setForm({ ...form, images: newImages })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowProductModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isMutating || !form.name} className="bg-gradient-trust hover:opacity-90">
                {isMutating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingProduct ? "Guardar Cambios" : "Publicar Producto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar producto?</DialogTitle>
            <DialogDescription>
              Estás a punto de eliminar "{deleteConfirm?.name}". Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}