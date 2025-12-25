import { Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">DK</span>
              </div>
              <span className="font-bold text-lg">Durgesh Koshti</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              District Co-Ordinator at Gujarat State Yog Board. Empowering health, discipline & awareness through yoga.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <a href="#about" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                About
              </a>
              <a href="#services" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Services
              </a>
              <a href="#experience" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Experience
              </a>
              <a href="#contact" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Contact
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+919974454516"
                className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                +91 99744 54516
              </a>
              <a
                href="mailto:Durgeshh.yoga@gmail.com"
                className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                Durgeshh.yoga@gmail.com
              </a>
              <a
                href="https://instagram.com/Durgesh.yoga"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
                @Durgesh.yoga
              </a>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4" />
                Gujarat, India
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {currentYear} Shree Durgesh Kishorbhai Koshti. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
