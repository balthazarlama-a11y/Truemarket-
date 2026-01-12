import { Link } from "wouter";
import { Gift, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TrueBoxBanner() {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 px-8 py-12 lg:px-16 lg:py-16">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">¡Nueva Experiencia!</span>
                </div>
                
                <h2 className="font-display text-3xl lg:text-5xl font-bold text-white mb-4">
                  TrueBox Sorpresa
                </h2>
                
                <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-md">
                  Cajas misteriosas con joyas y electrónica verificada. 
                  Cada caja contiene productos con valor garantizado superior al precio de compra.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/truebox">
                    <Button size="lg" className="bg-white text-amber-600 hover:bg-white/90 font-semibold" data-testid="button-explorar-truebox">
                      Explorar TrueBox
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 text-white/80">
                    <Gift className="w-5 h-5" />
                    <span className="text-sm">Desde $49.990</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-3xl rotate-6 border border-white/20" />
                  <div className="absolute inset-0 w-64 h-64 bg-white/15 backdrop-blur-sm rounded-3xl -rotate-3 border border-white/30 flex items-center justify-center">
                    <Gift className="w-24 h-24 text-white/80" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-amber-300 rounded-xl shadow-lg flex items-center justify-center">
                    <span className="text-xl">💎</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}