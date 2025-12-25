import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllSiteContent } from "@/hooks/useSiteContent";

const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&crop=faces";

export function HeroSection() {
  const { data: content = {} } = useAllSiteContent();

  const heroContent = content.hero || {};
  const statsContent = content.stats || {};

  const heroImage = heroContent.image || DEFAULT_HERO_IMAGE;
  const sessionsCount = statsContent.sessions_count || "100+";
  const sessionsLabel = statsContent.sessions_label || "Sessions Conducted";
  const participantsCount = statsContent.participants_count || "5000+";
  const participantsLabel = statsContent.participants_label || "Participants Trained";
  const institutionsCount = statsContent.institutions_count || "20+";
  const institutionsLabel = statsContent.institutions_label || "Institutions Served";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        {/* Geometric Pattern */}
        <svg
          className="absolute top-1/4 right-10 w-64 h-64 text-primary/5 animate-float"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-sm font-medium text-muted-foreground">
                {heroContent.badge_text || "District Co-Ordinator, Gujarat State Yog Board"}
              </span>
            </div>

            <h1 className="heading-xl mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              {heroContent.title || "Empowering Health, Discipline & Awareness "}
              {!heroContent.title && <span className="text-gradient">Through Yoga</span>}
            </h1>

            <p className="body-lg max-w-xl mx-auto lg:mx-0 mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              {heroContent.subtitle || "Practical yoga sessions, meditation workshops, and motivational talks for colleges, hospitals, government institutions, and corporate offices across Gujarat."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Button variant="hero" size="xl" asChild>
                <a href="#contact">
                  {heroContent.cta_primary || "Book a Session"}
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline-hero" size="xl" asChild>
                <a href="#services">
                  <Play className="h-5 w-5" />
                  {heroContent.cta_secondary || "View Programs"}
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-foreground">{sessionsCount}</div>
                <div className="text-sm text-muted-foreground">{sessionsLabel}</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-foreground">{participantsCount}</div>
                <div className="text-sm text-muted-foreground">{participantsLabel}</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-foreground">{institutionsCount}</div>
                <div className="text-sm text-muted-foreground">{institutionsLabel}</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-scale-in">
            <div className="relative">
              <div className="absolute -inset-4 bg-accent-gradient rounded-3xl blur-2xl opacity-20" />
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden bg-secondary border border-border shadow-card">
                <img
                  src={heroImage}
                  alt="Yoga and meditation practice"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-card/90 backdrop-blur-sm rounded-xl p-3 shadow-soft">
                    <p className="text-sm font-semibold text-foreground">Shree Durgesh K. Koshti</p>
                    <p className="text-xs text-muted-foreground">Yoga Instructor & Consultant</p>
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
