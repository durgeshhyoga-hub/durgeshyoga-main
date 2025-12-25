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
  hero: {
    title: "Hero Section",
    fields: [
      { key: "image", label: "Hero Image", type: "image" },
      { key: "title", label: "Main Title", type: "textarea", placeholder: "Transform Your Life..." },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Experience the ancient art..." },
      { key: "cta_primary", label: "Primary Button Text", type: "input", placeholder: "Start Your Journey" },
      { key: "cta_secondary", label: "Secondary Button Text", type: "input", placeholder: "View Services" },
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
      { key: "title", label: "Section Title", type: "input", placeholder: "About Me" },
      { key: "description", label: "Description", type: "textarea", placeholder: "I am a passionate yoga..." },
      { key: "mission", label: "Mission Statement", type: "textarea", placeholder: "My mission is to make yoga..." },
    ],
  },
  services: {
    title: "Services Section",
    fields: [
      { key: "title", label: "Section Title", type: "input", placeholder: "Services" },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Comprehensive yoga programs..." },
    ],
  },
  skills: {
    title: "Skills Section",
    fields: [
      { key: "title", label: "Section Title", type: "input", placeholder: "Skills & Expertise" },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Areas of specialization..." },
    ],
  },
  experience: {
    title: "Experience Section",
    fields: [
      { key: "title", label: "Section Title", type: "input", placeholder: "Experience & Certifications" },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "My journey in yoga..." },
    ],
  },
  contact: {
    title: "Contact Section",
    fields: [
      { key: "title", label: "Section Title", type: "input", placeholder: "Get In Touch" },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Ready to start your yoga journey?" },
      { key: "address", label: "Address", type: "input", placeholder: "Your Address Here" },
      { key: "phone", label: "Phone Number", type: "input", placeholder: "+91 XXXXXXXXXX" },
      { key: "email", label: "Email", type: "input", placeholder: "contact@example.com" },
    ],
  },
  gallery: {
    title: "Gallery Section",
    fields: [
      { key: "title", label: "Section Title", type: "input", placeholder: "Gallery" },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "Glimpses of our yoga sessions..." },
    ],
  },
  gallery_drive_link: {
    title: "Google Drive Gallery Link",
    fields: [
      { key: "button_text", label: "Button Text", type: "input", placeholder: "View Full Gallery" },
      { key: "drive_url", label: "Google Drive URL", type: "input", placeholder: "https://drive.google.com/drive/folders/..." },
      { key: "enabled", label: "Enable Button (true/false)", type: "input", placeholder: "true" },
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
