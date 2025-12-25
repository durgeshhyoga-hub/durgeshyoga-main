

import { useAllSiteContent } from "@/hooks/useSiteContent";

export function ExperienceSection() {
  const { data: content = {} } = useAllSiteContent();
  const expContent = content.experience || {};

  const experiences = [
    {
      institution: expContent.exp_1_inst || "GINERA, Civil Hospital",
      program: expContent.exp_1_prog || "Stress Management Session",
      type: expContent.exp_1_type || "Healthcare",
      description: expContent.exp_1_desc || "Conducted comprehensive stress management workshops for medical staff and healthcare workers.",
    },
    {
      institution: expContent.exp_2_inst || "GMERS College, Sola Civil",
      program: expContent.exp_2_prog || "Yogic Management & Motivational Talks",
      type: expContent.exp_2_type || "Medical Education",
      description: expContent.exp_2_desc || "Delivered yogic management sessions combined with motivational talks for medical students and faculty.",
    },
    {
      institution: expContent.exp_3_inst || "Shalby Multispecialty Hospital",
      program: expContent.exp_3_prog || "Practical Yoga Sessions",
      type: expContent.exp_3_type || "Healthcare",
      description: expContent.exp_3_desc || "Practical yoga program designed specifically for doctors, nurses, and hospital staff at SG Road location.",
    },
    {
      institution: expContent.exp_4_inst || "Victoria Jubilee College of Nursing",
      program: expContent.exp_4_prog || "Practical Yoga Session",
      type: expContent.exp_4_type || "Nursing Education",
      description: expContent.exp_4_desc || "Specialized yoga sessions for nursing students at Kalupur, focusing on physical and mental well-being.",
    },
    {
      institution: expContent.exp_5_inst || "Aashka Hospital, Gandhinagar",
      program: expContent.exp_5_prog || "Yogic Management for Medical Staff",
      type: expContent.exp_5_type || "Healthcare",
      description: expContent.exp_5_desc || "Complete yogic management program tailored for the medical and administrative staff.",
    },
  ];

  return (
    <section id="experience" className="section-padding bg-card">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <span className="text-sm font-medium text-muted-foreground">{expContent.badge || "Experience"}</span>
          </div>
          <h2 className="heading-lg mb-4">
            {expContent.title || "Notable Programs & Engagements"}
          </h2>
          <p className="body-lg">
            {expContent.description || "Trusted by leading healthcare institutions, educational organizations, and government bodies across Gujarat."}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5" />

          <div className="space-y-8 md:space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-accent rounded-full border-4 border-background md:-translate-x-1.5 z-10" />

                {/* Content Card */}
                <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:text-right md:pr-8" : "md:pl-8"}`}>
                  <div className="p-6 rounded-2xl bg-background border border-border hover:border-accent/30 hover:shadow-card transition-all duration-300">
                    <div className={`flex items-center gap-2 mb-3 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent">
                        {exp.type}
                      </span>
                    </div>

                    <h3 className="font-semibold text-lg text-foreground mb-1">{exp.institution}</h3>
                    <p className="text-primary font-medium text-sm mb-3">{exp.program}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                  </div>
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
