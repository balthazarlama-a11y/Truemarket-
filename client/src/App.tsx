import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import ProductDetail from "@/pages/ProductDetail";
import SellerDashboard from "@/pages/SellerDashboard";
import UploadProduct from "@/pages/UploadProduct";
import HowItWorksPage from "@/pages/HowItWorks";
import TrueBox from "@/pages/TrueBox";
import RegisterCompany from "@/pages/RegisterCompany";
import AuthPage from "@/pages/AuthPage";
import CompanyDirectory from "@/pages/CompanyDirectory";
import CompanyProfile from "@/pages/CompanyProfile";
import { Redirect } from "wouter";

// Protected route that requires authentication
function ProtectedRoute({ component: Component, requiredRole }: { component: React.ComponentType; requiredRole?: string }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/catalogo" component={Catalog} />
      <Route path="/producto/:id" component={ProductDetail} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={SellerDashboard} requiredRole="seller" />}
      </Route>
      <Route path="/vender">
        {() => <ProtectedRoute component={UploadProduct} requiredRole="seller" />}
      </Route>
      <Route path="/como-funciona" component={HowItWorksPage} />
      <Route path="/truebox" component={TrueBox} />
      <Route path="/empresas" component={CompanyDirectory} />
      <Route path="/empresas/:id" component={CompanyProfile} />
      <Route path="/registro-empresa" component={RegisterCompany} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;