import { useState, useRef } from "react";
import { Plus, Trash2, Edit2, ExternalLink, Image as ImageIcon, Upload, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getDirectImageUrl } from "@/lib/imageUtils";
import { useGalleryBucketUsage } from "@/hooks/useGalleryBucketUsage";
import {
  useAdminGallery,
  useCreateGalleryImage,
  useUpdateGalleryImage,
  useDeleteGalleryImage,
  GalleryImage,
} from "@/hooks/useGallery";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function Gallery() {
  const { toast } = useToast();
  const { data: images = [], isLoading } = useAdminGallery();
  const {
    data: bucketUsage,
    isLoading: isBucketUsageLoading,
    isFetching: isBucketUsageFetching,
    refetch: refetchBucketUsage,
  } = useGalleryBucketUsage();
  const createImage = useCreateGalleryImage();
  const updateImage = useUpdateGalleryImage();
  const deleteImage = useDeleteGalleryImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [uploadTab, setUploadTab] = useState<string>("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    image_url: "",
    title: "",
    description: "",
    is_active: true,
  });

  const openAddDialog = () => {
    setEditingImage(null);
    setFormData({ image_url: "", title: "", description: "", is_active: true });
    setUploadTab("upload");
    setIsDialogOpen(true);
  };

  const openEditDialog = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      image_url: image.image_url,
      title: image.title || "",
      description: image.description || "",
      is_active: image.is_active,
    });
    setUploadTab("link");
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Image must be less than 5MB", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      toast({ title: "Image uploaded successfully" });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ 
        title: "Upload failed", 
        description: error.message || "Failed to upload image", 
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image_url.trim()) {
      toast({ title: "Error", description: "Please upload an image or provide a URL", variant: "destructive" });
      return;
    }

    // Convert Google Drive URLs to direct format
    const directUrl = getDirectImageUrl(formData.image_url.trim());

    try {
      if (editingImage) {
        await updateImage.mutateAsync({
          id: editingImage.id,
          image_url: directUrl,
          title: formData.title.trim() || null,
          description: formData.description.trim() || null,
          is_active: formData.is_active,
        });
        toast({ title: "Image updated successfully" });
      } else {
        await createImage.mutateAsync({
          image_url: directUrl,
          title: formData.title.trim() || null,
          description: formData.description.trim() || null,
          is_active: formData.is_active,
          display_order: images.length,
        });
        toast({ title: "Image added successfully" });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save image", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteImage.mutateAsync(id);
      toast({ title: "Image deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete image", variant: "destructive" });
    }
  };

  const toggleActive = async (image: GalleryImage) => {
    try {
      await updateImage.mutateAsync({ id: image.id, is_active: !image.is_active });
      toast({ title: image.is_active ? "Image hidden" : "Image visible" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update image", variant: "destructive" });
    }
  };

  // Get display URL for preview
  const previewUrl = getDirectImageUrl(formData.image_url);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gallery</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage photos for your website gallery</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
            <div className="leading-tight">
              <p className="text-xs text-muted-foreground">Storage used</p>
              <p className="text-sm font-medium text-foreground">
                {isBucketUsageLoading
                  ? "Loading…"
                  : bucketUsage
                    ? `${formatBytes(bucketUsage.totalBytes)} • ${bucketUsage.fileCount} files`
                    : "—"}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetchBucketUsage()}
              disabled={isBucketUsageFetching}
            >
              {isBucketUsageFetching ? "Refreshing…" : "Refresh"}
            </Button>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading gallery...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No images yet. Add your first image!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={`group relative rounded-xl overflow-hidden border ${
                image.is_active ? "border-border" : "border-destructive/50 opacity-60"
              }`}
            >
              <div className="aspect-square bg-secondary">
                <img
                  src={getDirectImageUrl(image.image_url)}
                  alt={image.title || "Gallery image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary" onClick={() => openEditDialog(image)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(image.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => window.open(getDirectImageUrl(image.image_url), "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background/80 to-transparent">
                  <p className="text-xs font-medium text-foreground truncate">{image.title}</p>
                </div>
              )}
              {!image.is_active && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-destructive/80 rounded text-xs text-destructive-foreground">
                  Hidden
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingImage ? "Edit Image" : "Add New Image"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingImage && (
              <Tabs value={uploadTab} onValueChange={setUploadTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="link" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    URL/Link
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="mt-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label 
                      htmlFor="image-upload" 
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {isUploading ? "Uploading..." : "Click to upload image"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Max 5MB, JPG/PNG/GIF
                      </span>
                    </label>
                  </div>
                </TabsContent>
                <TabsContent value="link" className="mt-4">
                  <div>
                    <Input
                      placeholder="https://drive.google.com/file/d/..."
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Paste any image URL or Google Drive share link
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {editingImage && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Image URL
                </label>
                <Input
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Title (optional)
              </label>
              <Input
                placeholder="Yoga Workshop at XYZ College"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Description (optional)
              </label>
              <Textarea
                placeholder="Brief description of the image"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Visible on website</label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            {previewUrl && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Preview</label>
                <div className="aspect-video bg-secondary rounded-lg overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createImage.isPending || updateImage.isPending || isUploading}>
                {editingImage ? "Update" : "Add"} Image
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
