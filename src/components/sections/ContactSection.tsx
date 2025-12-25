import { useState } from "react";
import { Phone, Mail, Instagram, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSubmitInquiry } from "@/hooks/useInquiries";
import { z } from "zod";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: "+91 99744 54516",
    href: "tel:+919974454516",
  },
  {
    icon: Mail,
    label: "Email",
    value: "Durgeshh.yoga@gmail.com",
    href: "mailto:Durgeshh.yoga@gmail.com",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@Durgesh.yoga",
    href: "https://instagram.com/Durgesh.yoga",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Gujarat, India",
    href: null,
  },
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional(),
  organization: z.string().trim().max(200, "Organization must be less than 200 characters").optional(),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

export function ContactSection() {
  const { toast } = useToast();
  const submitInquiry = useSubmitInquiry();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await submitInquiry.mutateAsync({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        organization: formData.organization.trim() || undefined,
        message: formData.message.trim(),
      });

      // Also send to WhatsApp using anchor element to bypass popup blockers
      const whatsappMessage = encodeURIComponent(
        `New Inquiry from Website:\n\n` +
        `Name: ${formData.name.trim()}\n` +
        `Email: ${formData.email.trim()}\n` +
        `${formData.phone.trim() ? `Phone: ${formData.phone.trim()}\n` : ''}` +
        `${formData.organization.trim() ? `Organization: ${formData.organization.trim()}\n` : ''}` +
        `Message: ${formData.message.trim()}`
      );
      const whatsappLink = document.createElement('a');
      whatsappLink.href = `https://wa.me/919974454516?text=${whatsappMessage}`;
      whatsappLink.target = '_blank';
      whatsappLink.rel = 'noopener noreferrer';
      document.body.appendChild(whatsappLink);
      whatsappLink.click();
      document.body.removeChild(whatsappLink);

      toast({
        title: "Message Sent!",
        description: "Thank you for your inquiry. I will get back to you soon.",
      });

      setFormData({ name: "", email: "", phone: "", organization: "", message: "" });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact directly via phone/email.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello, I would like to inquire about your yoga programs and services.`
    );
    const whatsappLink = document.createElement('a');
    whatsappLink.href = `https://wa.me/919974454516?text=${message}`;
    whatsappLink.target = '_blank';
    whatsappLink.rel = 'noopener noreferrer';
    document.body.appendChild(whatsappLink);
    whatsappLink.click();
    document.body.removeChild(whatsappLink);
  };

  return (
    <section id="contact" className="section-padding bg-card">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <span className="text-sm font-medium text-muted-foreground">Contact</span>
          </div>
          <h2 className="heading-lg mb-4">
            Get In{" "}
            <span className="text-gradient">Touch</span>
          </h2>
          <p className="body-lg">
            Ready to bring yoga and wellness to your institution or organization? Let's discuss how we can work together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div>
            <h3 className="heading-md mb-6">Contact Information</h3>
            <p className="text-muted-foreground mb-8">
              Feel free to reach out for inquiries about yoga programs, workshops, or collaborations. I'm available for sessions across Gujarat.
            </p>

            <div className="space-y-4 mb-8">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="font-medium text-foreground hover:text-accent transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-medium text-foreground">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp Button */}
            <Button
              variant="accent"
              size="lg"
              className="w-full sm:w-auto"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </Button>
          </div>

          {/* Contact Form */}
          <div className="bg-background rounded-2xl border border-border p-6 md:p-8 shadow-soft">
            <h3 className="heading-md mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="organization" className="text-sm font-medium text-foreground mb-2 block">
                    Organization / Institution
                  </label>
                  <Input
                    id="organization"
                    name="organization"
                    placeholder="Company or institution name"
                    value={formData.organization}
                    onChange={handleChange}
                  />
                  {errors.organization && <p className="text-sm text-destructive mt-1">{errors.organization}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="text-sm font-medium text-foreground mb-2 block">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your requirements..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={submitInquiry.isPending}
              >
                {submitInquiry.isPending ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
