import { useState } from "react";
import { Link, Redirect } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  Phone,
  MapPin,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const companyTypes = [
  { value: "retailer", label: "Retailer / Tienda" },
  { value: "verifier", label: "Empresa Verificadora" },
  { value: "dealer", label: "Concesionario / Vendedor de Autos" },
  { value: "realestate", label: "Inmobiliaria" },
  { value: "electronics", label: "Tienda de Electrónica" },
  { value: "jewelry", label: "Joyería" },
  { value: "other", label: "Otra" },
];

const categoriesToSell = [
  { value: "joyas", label: "Joyas" },
  { value: "electronica", label: "Electrónica" },
  { value: "relojes", label: "Relojes" },
  { value: "autos", label: "Autos" },
  { value: "propiedades", label: "Propiedades" },
  { value: "todas", label: "Todas las Categorías" },
];

export default function RegisterCompany() {
  const { user, isSignedIn } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [companyType, setCompanyType] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [wantsVerification, setWantsVerification] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    rut: "",
    phone: "",
    address: "",
    description: "",
  });
  const [formError, setFormError] = useState("");

  const registerMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const res = await apiRequest("POST", "/api/register-company", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "¡Empresa registrada!",
        description: "Tu empresa fue creada exitosamente. Redirigiendo al dashboard...",
      });
      // Small delay then redirect — Clerk will update publicMetadata
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    },
    onError: (err: any) => {
      setFormError(err.message || "Error al registrar la empresa");
    },
  });

  // Redirect if already a business
  if (user?.role === "business") {
    return <Redirect to="/dashboard" />;
  }

  // Must be signed in
  if (!isSignedIn) {
    return <Redirect to="/sign-up" />;
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSubmit = () => {
    setFormError("");
    registerMutation.mutate({
      companyName: formData.companyName,
      rut: formData.rut,
      description: formData.description,
      category: selectedCategories.join(","),
      companyType,
      phone: formData.phone,
      address: formData.address,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-trust mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Únete como Empresa
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Registra tu empresa en TrueMarket. Ya estás autenticado como{" "}
              <strong>{user?.name || user?.email}</strong>.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${step >= s ? "bg-gradient-trust text-white" : "bg-muted text-muted-foreground"
                    }`}
                >
                  {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-0.5 ${step > s ? "bg-gradient-trust" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Información de la Empresa</CardTitle>
                <CardDescription>Datos básicos de tu empresa para comenzar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nombre de la Empresa *</Label>
                  <Input
                    id="company-name"
                    placeholder="Ej: Joyería El Diamante S.A."
                    value={formData.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-type">Tipo de Empresa *</Label>
                  <Select value={companyType} onValueChange={setCompanyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {companyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rut">RUT o ID Empresa *</Label>
                    <Input
                      id="rut"
                      placeholder="XX.XXX.XXX-X"
                      value={formData.rut}
                      onChange={(e) => updateField("rut", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="+56 9 XXXX XXXX"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      placeholder="Dirección completa"
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción de la Empresa</Label>
                  <Textarea
                    id="description"
                    placeholder="Breve descripción de tu empresa y productos"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!companyType || !formData.companyName || !formData.rut || !formData.phone}
                    className="bg-gradient-trust hover:opacity-90"
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Categorías</CardTitle>
                <CardDescription>Selecciona las categorías de productos que venderás</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Categorías de Productos *</Label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {categoriesToSell.map((cat) => (
                      <div
                        key={cat.value}
                        className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleCategory(cat.value)}
                      >
                        <Checkbox
                          id={cat.value}
                          checked={selectedCategories.includes(cat.value)}
                          onCheckedChange={() => toggleCategory(cat.value)}
                        />
                        <label htmlFor={cat.value} className="text-sm font-medium cursor-pointer flex-1">
                          {cat.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        ¿Quieres ser Empresa Verificadora?
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                        Las empresas verificadoras pueden certificar productos de otros vendedores.
                      </p>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="verifier-company"
                          checked={wantsVerification}
                          onCheckedChange={(checked) => setWantsVerification(checked === true)}
                        />
                        <label htmlFor="verifier-company" className="text-sm font-medium text-blue-900 dark:text-blue-100 cursor-pointer">
                          Sí, quiero ser empresa verificadora
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Atrás
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={selectedCategories.length === 0}
                    className="bg-gradient-trust hover:opacity-90"
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Confirmación</CardTitle>
                <CardDescription>Revisa los datos y envía tu solicitud</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      Resumen de Registro
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Empresa:</span>{" "}
                        <span className="font-medium">{formData.companyName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">RUT:</span>{" "}
                        <span className="font-medium">{formData.rut}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cuenta:</span>{" "}
                        <span className="font-medium">{user?.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Teléfono:</span>{" "}
                        <span className="font-medium">{formData.phone}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground">Categorías:</span>{" "}
                        <span className="font-medium">{selectedCategories.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-primary" />
                    Beneficios de ser Empresa Verificada
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Badge de "Empresa Verificada" en tus productos</li>
                    <li>• Prioridad en búsquedas y resultados</li>
                    <li>• Herramientas avanzadas de gestión</li>
                    <li>• Soporte prioritario</li>
                  </ul>
                </div>

                {(formError || registerMutation.isError) && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {formError || "Error al crear la empresa. Intenta de nuevo."}
                    </p>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Atrás
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-trust hover:opacity-90"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    Registrar Empresa
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/sign-in" className="text-primary hover:underline font-medium">
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
