import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Users, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-landing-hero">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-6 py-12 md:py-20 relative">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-semibold text-foreground">love or squirrel</span>
            </div>
            <Link to="/app">
              <Button variant="outline" className="rounded-full">
                Sign In
              </Button>
            </Link>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Simple. Shared. Sorted.</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Organize life together,{" "}
              <span className="text-primary">one task at a time</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              A cozy task manager for couples, families, and roommates. Share to-dos, 
              coordinate shopping lists, and stay in sync without the chaos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/app">
                <Button size="lg" className="rounded-full px-8 gap-2 text-base">
                  Start Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                No account required
              </p>
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
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <ShoppingCart className="w-6 h-6 text-accent" />
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
                love or squirrel
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
