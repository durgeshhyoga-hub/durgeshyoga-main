import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteContent {
  id: string;
  section_key: string;
  content: Record<string, string>;
  updated_at: string;
  updated_by: string | null;
}

export function useSiteContent(sectionKey?: string) {
  return useQuery({
    queryKey: ["site-content", sectionKey],
    queryFn: async () => {
      let query = supabase.from("site_content").select("*");
      
      if (sectionKey) {
        query = query.eq("section_key", sectionKey);
        const { data, error } = await query.maybeSingle();
        if (error) throw error;
        return data as SiteContent | null;
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as SiteContent[];
    },
  });
}

export function useAllSiteContent() {
  return useQuery({
    queryKey: ["site-content-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error;
      
      const contentMap: Record<string, Record<string, string>> = {};
      (data as SiteContent[]).forEach((item) => {
        contentMap[item.section_key] = item.content;
      });
      return contentMap;
    },
  });
}

export function useUpdateSiteContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sectionKey, content }: { sectionKey: string; content: Record<string, string> }) => {
      const { data, error } = await supabase
        .from("site_content")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("section_key", sectionKey)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      queryClient.invalidateQueries({ queryKey: ["site-content-all"] });
    },
  });
}
