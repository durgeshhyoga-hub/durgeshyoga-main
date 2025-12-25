import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  useAdminGalleryLinks,
  useCreateGalleryLink,
  useUpdateGalleryLink,
  useDeleteGalleryLink,
} from "@/hooks/useGalleryLinks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ExternalLink, GripVertical } from "lucide-react";

export default function GalleryLinks() {
  const { data: links = [], isLoading } = useAdminGalleryLinks();
  const createLink = useCreateGalleryLink();
  const updateLink = useUpdateGalleryLink();
  const deleteLink = useDeleteGalleryLink();
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", drive_url: "", display_order: 0 });

  const handleAdd = async () => {
    if (!formData.title || !formData.drive_url) {
      toast({ title: "Error", description: "Title and Drive URL are required", variant: "destructive" });
      return;
    }
    try {
      await createLink.mutateAsync({
        title: formData.title,
        drive_url: formData.drive_url,
        display_order: formData.display_order,
        is_active: true,
      });
      toast({ title: "Success", description: "Gallery link added" });
      setFormData({ title: "", drive_url: "", display_order: 0 });
      setIsAddDialogOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to add link", variant: "destructive" });
    }
  };

  const handleUpdate = async (id: string, updates: Record<string, unknown>) => {
    try {
      await updateLink.mutateAsync({ id, ...updates });
      toast({ title: "Success", description: "Gallery link updated" });
      setEditingLink(null);
    } catch {
      toast({ title: "Error", description: "Failed to update link", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery link?")) return;
    try {
      await deleteLink.mutateAsync(id);
      toast({ title: "Success", description: "Gallery link deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete link", variant: "destructive" });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean | null) => {
    await handleUpdate(id, { is_active: !currentStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gallery Links</h1>
          <p className="text-muted-foreground">Manage Google Drive album buttons for the gallery section</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Gallery Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Button Title</Label>
                <Input
                  placeholder="e.g., Workshops"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Google Drive URL</Label>
                <Input
                  placeholder="https://drive.google.com/..."
                  value={formData.drive_url}
                  onChange={(e) => setFormData({ ...formData, drive_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <Button onClick={handleAdd} disabled={createLink.isPending} className="w-full">
                {createLink.isPending ? "Adding..." : "Add Link"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : links.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No gallery links yet. Add your first Google Drive album link.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <Card key={link.id}>
              <CardContent className="p-4">
                {editingLink === link.id ? (
                  <EditLinkForm
                    link={link}
                    onSave={(updates) => handleUpdate(link.id, updates)}
                    onCancel={() => setEditingLink(null)}
                    isPending={updateLink.isPending}
                  />
                ) : (
                  <div className="flex items-center gap-4">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground">{link.title}</div>
                      <div className="text-sm text-muted-foreground truncate">{link.drive_url || "No URL set"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={link.is_active ?? false}
                        onCheckedChange={() => handleToggleActive(link.id, link.is_active)}
                      />
                      <span className="text-sm text-muted-foreground w-16">
                        {link.is_active ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {link.drive_url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(link.drive_url, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => setEditingLink(link.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function EditLinkForm({
  link,
  onSave,
  onCancel,
  isPending,
}: {
  link: { title: string; drive_url: string; display_order: number | null };
  onSave: (updates: Record<string, unknown>) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState(link.title);
  const [driveUrl, setDriveUrl] = useState(link.drive_url);
  const [displayOrder, setDisplayOrder] = useState(link.display_order ?? 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Google Drive URL</Label>
          <Input value={driveUrl} onChange={(e) => setDriveUrl(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="space-y-2">
          <Label>Order</Label>
          <Input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
            className="w-20"
          />
        </div>
        <div className="flex-1" />
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button
          onClick={() => onSave({ title, drive_url: driveUrl, display_order: displayOrder })}
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
