import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Users, CheckCircle2, ArrowRight, Heart, Settings } from "lucide-react";
import heroLight from "@/assets/hero-light.png";
import heroDark from "@/assets/hero-dark.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Curved Background */}
      <header className="relative min-h-screen flex items-center overflow-hidden">
        {/* Curved Background Shape */}
        <div className="absolute inset-0">
          <svg
            className="absolute w-full h-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0H1440V600C1440 600 1200 750 720 750C240 750 0 600 0 600V0Z"
              className="fill-landing-hero"
            />
          </svg>
        </div>

        <div className="container mx-auto px-6 py-12 relative">
          {/* Navigation */}
          <nav className="absolute top-6 left-6 right-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍋</span>
              <span className="text-xl font-semibold text-foreground">honeydew, please.</span>
            </div>
            <Link to="/app">
              <Button variant="outline" className="rounded-full border-foreground/20">
                Sign In
              </Button>
            </Link>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 items-center justify-items-center pt-24 max-w-5xl mx-auto">
            {/* Left - Phone Mockup */}
            <div className="flex justify-center md:justify-end order-2 md:order-1">
              <div className="relative">
                <img 
                  src={heroLight} 
                  alt="honeydew, please. app preview" 
                  className="h-[420px] md:h-[500px] w-auto rounded-[2.5rem] shadow-2xl dark:hidden"
                />
                <img 
                  src={heroDark} 
                  alt="honeydew, please. app preview" 
                  className="h-[420px] md:h-[500px] w-auto rounded-[2.5rem] shadow-2xl hidden dark:block"
                />
              </div>
            </div>

            {/* Right - Hero Content */}
            <div className="text-center md:text-left order-1 md:order-2 max-w-lg">
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-card/80 backdrop-blur-sm text-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
                <span>🍋</span>
                <span>Simple. Shared. Sorted.</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Organize life together,{" "}
                <span className="text-primary">one task at a time.</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-md">
                A cozy task manager for couples, families, and roommates. Share to-dos, 
                coordinate shopping lists, and stay in sync without the chaos. 🍋
              </p>

              <div className="flex flex-col sm:flex-row items-center md:items-start gap-4">
                <Link to="/app">
                  <Button size="lg" className="rounded-full px-8 gap-2 text-base bg-primary hover:bg-primary/90">
                    Start Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  No account required
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need, nothing you don't.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Built for real life with real people. Simple tools that just work.
            </p>
          </div>

          {/* Phone Mockups with Pagination */}
          <div className="mb-16">
            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Phone Mockups Row */}
            <div className="flex justify-center items-end gap-4 md:gap-8">
              {/* Left Phone - Settings */}
              <div className="hidden md:block opacity-60 transform -translate-y-4">
                <div className="bg-card rounded-[2rem] p-4 shadow-xl border border-border/50 w-48">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-primary" />
                    <span className="font-medium text-sm">Settings</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded-full w-full" />
                    <div className="h-3 bg-muted rounded-full w-3/4" />
                    <div className="h-3 bg-muted rounded-full w-5/6" />
                  </div>
                </div>
              </div>

              {/* Center Phone - Main */}
              <div className="relative z-10">
                <img 
                  src={heroLight} 
                  alt="To-dos screen" 
                  className="h-[300px] md:h-[400px] w-auto rounded-[2rem] shadow-2xl dark:hidden"
                />
                <img 
                  src={heroDark} 
                  alt="To-dos screen" 
                  className="h-[300px] md:h-[400px] w-auto rounded-[2rem] shadow-2xl hidden dark:block"
                />
              </div>

              {/* Right Phone - Shopping */}
              <div className="hidden md:block opacity-60 transform -translate-y-4">
                <div className="bg-card rounded-[2rem] p-4 shadow-xl border border-border/50 w-48">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    <span className="font-medium text-sm">Shopping</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded-full w-full" />
                    <div className="h-3 bg-muted rounded-full w-2/3" />
                    <div className="h-3 bg-muted rounded-full w-4/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Workspaces</h3>
                  <p className="text-muted-foreground text-sm">
                    Create shared spaces for your household, family, or team.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">To-Do Lists</h3>
                  <p className="text-muted-foreground text-sm">
                    Create, prioritize, and complete tasks together.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Shopping Lists</h3>
                  <p className="text-muted-foreground text-sm">
                    Never forget the milk again. Real-time updates as you shop.
                  </p>
                </div>
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
              <Button size="lg" className="rounded-full px-8 gap-2 text-base bg-primary hover:bg-primary/90">
                Start Using honeydew, please.
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
                honeydew, please. by <a href="https://catdeleon.design/contact" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">Cat de Leon</a>
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
