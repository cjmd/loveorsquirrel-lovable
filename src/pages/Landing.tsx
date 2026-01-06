import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Users, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-landing-hero overflow-hidden relative">
      {/* Decorative shapes */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-secondary/40 rounded-full blur-xl animate-float" style={{ animationDelay: "2s" }} />

      {/* Hero Section */}
      <header className="relative">
        <div className="container mx-auto px-6 py-12 md:py-20 relative">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2 group">
              <img 
                src="/pwa-icon.png" 
                alt="love or squirrel" 
                className="w-10 h-10 rounded-full transition-transform duration-300 group-hover:rotate-12" 
              />
              <span className="text-xl font-semibold text-foreground">love or squirrel</span>
            </div>
            <Link to="/app">
              <Button variant="outline" className="rounded-full hover:rotate-1 transition-transform">
                Sign In
              </Button>
            </Link>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-bounce-gentle">
              <Sparkles className="w-4 h-4 animate-wiggle" />
              <span>Simple. Shared. Sorted.</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Organize life together,{" "}
              <span className="text-primary font-handwritten text-5xl md:text-7xl inline-block -rotate-2 hover:rotate-0 transition-transform duration-300">
                one task at a time
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              A cozy task manager for couples, families, and roommates. Share to-dos, 
              coordinate shopping lists, and stay in sync without the chaos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/app">
                <Button 
                  size="lg" 
                  className="rounded-full px-8 gap-2 text-base hover:scale-105 hover:-rotate-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground font-handwritten text-lg">
                No account required ✨
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background relative">
        {/* Wavy separator */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-landing-hero" style={{
          clipPath: "ellipse(60% 100% at 50% 0%)"
        }} />
        
        <div className="container mx-auto px-6 pt-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need, <span className="font-handwritten text-primary text-4xl md:text-5xl">nothing you don't</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built for real life with real people. Simple tools that just work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-0 shadow-sm bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:rotate-1 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform rotate-3">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">To-Do Lists</h3>
                <p className="text-muted-foreground">
                  Create, prioritize, and complete tasks together. See what's done and what's next at a glance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:-rotate-1 group md:-mt-4">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform -rotate-3">
                  <ShoppingCart className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Shopping Lists</h3>
                <p className="text-muted-foreground">
                  Never forget the milk again. Share shopping lists that update in real-time as you shop.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:rotate-1 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-secondary/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform rotate-2">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Shared Workspaces</h3>
                <p className="text-muted-foreground">
                  Invite your partner, family, or roommates. Everyone stays on the same page.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-landing-hero relative">
        {/* Decorative squiggle */}
        <div className="absolute top-10 right-10 text-6xl font-handwritten text-primary/20 rotate-12 hidden md:block">
          ~
        </div>
        <div className="absolute bottom-10 left-10 text-6xl font-handwritten text-accent/20 -rotate-12 hidden md:block">
          ♥
        </div>
        
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to get <span className="font-handwritten text-primary text-4xl md:text-5xl inline-block rotate-2">organized?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join others who've simplified their shared to-do lists. 
              Start for free and see the difference.
            </p>
            <Link to="/app">
              <Button 
                size="lg" 
                className="rounded-full px-8 gap-2 text-base hover:scale-105 hover:rotate-2 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Using love or squirrel
                <Heart className="w-4 h-4 animate-bounce-gentle" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary animate-bounce-gentle" />
              <span className="text-sm text-muted-foreground">
                love or squirrel by <a href="https://catdeleon.design/contact" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors font-handwritten text-base">Cat de Leon</a>
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-handwritten text-base">
              Made with care for people who care about each other ♥
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
