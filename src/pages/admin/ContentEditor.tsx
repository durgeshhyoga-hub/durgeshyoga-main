import { useState, useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAllSiteContent, useUpdateSiteContent } from "@/hooks/useSiteContent";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

interface SectionField {
  key: string;
  label: string;
  type: "input" | "textarea" | "image";
  placeholder?: string;
}

const sectionConfig: Record<string, { title: string; fields: SectionField[] }> = {
  header: {
    title: "Header & Navigation",
    fields: [
      { key: "cta_text", label: "Button Text", type: "input", placeholder: "Book a Session" },
      { key: "nav_home", label: "Nav Home", type: "input", placeholder: "Home" },
      { key: "nav_about", label: "Nav About", type: "input", placeholder: "About" },
      { key: "nav_services", label: "Nav Services", type: "input", placeholder: "Services" },
      { key: "nav_experience", label: "Nav Experience", type: "input", placeholder: "Experience" },
      { key: "nav_gallery", label: "Nav Gallery", type: "input", placeholder: "Gallery" },
      { key: "nav_contact", label: "Nav Contact", type: "input", placeholder: "Contact" },
    ]
  },
  hero: {
    title: "Hero Section",
    fields: [
      { key: "image", label: "Hero Image", type: "image" },
      { key: "badge_text", label: "Badge Text", type: "input", placeholder: "District Co-Ordinator..." },
      { key: "title", label: "Main Title", type: "textarea", placeholder: "Empowering Health..." },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Practical yoga sessions..." },
      { key: "cta_primary", label: "Primary Button Text", type: "input", placeholder: "Book a Session" },
      { key: "cta_secondary", label: "Secondary Button Text", type: "input", placeholder: "View Programs" },
    ],
  },
  stats: {
    title: "Stats (Counts)",
    fields: [
      { key: "sessions_count", label: "Sessions Conducted", type: "input", placeholder: "100+" },
      { key: "sessions_label", label: "Sessions Label", type: "input", placeholder: "Sessions Conducted" },
      { key: "participants_count", label: "Participants Trained", type: "input", placeholder: "5000+" },
      { key: "participants_label", label: "Participants Label", type: "input", placeholder: "Participants Trained" },
      { key: "institutions_count", label: "Institutions Served", type: "input", placeholder: "20+" },
      { key: "institutions_label", label: "Institutions Label", type: "input", placeholder: "Institutions Served" },
    ],
  },
  about: {
    title: "About Section",
    fields: [
      { key: "image", label: "About Image", type: "image" },
      { key: "badge", label: "Badge Text", type: "input", placeholder: "About Me" },
      { key: "title", label: "Section Title", type: "input", placeholder: "Spreading Practical..." },
      { key: "description_1", label: "Description Paragraph 1", type: "textarea", placeholder: "As the District Co-Ordinator..." },
      { key: "description_2", label: "Description Paragraph 2", type: "textarea", placeholder: "My mission is to make yoga..." },
      { key: "card_title", label: "Floating Card Title", type: "input", placeholder: "Govt. Certified" },
      { key: "card_subtitle", label: "Floating Card Subtitle", type: "input", placeholder: "Gujarat State Yog Board" },

      { key: "highlight_1_title", label: "Highlight 1 Title", type: "input", placeholder: "Government Role" },
      { key: "highlight_1_desc", label: "Highlight 1 Description", type: "textarea", placeholder: "District Co-Ordinator..." },

      { key: "highlight_2_title", label: "Highlight 2 Title", type: "input", placeholder: "Certified Training" },
      { key: "highlight_2_desc", label: "Highlight 2 Description", type: "textarea", placeholder: "100-Hour Yoga Training..." },

      { key: "highlight_3_title", label: "Highlight 3 Title", type: "input", placeholder: "Diverse Audience" },
      { key: "highlight_3_desc", label: "Highlight 3 Description", type: "textarea", placeholder: "Students, medical professionals..." },

      { key: "highlight_4_title", label: "Highlight 4 Title", type: "input", placeholder: "Practical Focus" },
      { key: "highlight_4_desc", label: "Highlight 4 Description", type: "textarea", placeholder: "Scientific, practical..." },
    ],
  },
  services: {
    title: "Services Section",
    fields: [
      { key: "badge", label: "Badge Text", type: "input", placeholder: "Services" },
      { key: "title", label: "Section Title", type: "input", placeholder: "Professional Yoga Programs..." },
      { key: "description", label: "Description", type: "textarea", placeholder: "Comprehensive yoga and wellness solutions..." },

      { key: "service_1_title", label: "Service 1 Title", type: "input", placeholder: "College & University Programs" },
      { key: "service_1_desc", label: "Service 1 Description", type: "textarea", placeholder: "Comprehensive yoga programs..." },
      { key: "service_1_features", label: "Service 1 Features (comma separated)", type: "textarea", placeholder: "Feature 1, Feature 2, Feature 3" },

      { key: "service_2_title", label: "Service 2 Title", type: "input", placeholder: "Corporate Wellness" },
      { key: "service_2_desc", label: "Service 2 Description", type: "textarea", placeholder: "Tailored sessions for professionals..." },
      { key: "service_2_features", label: "Service 2 Features (comma separated)", type: "textarea", placeholder: "Feature 1, Feature 2, Feature 3" },

      { key: "service_3_title", label: "Service 3 Title", type: "input", placeholder: "Meditation Workshops" },
      { key: "service_3_desc", label: "Service 3 Description", type: "textarea", placeholder: "Guided meditation sessions..." },
      { key: "service_3_features", label: "Service 3 Features (comma separated)", type: "textarea", placeholder: "Feature 1, Feature 2, Feature 3" },

      { key: "service_4_title", label: "Service 4 Title", type: "input", placeholder: "Motivational Talks" },
      { key: "service_4_desc", label: "Service 4 Description", type: "textarea", placeholder: "Inspiring sessions on health..." },
      { key: "service_4_features", label: "Service 4 Features (comma separated)", type: "textarea", placeholder: "Feature 1, Feature 2, Feature 3" },

      { key: "service_5_title", label: "Service 5 Title", type: "input", placeholder: "Practical Yoga Sessions" },
      { key: "service_5_desc", label: "Service 5 Description", type: "textarea", placeholder: "Structured, safe, and condition-specific..." },
      { key: "service_5_features", label: "Service 5 Features (comma separated)", type: "textarea", placeholder: "Feature 1, Feature 2, Feature 3" },
    ],
  },
  experience: {
    title: "Experience Section",
    fields: [
      { key: "badge", label: "Badge Text", type: "input", placeholder: "Experience" },
      { key: "title", label: "Section Title", type: "input", placeholder: "Notable Programs & Engagements" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Trusted by leading healthcare institutions..." },

      { key: "exp_1_inst", label: "Experience 1 Institution", type: "input", placeholder: "GINERA, Civil Hospital" },
      { key: "exp_1_prog", label: "Experience 1 Program", type: "input", placeholder: "Stress Management Session" },
      { key: "exp_1_type", label: "Experience 1 Type", type: "input", placeholder: "Healthcare" },
      { key: "exp_1_desc", label: "Experience 1 Description", type: "textarea", placeholder: "Conducted comprehensive..." },

      { key: "exp_2_inst", label: "Experience 2 Institution", type: "input", placeholder: "GMERS College" },
      { key: "exp_2_prog", label: "Experience 2 Program", type: "input", placeholder: "Yogic Management..." },
      { key: "exp_2_type", label: "Experience 2 Type", type: "input", placeholder: "Medical Education" },
      { key: "exp_2_desc", label: "Experience 2 Description", type: "textarea", placeholder: "Delivered yogic management..." },

      { key: "exp_3_inst", label: "Experience 3 Institution", type: "input", placeholder: "Shalby Multispecialty Hospital" },
      { key: "exp_3_prog", label: "Experience 3 Program", type: "input", placeholder: "Practical Yoga Sessions" },
      { key: "exp_3_type", label: "Experience 3 Type", type: "input", placeholder: "Healthcare" },
      { key: "exp_3_desc", label: "Experience 3 Description", type: "textarea", placeholder: "Practical yoga program..." },

      { key: "exp_4_inst", label: "Experience 4 Institution", type: "input", placeholder: "Victoria Jubilee College" },
      { key: "exp_4_prog", label: "Experience 4 Program", type: "input", placeholder: "Practical Yoga Session" },
      { key: "exp_4_type", label: "Experience 4 Type", type: "input", placeholder: "Nursing Education" },
      { key: "exp_4_desc", label: "Experience 4 Description", type: "textarea", placeholder: "Specialized yoga sessions..." },

      { key: "exp_5_inst", label: "Experience 5 Institution", type: "input", placeholder: "Aashka Hospital" },
      { key: "exp_5_prog", label: "Experience 5 Program", type: "input", placeholder: "Yogic Management..." },
      { key: "exp_5_type", label: "Experience 5 Type", type: "input", placeholder: "Healthcare" },
      { key: "exp_5_desc", label: "Experience 5 Description", type: "textarea", placeholder: "Complete yogic management..." },
    ],
  },
  skills: {
    title: "Skills Section",
    fields: [
      { key: "badge", label: "Badge Text", type: "input", placeholder: "Skills & Expertise" },
      { key: "title", label: "Section Title", type: "input", placeholder: "Professional Capabilities" },
      { key: "description", label: "Description", type: "textarea", placeholder: "A comprehensive skill set..." },

      { key: "skill_1_title", label: "Skill 1 Title", type: "input", placeholder: "Meditation Facilitation" },
      { key: "skill_1_desc", label: "Skill 1 Description", type: "textarea", placeholder: "Guiding individuals..." },
      { key: "skill_1_level", label: "Skill 1 Level (%)", type: "input", placeholder: "95" },

      { key: "skill_2_title", label: "Skill 2 Title", type: "input", placeholder: "Motivational Speaking" },
      { key: "skill_2_desc", label: "Skill 2 Description", type: "textarea", placeholder: "Inspiring audiences..." },
      { key: "skill_2_level", label: "Skill 2 Level (%)", type: "input", placeholder: "90" },

      { key: "skill_3_title", label: "Skill 3 Title", type: "input", placeholder: "Diet & Lifestyle" },
      { key: "skill_3_desc", label: "Skill 3 Description", type: "textarea", placeholder: "Educating on balanced..." },
      { key: "skill_3_level", label: "Skill 3 Level (%)", type: "input", placeholder: "85" },

      { key: "skill_4_title", label: "Skill 4 Title", type: "input", placeholder: "Practical Yoga Instruction" },
      { key: "skill_4_desc", label: "Skill 4 Description", type: "textarea", placeholder: "Teaching safe..." },
      { key: "skill_4_level", label: "Skill 4 Level (%)", type: "input", placeholder: "95" },

      { key: "skill_5_title", label: "Skill 5 Title", type: "input", placeholder: "Stress & Disease Awareness" },
      { key: "skill_5_desc", label: "Skill 5 Description", type: "textarea", placeholder: "Providing education..." },
      { key: "skill_5_level", label: "Skill 5 Level (%)", type: "input", placeholder: "90" },
    ],
  },
  gallery: {
    title: "Gallery Section",
    fields: [
      { key: "badge", label: "Badge Text", type: "input", placeholder: "Gallery" },
      { key: "title", label: "Section Title", type: "input", placeholder: "Glimpses of Our Yoga Sessions" },
      { key: "description", label: "Subtitle", type: "textarea", placeholder: "Moments captured from workshops..." },
    ],
  },
  contact: {
    title: "Contact Section",
    fields: [
      { key: "badge", label: "Badge Text", type: "input", placeholder: "Contact" },
      { key: "title", label: "Section Title", type: "input", placeholder: "Get In Touch" },
      { key: "description", label: "Subtitle", type: "textarea", placeholder: "Ready to bring yoga..." },

      { key: "phone", label: "Phone Number", type: "input", placeholder: "+91 99744 54516" },
      { key: "email", label: "Email", type: "input", placeholder: "contact@example.com" },
      { key: "instagram", label: "Instagram Handle", type: "input", placeholder: "@Durgesh.yoga" },
      { key: "instagram_url", label: "Instagram URL", type: "input", placeholder: "https://instagram.com/..." },
      { key: "location", label: "Location", type: "input", placeholder: "Gujarat, India" },

      { key: "form_title", label: "Form Title", type: "input", placeholder: "Send a Message" },
      { key: "info_title", label: "Contact Info Title", type: "input", placeholder: "Contact Information" },
      { key: "info_desc", label: "Contact Info Description", type: "textarea", placeholder: "Feel free to reach out..." },
    ],
  },
  footer: {
    title: "Footer Section",
    fields: [
      { key: "description", label: "Footer Description", type: "textarea", placeholder: "District Co-Ordinator..." },
      { key: "copyright", label: "Copyright Text", type: "input", placeholder: "Shree Durgesh Kishorbhai Koshti" },
    ],
  },
};

export default function ContentEditor() {
  const { toast } = useToast();
  const { data: allContent = {}, isLoading, refetch } = useAllSiteContent();
  const updateContent = useUpdateSiteContent();

  const [editedContent, setEditedContent] = useState<Record<string, Record<string, string>>>({});
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    if (Object.keys(allContent).length > 0) {
      setEditedContent(allContent);
    }
  }, [allContent]);

  const handleFieldChange = (sectionKey: string, fieldKey: string, value: string) => {
    setEditedContent((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [fieldKey]: value,
      },
    }));
  };

  const handleSave = async (sectionKey: string) => {
    try {
      await updateContent.mutateAsync({
        sectionKey,
        content: editedContent[sectionKey] || {},
      });
      toast({ title: "Content saved successfully!" });
    } catch (error) {
      toast({ title: "Failed to save content", variant: "destructive" });
    }
  };

  const handleReset = (sectionKey: string) => {
    setEditedContent((prev) => ({
      ...prev,
      [sectionKey]: allContent[sectionKey] || {},
    }));
    toast({ title: "Changes discarded" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Content Editor</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edit all text content on your website
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0 mb-6">
          {Object.entries(sectionConfig).map(([key, config]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-lg border border-border"
            >
              {config.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(sectionConfig).map(([sectionKey, config]) => (
          <TabsContent key={sectionKey} value={sectionKey}>
            <div className="rounded-xl bg-card border border-border p-6">
              <h2 className="font-semibold text-foreground mb-6">{config.title}</h2>

              <div className="space-y-6">
                {config.fields.map((field) => (
                  <div key={field.key}>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {field.label}
                    </label>
                    {field.type === "image" ? (
                      <ImageUploadField
                        label=""
                        value={editedContent[sectionKey]?.[field.key] || ""}
                        onChange={(url) => handleFieldChange(sectionKey, field.key, url)}
                      />
                    ) : field.type === "textarea" ? (
                      <Textarea
                        placeholder={field.placeholder}
                        value={editedContent[sectionKey]?.[field.key] || ""}
                        onChange={(e) => handleFieldChange(sectionKey, field.key, e.target.value)}
                        rows={4}
                      />
                    ) : (
                      <Input
                        placeholder={field.placeholder}
                        value={editedContent[sectionKey]?.[field.key] || ""}
                        onChange={(e) => handleFieldChange(sectionKey, field.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-border">
                <Button variant="outline" onClick={() => handleReset(sectionKey)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={() => handleSave(sectionKey)} disabled={updateContent.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
