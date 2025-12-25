import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type GalleryBucketUsage = {
  bucket: "gallery";
  fileCount: number;
  totalBytes: number;
};

async function sumFolderBytes(prefix: string) {
  const { data, error } = await supabase.storage
    .from("gallery")
    .list(prefix, { limit: 1000, offset: 0 });

  if (error) throw error;

  const files = (data ?? []).filter((item) => (item as any)?.metadata?.size != null);
  const totalBytes = files.reduce((acc, item: any) => acc + (Number(item?.metadata?.size) || 0), 0);

  return { fileCount: files.length, totalBytes };
}

export function useGalleryBucketUsage() {
  return useQuery({
    queryKey: ["gallery-bucket-usage"],
    queryFn: async (): Promise<GalleryBucketUsage> => {
      // We store uploads under `gallery/<file>` but also support root-level objects.
      const root = await sumFolderBytes("");
      const nested = await sumFolderBytes("gallery");

      return {
        bucket: "gallery",
        fileCount: root.fileCount + nested.fileCount,
        totalBytes: root.totalBytes + nested.totalBytes,
      };
    },
    staleTime: 60_000,
  });
}
