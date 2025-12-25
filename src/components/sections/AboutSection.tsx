import { Award, BookOpen, Users, Target } from "lucide-react";
import { useAllSiteContent } from "@/hooks/useSiteContent";

const highlights = [
  {
    icon: Award,
    title: "Government Role",
    description: "District Co-Ordinator at Gujarat State Yog Board (Govt. of Gujarat)",
  },
  {
    icon: BookOpen,
    title: "Certified Training",
    description: "100-Hour Yoga Training from Gujarat State Yog Board",
  },
  {
    icon: Users,
    title: "Diverse Audience",
    description: "Students, medical professionals, corporate teams, and government staff",
  },
  {
    icon: Target,
    title: "Practical Focus",
    description: "Scientific, practical, and result-oriented yoga education",
  },
];

const DEFAULT_ABOUT_IMAGE = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=750&fit=crop";

export function AboutSection() {
  const { data: content = {} } = useAllSiteContent();
  const aboutContent = content.about || {};
  const aboutImage = aboutContent.image || DEFAULT_ABOUT_IMAGE;

  const highlights = [
    {
      icon: Award,
      title: aboutContent.highlight_1_title || "Government Role",
      description: aboutContent.highlight_1_desc || "District Co-Ordinator at Gujarat State Yog Board (Govt. of Gujarat)",
    },
    {
      icon: BookOpen,
      title: aboutContent.highlight_2_title || "Certified Training",
      description: aboutContent.highlight_2_desc || "100-Hour Yoga Training from Gujarat State Yog Board",
    },
    {
      icon: Users,
      title: aboutContent.highlight_3_title || "Diverse Audience",
      description: aboutContent.highlight_3_desc || "Students, medical professionals, corporate teams, and government staff",
    },
    {
      icon: Target,
      title: aboutContent.highlight_4_title || "Practical Focus",
      description: aboutContent.highlight_4_desc || "Scientific, practical, and result-oriented yoga education",
    },
  ];

  return (
    <section id="about" className="section-padding bg-card">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl" />
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-card">
              <img
                src={aboutImage}
                alt="Meditation and mindfulness"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-card rounded-xl p-4 shadow-card border border-border max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{aboutContent.card_title || "Govt. Certified"}</p>
                  <p className="text-sm text-muted-foreground">{aboutContent.card_subtitle || "Gujarat State Yog Board"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
              <span className="text-sm font-medium text-muted-foreground">{aboutContent.badge || "About Me"}</span>
            </div>

            <h2 className="heading-lg mb-6">
              {aboutContent.title || "Spreading Practical & Scientific "}{" "}
              {!aboutContent.title && <span className="text-gradient">Yoga Education</span>}
            </h2>

            <p className="body-lg mb-6">
              {aboutContent.description_1 || "As the District Co-Ordinator at Gujarat State Yog Board, I am dedicated to spreading the benefits of yoga through practical, scientific, and motivational sessions."}
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {aboutContent.description_2 || "My mission is to make yoga accessible and impactful for everyone—from students and healthcare professionals to corporate teams and government employees. I focus on real-world applications of yoga for stress management, physical health, and mental clarity."}
            </p>

            {/* Highlights Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border hover:border-accent/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
