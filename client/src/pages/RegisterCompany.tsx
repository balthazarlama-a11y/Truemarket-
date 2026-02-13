import { useState } from "react";
import { Link } from "wouter";
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
  const [step, setStep] = useState(1);
  const [companyType, setCompanyType] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [wantsVerification, setWantsVerification] = useState(false);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s
                      ? "bg-gradient-trust text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-0.5 ${
                      step > s ? "bg-gradient-trust" : "bg-muted"
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
                      data-testid="input-rut"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      placeholder="+56 9 XXXX XXXX"
                      data-testid="input-phone"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Corporativo *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contacto@empresa.cl"
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Textarea
                    id="address"
                    placeholder="Dirección completa de la empresa"
                    data-testid="textarea-address"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!companyType}
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
                <CardTitle>Categorías y Servicios</CardTitle>
                <CardDescription>
                  Selecciona las categorías en las que venderás
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
                    disabled={selectedCategories.length === 0}
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
                <CardTitle>Documentación y Verificación</CardTitle>
                <CardDescription>
                  Sube los documentos necesarios para verificar tu empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <Label htmlFor="certificate" className="font-medium">
                          Certificado de Constitución / Personalidad Jurídica *
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF máximo 5MB
                        </p>
                        <Input
                          id="certificate"
                          type="file"
                          accept=".pdf"
                          className="mt-2"
                          data-testid="input-certificate"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <Label htmlFor="bank-statement" className="font-medium">
                          Estado de Cuenta Bancario (últimos 3 meses)
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Para verificación de cuenta empresarial
                        </p>
                        <Input
                          id="bank-statement"
                          type="file"
                          accept=".pdf,.jpg,.png"
                          className="mt-2"
                          data-testid="input-bank-statement"
                        />
                      </div>
                    </div>
                  </div>

                  {wantsVerification && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                            Documentación Adicional para Verificadores
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="verifier-license" className="text-sm font-medium">
                                Licencia o Certificado de Verificación *
                              </Label>
                              <Input
                                id="verifier-license"
                                type="file"
                                accept=".pdf"
                                className="mt-2"
                                data-testid="input-verifier-license"
                              />
                            </div>
                            <p className="text-xs text-amber-700 dark:text-amber-300">
                              Documento que acredite tu capacidad para verificar productos
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    data-testid="button-back-step-3"
                  >
                    Atrás
                  </Button>
                  <Button
                    className="bg-gradient-trust hover:opacity-90"
                    data-testid="button-submit-company"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Enviar Solicitud
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
