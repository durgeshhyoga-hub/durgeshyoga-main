import { Brain, Mic, Apple, Activity, Heart } from "lucide-react";

import { useAllSiteContent } from "@/hooks/useSiteContent";

export function SkillsSection() {
  const { data: content = {} } = useAllSiteContent();
  const skillsContent = content.skills || {};

  const skills = [
    {
      icon: Brain,
      title: skillsContent.skill_1_title || "Meditation Facilitation",
      description: skillsContent.skill_1_desc || "Guiding individuals and groups through mindfulness practices and deep relaxation techniques.",
      level: parseInt(skillsContent.skill_1_level || "95"),
    },
    {
      icon: Mic,
      title: skillsContent.skill_2_title || "Motivational Speaking",
      description: skillsContent.skill_2_desc || "Inspiring audiences with compelling talks on health, discipline, and lifestyle transformation.",
      level: parseInt(skillsContent.skill_2_level || "90"),
    },
    {
      icon: Apple,
      title: skillsContent.skill_3_title || "Diet & Lifestyle Awareness",
      description: skillsContent.skill_3_desc || "Educating on balanced nutrition and healthy lifestyle choices for holistic well-being.",
      level: parseInt(skillsContent.skill_3_level || "85"),
    },
    {
      icon: Activity,
      title: skillsContent.skill_4_title || "Practical Yoga Instruction",
      description: skillsContent.skill_4_desc || "Teaching safe, effective, and personalized yoga practices for all skill levels.",
      level: parseInt(skillsContent.skill_4_level || "95"),
    },
    {
      icon: Heart,
      title: skillsContent.skill_5_title || "Stress & Disease Awareness",
      description: skillsContent.skill_5_desc || "Providing education on how yoga can help manage stress and prevent lifestyle diseases.",
      level: parseInt(skillsContent.skill_5_level || "90"),
    },
  ];

  return (
    <section className="section-padding">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <span className="text-sm font-medium text-muted-foreground">{skillsContent.badge || "Skills & Expertise"}</span>
          </div>
          <h2 className="heading-lg mb-4">
            {skillsContent.title || "Professional Capabilities"}
          </h2>
          <p className="body-lg">
            {skillsContent.description || "A comprehensive skill set developed through years of training, practice, and real-world experience."}
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
