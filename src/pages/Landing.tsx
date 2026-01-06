import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Users, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { DoodleHeart, DoodleStar, DoodleSquiggle, DoodleCheckmark, DoodleSparkle } from "@/components/landing/Doodles";
import PhoneMockup from "@/components/landing/PhoneMockup";
import appScreenshot from "@/assets/app-screenshot-home.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-landing-hero overflow-hidden">
      {/* Hero Section */}
      <header className="relative">
        {/* Decorative doodles */}
        <DoodleHeart className="absolute top-20 left-[10%] w-12 h-12 text-primary/40 animate-pulse hidden md:block" />
        <DoodleStar className="absolute top-40 right-[15%] w-10 h-10 text-accent/50 hidden md:block" />
        <DoodleSparkle className="absolute bottom-20 left-[20%] w-8 h-8 text-primary/30 hidden md:block" />
        
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-6 py-12 md:py-20 relative">
          <nav className="flex items-center justify-between mb-16">
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

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                <span>Simple. Shared. Sorted.</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Organize life together,{" "}
                <span className="text-primary relative">
                  one task at a time
                  <DoodleSquiggle className="absolute -bottom-2 left-0 w-full h-4 text-primary/40" />
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0">
                A cozy task manager for couples, families, and roommates. Share to-dos, 
                coordinate shopping lists, and stay in sync without the chaos.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
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

            {/* Phone mockup with screenshot */}
            <div className="relative flex justify-center lg:justify-end">
              <DoodleCheckmark className="absolute -top-4 -left-4 w-12 h-12 text-primary/50 hidden lg:block" />
              <DoodleStar className="absolute bottom-10 -right-6 w-8 h-8 text-accent/60 hidden lg:block" />
              <PhoneMockup 
                imageSrc={appScreenshot} 
                alt="love or squirrel app screenshot"
                className="w-64 md:w-72 lg:w-80 transform rotate-2 hover:rotate-0 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background relative">
        <DoodleHeart className="absolute top-10 right-[10%] w-16 h-16 text-primary/20 hidden md:block" />
        <DoodleSparkle className="absolute bottom-20 left-[8%] w-10 h-10 text-accent/30 hidden md:block" />
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 relative inline-block">
              Everything you need, nothing you don't
              <DoodleSquiggle className="absolute -bottom-3 left-1/4 w-1/2 h-4 text-accent/40" />
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mt-6">
              Built for real life with real people. Simple tools that just work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative group">
              <DoodleCheckmark className="absolute -top-3 -right-3 w-8 h-8 text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
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

            <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative group">
              <DoodleStar className="absolute -top-3 -right-3 w-8 h-8 text-accent/50 opacity-0 group-hover:opacity-100 transition-opacity" />
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

            <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative group">
              <DoodleHeart className="absolute -top-3 -right-3 w-8 h-8 text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
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
      <section className="py-16 md:py-24 bg-landing-hero relative">
        <DoodleStar className="absolute top-16 left-[15%] w-12 h-12 text-accent/40 hidden md:block" />
        <DoodleSparkle className="absolute bottom-16 right-[12%] w-10 h-10 text-primary/30 hidden md:block" />
        
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 relative inline-block">
              Ready to get organized?
              <DoodleHeart className="absolute -right-10 -top-6 w-8 h-8 text-primary/50" />
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
