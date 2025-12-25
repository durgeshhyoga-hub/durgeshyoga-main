-- Create gallery_links table for multiple Google Drive album buttons
CREATE TABLE public.gallery_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  drive_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_links ENABLE ROW LEVEL SECURITY;

-- Anyone can view active gallery links
CREATE POLICY "Anyone can view active gallery links"
ON public.gallery_links
FOR SELECT
USING (is_active = true);

-- Admins can manage gallery links
CREATE POLICY "Admins can manage gallery links"
ON public.gallery_links
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_gallery_links_updated_at
BEFORE UPDATE ON public.gallery_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default links
INSERT INTO public.gallery_links (title, drive_url, display_order, is_active) VALUES
('Workshops', '', 1, false),
('Events', '', 2, false),
('Training Sessions', '', 3, false);