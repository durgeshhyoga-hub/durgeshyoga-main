import { GraduationCap, Building2, Brain, Mic, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: GraduationCap,
    title: "College & University Programs",
    description: "Comprehensive yoga programs combining practical sessions with theoretical knowledge, motivation, and lifestyle awareness for students.",
    features: ["Practical yoga sessions", "Health awareness", "Stress management"],
  },
  {
    icon: Building2,
    title: "Corporate Wellness",
    description: "Tailored sessions for professionals focusing on stress reduction, productivity enhancement, posture correction, and mental clarity.",
    features: ["Desk yoga", "Team building", "Work-life balance"],
  },
  {
    icon: Brain,
    title: "Meditation Workshops",
    description: "Guided meditation sessions designed for stress reduction, improved focus, emotional balance, and overall mental well-being.",
    features: ["Mindfulness training", "Breathing techniques", "Relaxation"],
  },
  {
    icon: Mic,
    title: "Motivational Talks",
    description: "Inspiring sessions on health awareness, discipline, lifestyle transformation, and the holistic benefits of yoga practice.",
    features: ["Health education", "Lifestyle tips", "Goal setting"],
  },
  {
    icon: Activity,
    title: "Practical Yoga Sessions",
    description: "Structured, safe, and condition-specific yoga practices tailored to individual needs and physical capabilities.",
    features: ["Personalized approach", "Safe practices", "Progressive learning"],
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="section-padding">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <span className="text-sm font-medium text-muted-foreground">Services</span>
          </div>
          <h2 className="heading-lg mb-4">
            Professional Yoga{" "}
            <span className="text-gradient">Programs & Services</span>
          </h2>
          <p className="body-lg">
            Comprehensive yoga and wellness solutions for educational institutions, healthcare facilities, and corporate organizations.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-card transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-hero-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <service.icon className="h-6 w-6 text-primary-foreground" />
              </div>

              <h3 className="heading-md mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {service.description}
              </p>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button variant="ghost" size="sm" className="group/btn p-0 h-auto text-primary hover:text-accent" asChild>
                <a href="#contact">
                  Learn More
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
