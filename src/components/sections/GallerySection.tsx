import { useGalleryLinks } from "@/hooks/useGalleryLinks";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useAllSiteContent } from "@/hooks/useSiteContent";

export function GallerySection() {
  const { data: links = [], isLoading } = useGalleryLinks();
  const { data: content = {} } = useAllSiteContent();
  const galleryContent = content.gallery || {};

  // Filter active links with valid URLs
  const activeLinks = links.filter(link => link.is_active && link.drive_url);

  // Hide section if no active links
  if (isLoading || activeLinks.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="section-padding bg-card">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <span className="text-sm font-medium text-muted-foreground">{galleryContent.badge || "Gallery"}</span>
          </div>
          <h2 className="heading-lg mb-4">
            {galleryContent.title || "Glimpses of Our Yoga Sessions"}
          </h2>
          <p className="body-lg">
            {galleryContent.description || "Moments captured from workshops, training sessions, and yoga events across Gujarat."}
          </p>
        </div>

        {/* Multiple Google Drive Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {activeLinks.map((link) => (
            <Button
              key={link.id}
              size="lg"
              variant="outline"
              className="gap-2"
              onClick={() => window.open(link.drive_url, "_blank")}
            >
              {link.title}
              <ExternalLink className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
