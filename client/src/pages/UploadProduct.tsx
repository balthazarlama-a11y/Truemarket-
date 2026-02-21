import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Package,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";

const categories = [
  { value: "joyas-oro", label: "Joyas de Oro" },
  { value: "joyas-plata", label: "Joyas de Plata" },
  { value: "relojes", label: "Relojes" },
  { value: "smartphones", label: "Smartphones" },
  { value: "laptops", label: "Laptops" },
  { value: "audifonos", label: "Audífonos" },
  { value: "camaras", label: "Cámaras" },
  { value: "accesorios", label: "Accesorios" },
  { value: "otro", label: "Otro" },
];

export default function UploadProduct() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const isBusiness = user?.role === "business";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const publishMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name,
        description: description || undefined,
        price: price || undefined,
        category: category || undefined,
        images: images.length > 0 ? images : undefined,
      };

      const res = await apiRequest("POST", "/api/products", payload);
      return await res.json();
    },
    onSuccess: () => {
      setSuccess(true);
      toast({
        title: "¡Producto publicado!",
        description: isBusiness
          ? "Tu producto ha sido publicado con verificación."
          : "Tu producto ha sido publicado sin verificación.",
      });
    },
    onError: (err: Error) => {
      let friendlyMessage = "Hubo un problema al publicar el producto. Por favor, intenta de nuevo.";
      try {
        const raw = err.message;
        const jsonStart = raw.indexOf("{");
        if (jsonStart !== -1) {
          const parsed = JSON.parse(raw.slice(jsonStart));
          const msg = parsed.message ?? parsed.error;
          if (msg && typeof msg === "string") friendlyMessage = msg;
        } else if (raw.startsWith("401")) {
          friendlyMessage = "Sesión expirada o no válida. Cierra sesión, vuelve a entrar e intenta de nuevo.";
        } else if (raw.startsWith("500")) {
          friendlyMessage = "Error del servidor. Espera un momento e intenta de nuevo.";
        }
      } catch {
        // keep default friendlyMessage
      }
      toast({
        title: "Error al publicar",
        description: friendlyMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Error", description: "El nombre es requerido", variant: "destructive" });
      return;
    }
    if (!price.trim()) {
      toast({ title: "Error", description: "El precio es requerido", variant: "destructive" });
      return;
    }
    if (!category) {
      toast({ title: "Error", description: "La categoría es requerida", variant: "destructive" });
      return;
    }
    publishMutation.mutate();
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  ¡Producto Publicado!
                </h2>
                <p className="text-muted-foreground">
                  {isBusiness
                    ? "Tu producto ha sido publicado con el sello de verificación ✅"
                    : "Tu producto ha sido publicado. Aparecerá como 'No Verificado' hasta que registres una empresa."}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => { setSuccess(false); setName(""); setDescription(""); setPrice(""); setCategory(""); setImages([]); }}
                  className="bg-gradient-trust"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Publicar Otro Producto
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Volver al Inicio
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Link>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Publicar Producto
            </h1>
            <p className="text-muted-foreground">
              Completa la información para publicar tu producto en TrueMarket
            </p>
          </div>

          {/* Verification status banner */}
          {isBusiness ? (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">Empresa Verificada</p>
                <p className="text-xs text-muted-foreground">
                  Tu producto se publicará con el sello de verificación ✅
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">Producto Sin Verificar</p>
                <p className="text-xs text-muted-foreground">
                  Tu producto se publicará como "No Verificado".{" "}
                  <Link href="/registro-empresa" className="text-primary hover:underline">
                    Registra tu empresa
                  </Link>{" "}
                  para obtener el sello de verificación.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Detalles</CardTitle>
                <CardDescription>Información básica de tu venta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Anillo de Oro 18K con Diamante 0.5ct"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    data-testid="input-product-name"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (CLP)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="620000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      data-testid="input-price"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe el producto, su estado, marca, y cualquier detalle importante..."
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    data-testid="textarea-description"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Imágenes del Producto</CardTitle>
                <CardDescription>Sube fotos claras de tu producto. Máximo 5 imágenes.</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload value={images} onChange={setImages} />
                <p className="text-xs text-muted-foreground mt-2">
                  Tip: Toma fotos con buena iluminación y fondo neutro para vender más rápido.
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="bg-gradient-trust px-8"
                disabled={publishMutation.isPending || !name.trim()}
                data-testid="button-publish"
              >
                {publishMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Publicar Producto
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}