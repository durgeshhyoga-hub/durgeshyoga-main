import { Brain, Mic, Apple, Activity, Heart } from "lucide-react";

const skills = [
  {
    icon: Brain,
    title: "Meditation Facilitation",
    description: "Guiding individuals and groups through mindfulness practices and deep relaxation techniques.",
    level: 95,
  },
  {
    icon: Mic,
    title: "Motivational Speaking",
    description: "Inspiring audiences with compelling talks on health, discipline, and lifestyle transformation.",
    level: 90,
  },
  {
    icon: Apple,
    title: "Diet & Lifestyle Awareness",
    description: "Educating on balanced nutrition and healthy lifestyle choices for holistic well-being.",
    level: 85,
  },
  {
    icon: Activity,
    title: "Practical Yoga Instruction",
    description: "Teaching safe, effective, and personalized yoga practices for all skill levels.",
    level: 95,
  },
  {
    icon: Heart,
    title: "Stress & Disease Awareness",
    description: "Providing education on how yoga can help manage stress and prevent lifestyle diseases.",
    level: 90,
  },
];

export function SkillsSection() {
  return (
    <section className="section-padding">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <span className="text-sm font-medium text-muted-foreground">Skills & Expertise</span>
          </div>
          <h2 className="heading-lg mb-4">
            Professional{" "}
            <span className="text-gradient">Capabilities</span>
          </h2>
          <p className="body-lg">
            A comprehensive skill set developed through years of training, practice, and real-world experience.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-card transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                  <skill.icon className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{skill.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Proficiency</span>
                  <span className="font-medium text-foreground">{skill.level}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-gradient transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
