import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Users, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import heroLight from "@/assets/hero-light.png";
import heroDark from "@/assets/hero-dark.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-landing-hero">
      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-6 py-12 relative">
          <nav className="absolute top-6 left-6 right-6 flex items-center justify-between">
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

          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center pt-20 max-w-6xl mx-auto">
            {/* Left - Phone Image */}
            <div className="flex justify-center md:justify-center order-2 md:order-1">
              <div className="relative">
                <img 
                  src={heroLight} 
                  alt="love or squirrel app preview" 
                  className="h-[450px] md:h-[500px] lg:h-[550px] w-auto rounded-3xl shadow-2xl dark:hidden"
                />
                <img 
                  src={heroDark} 
                  alt="love or squirrel app preview" 
                  className="h-[450px] md:h-[500px] lg:h-[550px] w-auto rounded-3xl shadow-2xl hidden dark:block"
                />
              </div>
            </div>

            {/* Right - Text and Button */}
            <div className="text-center md:text-left order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                <span>Simple. Shared. Sorted.</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Organize life together,{" "}
                <span className="text-primary">one task at a time.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg">
                A task manager for couples, families, and roommates. Share to-dos, 
                coordinate shopping lists, and stay in sync without the chaos.
              </p>

              <div className="flex flex-col sm:flex-row items-center md:items-start gap-4">
                <Link to="/app">
                  <Button size="lg" className="rounded-full px-8 gap-2 text-base">
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
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need, nothing you don't
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built for real life with real people. Simple tools that just work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">To-Do Lists</h3>
                <p className="text-muted-foreground">
                  Create, prioritize, and complete tasks together. See what's done and what's next at a glance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Shopping Lists</h3>
                <p className="text-muted-foreground">
                  Never forget the milk again. Share shopping lists that update in real-time as you shop.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-primary" />
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
      <section className="py-16 md:py-24 bg-landing-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to get organized?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join others who've simplified their shared to-do lists. 
              Start for free and see the difference.
            </p>
            <Link to="/app">
              <Button size="lg" className="rounded-full px-8 gap-2 text-base">
                Start Using love or squirrel
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
