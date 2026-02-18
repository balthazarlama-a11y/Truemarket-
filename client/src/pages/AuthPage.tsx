import { useState } from "react";
import { Link, Redirect } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Mail, Lock, User, ArrowRight, Building2, Loader2 } from "lucide-react";

export default function AuthPage() {
    const { user, isLoading, loginMutation, registerMutation } = useAuth();

    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [registerError, setRegisterError] = useState("");

    // Redirect if already logged in
    if (user) {
        if (user.role === "seller") return <Redirect to="/dashboard" />;
        return <Redirect to="/" />;
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(loginForm);
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterError("");

        if (registerForm.password !== registerForm.confirmPassword) {
            setRegisterError("Las contraseñas no coinciden");
            return;
        }
        if (registerForm.password.length < 6) {
            setRegisterError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        registerMutation.mutate({
            name: registerForm.name,
            email: registerForm.email,
            password: registerForm.password,
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left Panel - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-xl verified-badge flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-display text-2xl font-bold text-foreground">
                                True<span className="text-primary">Market</span>
                            </span>
                        </Link>
                    </div>

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="login" data-testid="tab-login">Iniciar Sesión</TabsTrigger>
                            <TabsTrigger value="register" data-testid="tab-register">Registrarse</TabsTrigger>
                        </TabsList>

                        {/* ── Login Tab ──────────────────────────── */}
                        <TabsContent value="login">
                            <Card className="border-border/50 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl">Bienvenido de vuelta</CardTitle>
                                    <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="login-email">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="login-email"
                                                    type="email"
                                                    placeholder="tu@email.com"
                                                    value={loginForm.email}
                                                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                                                    className="pl-10"
                                                    required
                                                    data-testid="input-login-email"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="login-password">Contraseña</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="login-password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={loginForm.password}
                                                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                                                    className="pl-10"
                                                    required
                                                    data-testid="input-login-password"
                                                />
                                            </div>
                                        </div>

                                        {loginMutation.isError && (
                                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                                                <p className="text-sm text-red-600 dark:text-red-400">
                                                    {(loginMutation.error as Error)?.message?.includes("401")
                                                        ? "Email o contraseña incorrectos"
                                                        : "Error al iniciar sesión. Intenta de nuevo."}
                                                </p>
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-trust hover:opacity-90 transition-opacity"
                                            disabled={loginMutation.isPending}
                                            data-testid="button-login"
                                        >
                                            {loginMutation.isPending ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <ArrowRight className="w-4 h-4 mr-2" />
                                            )}
                                            Iniciar Sesión
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ── Register Tab ───────────────────────── */}
                        <TabsContent value="register">
                            <Card className="border-border/50 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl">Crear cuenta</CardTitle>
                                    <CardDescription>Regístrate como comprador para empezar</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="register-name">Nombre completo</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="register-name"
                                                    type="text"
                                                    placeholder="Juan Pérez"
                                                    value={registerForm.name}
                                                    onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                                                    className="pl-10"
                                                    required
                                                    data-testid="input-register-name"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="register-email">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="register-email"
                                                    type="email"
                                                    placeholder="tu@email.com"
                                                    value={registerForm.email}
                                                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                                                    className="pl-10"
                                                    required
                                                    data-testid="input-register-email"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="register-password">Contraseña</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="register-password"
                                                    type="password"
                                                    placeholder="Mínimo 6 caracteres"
                                                    value={registerForm.password}
                                                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                                                    className="pl-10"
                                                    required
                                                    data-testid="input-register-password"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="register-confirm">Confirmar contraseña</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="register-confirm"
                                                    type="password"
                                                    placeholder="Repite tu contraseña"
                                                    value={registerForm.confirmPassword}
                                                    onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                    className="pl-10"
                                                    required
                                                    data-testid="input-register-confirm"
                                                />
                                            </div>
                                        </div>

                                        {(registerError || registerMutation.isError) && (
                                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                                                <p className="text-sm text-red-600 dark:text-red-400">
                                                    {registerError ||
                                                        ((registerMutation.error as Error)?.message?.includes("409")
                                                            ? "Este email ya está registrado"
                                                            : "Error al crear la cuenta. Intenta de nuevo.")}
                                                </p>
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-trust hover:opacity-90 transition-opacity"
                                            disabled={registerMutation.isPending}
                                            data-testid="button-register"
                                        >
                                            {registerMutation.isPending ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <ArrowRight className="w-4 h-4 mr-2" />
                                            )}
                                            Crear Cuenta
                                        </Button>
                                    </form>

                                    <div className="mt-6 pt-6 border-t border-border">
                                        <Link href="/registro-empresa">
                                            <Button
                                                variant="outline"
                                                className="w-full group"
                                                data-testid="button-goto-company"
                                            >
                                                <Building2 className="w-4 h-4 mr-2" />
                                                ¿Eres empresa? Regístrate aquí
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Right Panel - Decorative */}
            <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-trust relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white/30 blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
                </div>
                <div className="relative z-10 max-w-md text-center text-white px-8">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="font-display text-3xl font-bold mb-4">
                        Marketplace de Confianza
                    </h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                        Compra y vende productos verificados con total seguridad. Cada artículo pasa por nuestro sistema de autenticación TrueBox.
                    </p>
                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                            <div className="text-2xl font-bold">100%</div>
                            <div className="text-xs text-white/70">Verificado</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                            <div className="text-2xl font-bold">500+</div>
                            <div className="text-xs text-white/70">Empresas</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                            <div className="text-2xl font-bold">10K+</div>
                            <div className="text-xs text-white/70">Productos</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
