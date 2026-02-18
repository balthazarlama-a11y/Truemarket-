import { useState } from "react";
import { Link, Redirect } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Shield,
  BadgeCheck,
  FileText,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Lock,
  User,
  Loader2,
} from "lucide-react";

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
  const { user, registerCompanyMutation } = useAuth();
  const [step, setStep] = useState(1);
  const [companyType, setCompanyType] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [wantsVerification, setWantsVerification] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    companyName: "",
    rut: "",
    phone: "",
    email: "",
    address: "",
    name: "",
    password: "",
    confirmPassword: "",
    description: "",
  });
  const [formError, setFormError] = useState("");

  // Redirect if already logged in as seller
  if (user && user.role === "seller") {
    return <Redirect to="/dashboard" />;
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = () => {
    setFormError("");

    if (formData.password !== formData.confirmPassword) {
      setFormError("Las contraseñas no coinciden");
      return;
    }
    if (formData.password.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    registerCompanyMutation.mutate({
      email: formData.email,
      name: formData.name,
      password: formData.password,
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
              Vende en TrueMarket como empresa verificada. Obtén beneficios exclusivos y acceso a herramientas profesionales.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${step >= s
                      ? "bg-gradient-trust text-white"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-0.5 ${step > s ? "bg-gradient-trust" : "bg-muted"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Información de la Empresa</CardTitle>
                <CardDescription>
                  Datos básicos de tu empresa para comenzar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nombre de la Empresa *</Label>
                  <Input
                    id="company-name"
                    placeholder="Ej: Joyería El Diamante S.A."
                    value={formData.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    data-testid="input-company-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-type">Tipo de Empresa *</Label>
                  <Select value={companyType} onValueChange={setCompanyType}>
                    <SelectTrigger data-testid="select-company-type">
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
                      data-testid="input-rut"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      placeholder="+56 9 XXXX XXXX"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      data-testid="input-phone"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea
                    id="address"
                    placeholder="Dirección completa de la empresa"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    data-testid="textarea-address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción de la Empresa</Label>
                  <Textarea
                    id="description"
                    placeholder="Breve descripción de tu empresa y productos"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    data-testid="textarea-description"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!companyType || !formData.companyName || !formData.rut || !formData.phone}
                    className="bg-gradient-trust hover:opacity-90"
                    data-testid="button-next-step-1"
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
                <CardTitle>Categorías y Cuenta</CardTitle>
                <CardDescription>
                  Selecciona categorías y crea tu cuenta de acceso
                </CardDescription>
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
                        <label
                          htmlFor={cat.value}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {cat.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account credentials */}
                <div className="p-4 bg-muted/30 rounded-lg border space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Datos de tu Cuenta
                  </h4>

                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Nombre del Representante *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reg-name"
                        placeholder="Tu nombre completo"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="pl-10"
                        data-testid="input-reg-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email Corporativo *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="contacto@empresa.cl"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="pl-10"
                        data-testid="input-reg-email"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Contraseña *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          value={formData.password}
                          onChange={(e) => updateField("password", e.target.value)}
                          className="pl-10"
                          data-testid="input-reg-password"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-confirm">Confirmar *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="reg-confirm"
                          type="password"
                          placeholder="Repite tu contraseña"
                          value={formData.confirmPassword}
                          onChange={(e) => updateField("confirmPassword", e.target.value)}
                          className="pl-10"
                          data-testid="input-reg-confirm"
                        />
                      </div>
                    </div>
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
                        Las empresas verificadoras pueden certificar productos de otros vendedores y recibir comisiones adicionales.
                      </p>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="verifier-company"
                          checked={wantsVerification}
                          onCheckedChange={(checked) => setWantsVerification(checked === true)}
                        />
                        <label
                          htmlFor="verifier-company"
                          className="text-sm font-medium text-blue-900 dark:text-blue-100 cursor-pointer"
                        >
                          Sí, quiero ser empresa verificadora
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    data-testid="button-back-step-2"
                  >
                    Atrás
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={
                      selectedCategories.length === 0 ||
                      !formData.email ||
                      !formData.name ||
                      !formData.password
                    }
                    className="bg-gradient-trust hover:opacity-90"
                    data-testid="button-next-step-2"
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
                <CardDescription>
                  Revisa los datos y envía tu solicitud
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary */}
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
                        <span className="text-muted-foreground">Email:</span>{" "}
                        <span className="font-medium">{formData.email}</span>
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
                    <li>• Acceso a estadísticas y reportes</li>
                  </ul>
                </div>

                {(formError || registerCompanyMutation.isError) && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {formError ||
                        ((registerCompanyMutation.error as Error)?.message?.includes("409")
                          ? "Este email ya está registrado"
                          : "Error al crear la cuenta. Intenta de nuevo.")}
                    </p>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    data-testid="button-back-step-3"
                  >
                    Atrás
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-trust hover:opacity-90"
                    disabled={registerCompanyMutation.isPending}
                    data-testid="button-submit-company"
                  >
                    {registerCompanyMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    Crear Cuenta de Empresa
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Already have an account? */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth" className="text-primary hover:underline font-medium">
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
