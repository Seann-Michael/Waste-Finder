import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Tag, X } from "lucide-react";

interface BlogPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    title: string;
    excerpt: string;
    content: string;
    author: string;
    tags: string;
    categories: string[];
    featuredImage: string;
  };
  categories: Array<{
    id: string;
    name: string;
  }>;
}

export default function BlogPreview({ 
  open, 
  onOpenChange, 
  formData, 
  categories 
}: BlogPreviewProps) {
  const getCategoryNames = (categoryIds: string[]) => {
    return categories
      .filter(cat => categoryIds.includes(cat.id))
      .map(cat => cat.name);
  };

  const tags = formData.tags.split(",").map(tag => tag.trim()).filter(Boolean);
  const categoryNames = getCategoryNames(formData.categories);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Blog Post Preview</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Featured Image */}
          {formData.featuredImage && (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={formData.featuredImage}
                alt={formData.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {formData.title || "Untitled Post"}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{formData.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Categories and Tags */}
            {(categoryNames.length > 0 || tags.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {categoryNames.map((category) => (
                  <Badge key={category} variant="default">
                    {category}
                  </Badge>
                ))}
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Excerpt */}
          {formData.excerpt && (
            <div>
              <p className="text-lg text-muted-foreground italic leading-relaxed">
                {formData.excerpt}
              </p>
              <Separator className="my-6" />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: formData.content || "<p>No content yet...</p>" }}
              className="text-foreground leading-relaxed"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
