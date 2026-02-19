import { Switch, Route, Redirect } from "wouter";
import { queryClient, setAuthTokenGetter } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SignIn, SignUp, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import ProductDetail from "@/pages/ProductDetail";
import SellerDashboard from "@/pages/SellerDashboard";
import UploadProduct from "@/pages/UploadProduct";
import HowItWorksPage from "@/pages/HowItWorks";
import TrueBox from "@/pages/TrueBox";
import RegisterCompany from "@/pages/RegisterCompany";
import CompanyDirectory from "@/pages/CompanyDirectory";
import CompanyProfile from "@/pages/CompanyProfile";

// Register Clerk's getToken into queryClient for auth headers
function AuthTokenSync() {
  const { getToken } = useClerkAuth();
  useEffect(() => {
    setAuthTokenGetter(() => getToken());
  }, [getToken]);
  return null;
}

// Page wrapper for Clerk auth components
function ClerkAuthPage({ mode }: { mode: "sign-in" | "sign-up" }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        {mode === "sign-in" ? (
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            forceRedirectUrl="/"
          />
        ) : (
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            forceRedirectUrl="/"
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

// Protected route that requires authentication + optional role
function ProtectedRoute({
  component: Component,
  requiredRole,
}: {
  component: React.ComponentType;
  requiredRole?: string;
}) {
  const { user, isLoading, isSignedIn } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Redirect to="/sign-in" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-in">{() => <ClerkAuthPage mode="sign-in" />}</Route>
      <Route path="/sign-in/:rest*">{() => <ClerkAuthPage mode="sign-in" />}</Route>
      <Route path="/sign-up">{() => <ClerkAuthPage mode="sign-up" />}</Route>
      <Route path="/sign-up/:rest*">{() => <ClerkAuthPage mode="sign-up" />}</Route>
      <Route path="/catalogo" component={Catalog} />
      <Route path="/producto/:id" component={ProductDetail} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={SellerDashboard} requiredRole="business" />}
      </Route>
      <Route path="/vender">
        {() => <ProtectedRoute component={UploadProduct} />}
      </Route>
      <Route path="/como-funciona" component={HowItWorksPage} />
      <Route path="/truebox" component={TrueBox} />
      <Route path="/empresas" component={CompanyDirectory} />
      <Route path="/empresas/:id" component={CompanyProfile} />
      <Route path="/registro-empresa">
        {() => <ProtectedRoute component={RegisterCompany} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthTokenSync />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;