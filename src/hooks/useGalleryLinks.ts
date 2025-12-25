import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GalleryLink {
  id: string;
  title: string;
  drive_url: string;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export function useGalleryLinks() {
  return useQuery({
    queryKey: ["gallery-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_links")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as GalleryLink[];
    },
  });
}

export function useAdminGalleryLinks() {
  return useQuery({
    queryKey: ["admin-gallery-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_links")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as GalleryLink[];
    },
  });
}

export function useCreateGalleryLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (link: Omit<GalleryLink, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("gallery_links")
        .insert(link)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-links"] });
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-links"] });
    },
  });
}

export function useUpdateGalleryLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GalleryLink> & { id: string }) => {
      const { data, error } = await supabase
        .from("gallery_links")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-links"] });
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-links"] });
    },
  });
}

export function useDeleteGalleryLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-links"] });
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-links"] });
    },
  });
}
