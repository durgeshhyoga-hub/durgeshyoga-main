-- Create gallery table for storing image URLs (not the images themselves)
CREATE TABLE public.gallery (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_content table for editable text content
CREATE TABLE public.site_content (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    section_key TEXT NOT NULL UNIQUE,
    content JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create page_views table for analytics
CREATE TABLE public.page_views (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_path TEXT NOT NULL,
    visitor_id TEXT,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Gallery policies
CREATE POLICY "Anyone can view active gallery images"
ON public.gallery FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage gallery"
ON public.gallery FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Site content policies
CREATE POLICY "Anyone can view site content"
ON public.site_content FOR SELECT
USING (true);

CREATE POLICY "Admins can manage site content"
ON public.site_content FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Page views policies
CREATE POLICY "Anyone can insert page views"
ON public.page_views FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view page views"
ON public.page_views FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at on gallery
CREATE TRIGGER update_gallery_updated_at
BEFORE UPDATE ON public.gallery
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site content for all sections
INSERT INTO public.site_content (section_key, content) VALUES
('hero', '{"title": "Transform Your Life Through Yoga", "subtitle": "Experience the ancient art of yoga with Durgesh Kumar, a certified yoga instructor dedicated to helping you achieve physical, mental, and spiritual well-being.", "cta_primary": "Start Your Journey", "cta_secondary": "View Services"}'),
('about', '{"title": "About Me", "description": "I am Durgesh Kumar, a passionate yoga practitioner and certified instructor with years of experience in teaching traditional yoga techniques. My journey began with a deep curiosity about the mind-body connection, which led me to study various yoga disciplines including Hatha, Vinyasa, and Pranayama.", "mission": "My mission is to make yoga accessible to everyone, regardless of age, fitness level, or experience. I believe that yoga is not just a physical practice but a way of life that can transform your overall well-being."}'),
('services', '{"title": "Services", "subtitle": "Comprehensive yoga programs tailored to your needs"}'),
('skills', '{"title": "Skills & Expertise", "subtitle": "Areas of specialization in yoga and wellness"}'),
('experience', '{"title": "Experience & Certifications", "subtitle": "My journey in yoga education and practice"}'),
('contact', '{"title": "Get In Touch", "subtitle": "Ready to start your yoga journey? Contact me today.", "address": "Your Address Here", "phone": "+91 XXXXXXXXXX", "email": "contact@example.com"}'),
('gallery', '{"title": "Gallery", "subtitle": "Glimpses of our yoga sessions and events"}');

-- Enable realtime for page_views
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;