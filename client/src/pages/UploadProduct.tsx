import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Camera,
  X,
  Info,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Package,
  Truck,
} from "lucide-react";

const categories = [
  { value: "joyas-oro", label: "Joyas de Oro" },
  { value: "joyas-plata", label: "Joyas de Plata" },
  { value: "relojes", label: "Relojes" },
  { value: "smartphones", label: "Smartphones" },
  { value: "laptops", label: "Laptops" },
  { value: "audifonos", label: "Audífonos" },
  { value: "camaras", label: "Cámaras" },
];

const conditions = [
  { value: "nuevo", label: "Nuevo", description: "Sin usar, con etiquetas o empaque original" },
  { value: "como-nuevo", label: "Como Nuevo", description: "Usado pocas veces, sin signos visibles de uso" },
  { value: "excelente", label: "Excelente", description: "Mínimos signos de uso, funciona perfectamente" },
  { value: "muy-bueno", label: "Muy Bueno", description: "Algunos signos de uso, funciona perfectamente" },
  { value: "bueno", label: "Bueno", description: "Signos de uso visibles, funciona correctamente" },
];

const verificationOptions = [
  { 
    value: "bodega", 
    label: "Enviar a Bodega TrueMarket", 
    description: "Envía tu producto a nuestra bodega y nosotros nos encargamos de la verificación y despacho.",
    icon: Package,
  },
  { 
    value: "tienda", 
    label: "Verificar en Tienda Aliada", 
    description: "Lleva tu producto a una de nuestras tiendas verificadoras aliadas cerca de ti.",
    icon: Truck,
  },
];

export default function UploadProduct() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("");

  const handleImageUpload = () => {
    const demoImages = [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop",
    ];
    setImages([...images, demoImages[images.length % 2]]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const totalSteps = 4;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Volver al Panel
            </Link>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Subir Producto
            </h1>
            <p className="text-muted-foreground">
              Completa la información para publicar tu producto
            </p>
          </div>

          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    s <= step
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                    s < step ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Fotos del Producto</CardTitle>
                <CardDescription>
                  Sube fotos claras y de alta calidad. Mínimo 3 fotos recomendadas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-card rounded-full flex items-center justify-center shadow-md hover:bg-destructive hover:text-white transition-colors"
                        data-testid={`button-remove-image-${index}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleImageUpload}
                    className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    data-testid="button-add-image"
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-xs">Agregar</span>
                  </button>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Consejos para mejores fotos:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Usa buena iluminación natural</li>
                      <li>Muestra todos los ángulos del producto</li>
                      <li>Incluye fotos de detalles y posibles defectos</li>
                      <li>Para joyas: incluye foto con escala (moneda o regla)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Información del Producto</CardTitle>
                <CardDescription>
                  Describe tu producto con el mayor detalle posible
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Producto</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Anillo de Oro 18K con Diamante 0.5ct"
                    data-testid="input-product-title"
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
                    <Label htmlFor="brand">Marca (opcional)</Label>
                    <Input id="brand" placeholder="Ej: Tiffany, Apple, Rolex" data-testid="input-brand" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Estado del Producto</Label>
                  <RadioGroup value={condition} onValueChange={setCondition} className="grid gap-3">
                    {conditions.map((cond) => (
                      <label
                        key={cond.value}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                          condition === cond.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        data-testid={`radio-condition-${cond.value}`}
                      >
                        <RadioGroupItem value={cond.value} />
                        <div>
                          <p className="font-medium text-foreground">{cond.label}</p>
                          <p className="text-sm text-muted-foreground">{cond.description}</p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe el producto, su historia, cualquier defecto o característica especial..."
                    rows={5}
                    data-testid="textarea-description"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (CLP)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="620000"
                      data-testid="input-price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="original-price">Precio Original (opcional)</Label>
                    <Input
                      id="original-price"
                      type="number"
                      placeholder="890000"
                      data-testid="input-original-price"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Método de Verificación</CardTitle>
                <CardDescription>
                  Elige cómo quieres que verifiquemos tu producto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={verificationMethod} onValueChange={setVerificationMethod} className="grid gap-4">
                  {verificationOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-4 p-6 rounded-xl border cursor-pointer transition-colors ${
                        verificationMethod === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      data-testid={`radio-verification-${option.value}`}
                    >
                      <RadioGroupItem value={option.value} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <option.icon className="w-5 h-5 text-primary" />
                          </div>
                          <p className="font-semibold text-foreground">{option.label}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>

                {verificationMethod === 'tienda' && (
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="font-medium text-foreground mb-3">Tiendas Verificadoras Disponibles:</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                        <div>
                          <p className="font-medium text-foreground text-sm">Emporio Joyas</p>
                          <p className="text-xs text-muted-foreground">Providencia, Santiago</p>
                        </div>
                        <Button variant="outline" size="sm" data-testid="button-select-store-1">
                          Seleccionar
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                        <div>
                          <p className="font-medium text-foreground text-sm">TechCheck Center</p>
                          <p className="text-xs text-muted-foreground">Las Condes, Santiago</p>
                        </div>
                        <Button variant="outline" size="sm" data-testid="button-select-store-2">
                          Seleccionar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Confirmar Publicación</CardTitle>
                <CardDescription>
                  Revisa los detalles antes de publicar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/20 text-center">
                  <CheckCircle2 className="w-16 h-16 mx-auto text-primary mb-4" />
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    ¡Listo para Publicar!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Tu producto será enviado a verificación y publicado una vez aprobado.
                  </p>
                  <div className="text-sm text-muted-foreground">
                    Tiempo estimado de verificación: <span className="font-medium text-foreground">24-48 horas</span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  <h4 className="font-medium text-foreground">Próximos Pasos:</h4>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                      {verificationMethod === 'bodega' 
                        ? 'Recibirás instrucciones de envío por email'
                        : 'Agenda una cita en la tienda verificadora'}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                      Nuestro equipo verificará la autenticidad y estado
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                      Tu producto será publicado con el sello TrueMarket
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              data-testid="button-prev-step"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                className="bg-gradient-trust"
                data-testid="button-next-step"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button className="bg-gradient-trust" data-testid="button-publish">
                Publicar Producto
                <CheckCircle2 className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}