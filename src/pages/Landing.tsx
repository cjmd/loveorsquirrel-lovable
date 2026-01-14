import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Users, CheckCircle2, ArrowRight } from "lucide-react";
import heroLight from "@/assets/hero-light.png";
import heroDark from "@/assets/hero-dark.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-landing-hero">
      {/* Hero Section */}
      <header className="relative py-20 md:py-24 overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <nav className="absolute top-0 left-6 right-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/pwa-icon.png" alt="love or squirrel" className="w-10 h-10 rounded-full" />
              <span className="text-xl font-semibold text-foreground">love or squirrel</span>
            </div>
            <Link to="/app">
              <Button variant="outline" className="rounded-full">
                Sign In
              </Button>
            </Link>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 items-center justify-items-center pt-16 max-w-[900px] mx-auto">
            {/* Left - Phone Image */}
            <div className="flex justify-center md:justify-end order-2 md:order-1">
              <div className="relative">
                <img 
                  src={heroLight} 
                  alt="love or squirrel app preview" 
                  className="h-[420px] md:h-[480px] w-auto rounded-3xl shadow-2xl dark:hidden"
                />
                <img 
                  src={heroDark} 
                  alt="love or squirrel app preview" 
                  className="h-[420px] md:h-[480px] w-auto rounded-3xl shadow-2xl hidden dark:block"
                />
              </div>
            </div>

            {/* Right - Text and Button */}
            <div className="text-center md:text-left order-1 md:order-2 max-w-md">
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-card/80 text-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
                <span>🍋</span>
                <span>Simple. Shared. Sorted.</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                Organize life together,{" "}
                <span className="text-primary">one task at a time.</span>
              </h1>
              
              <p className="text-base md:text-lg text-muted-foreground mb-8">
                A task manager for couples, families, and roommates. Share to-dos, 
                coordinate shopping lists, and stay in sync without the chaos. 🍈
              </p>

              <div className="flex flex-col sm:flex-row items-center md:items-start gap-3">
                <Link to="/app">
                  <Button size="lg" className="rounded-full px-6 gap-2 text-base">
                    Start Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground flex items-center">
                  No account required
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need, nothing you don't.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built for real life with real people. Simple tools that just work.
            </p>
          </div>

          {/* Phone Screenshots Carousel */}
          <div className="flex justify-center items-center gap-4 mb-12 overflow-hidden">
            <div className="flex-shrink-0 opacity-60 scale-90 hidden md:block">
              <img 
                src={heroLight} 
                alt="Settings preview" 
                className="h-[380px] w-auto rounded-2xl shadow-lg dark:hidden"
              />
              <img 
                src={heroDark} 
                alt="Settings preview" 
                className="h-[380px] w-auto rounded-2xl shadow-lg hidden dark:block"
              />
            </div>
            <div className="flex-shrink-0">
              <img 
                src={heroLight} 
                alt="To-dos preview" 
                className="h-[420px] w-auto rounded-2xl shadow-xl dark:hidden"
              />
              <img 
                src={heroDark} 
                alt="To-dos preview" 
                className="h-[420px] w-auto rounded-2xl shadow-xl hidden dark:block"
              />
            </div>
            <div className="flex-shrink-0 opacity-60 scale-90 hidden md:block">
              <img 
                src={heroLight} 
                alt="Shopping preview" 
                className="h-[380px] w-auto rounded-2xl shadow-lg dark:hidden"
              />
              <img 
                src={heroDark} 
                alt="Shopping preview" 
                className="h-[380px] w-auto rounded-2xl shadow-lg hidden dark:block"
              />
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-2 mb-12">
            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Workspaces</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Invite your partner, family, or roommates. Everyone stays on the same page.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">To-Do Lists</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Create, prioritize, and complete tasks <span className="text-primary font-medium">together</span>. See what's next at a glance.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Shopping Lists</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Never forget the milk again. Share shopping lists that update in <span className="text-primary font-medium">real-time</span> as you shop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to get organized?
            </h2>
            <p className="text-base md:text-lg text-primary-foreground/80 mb-8">
              Join others who've simplified their shared to-do lists. Start for free and see the difference.
            </p>
            <Link to="/app">
              <Button size="lg" variant="secondary" className="rounded-full px-6 gap-2 text-base bg-white text-primary hover:bg-white/90">
                Start Using love or squirrel.
                <ArrowRight className="w-4 h-4" />
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
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                love or squirrel by <a href="https://catdeleon.design/contact" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">Cat de Leon</a>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Made with care for people who care about each other.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
