/**
 * Item Management Component - Admin Pricing Calculator Items
 *
 * PURPOSE: Manage debris items for the pricing calculator
 *
 * FEATURES:
 * - Add/edit/delete debris items
 * - Upload custom icons
 * - Set weights, times, and pricing details
 * - Categories and descriptions
 * - Live preview of changes
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  Edit,
  Trash2,
  Plus,
  MoreHorizontal,
  Upload,
  Save,
  X,
  Search,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DebrisItem {
  id: string;
  name: string;
  category: string;
  weightPerItem: number; // tons
  volumePerItem: number; // cubic yards
  loadingTimePerItem: number; // minutes
  iconUrl?: string;
  iconEmoji?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ItemManagement() {
  const { toast } = useToast();
  const [items, setItems] = useState<DebrisItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DebrisItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    weightPerItem: 0,
    volumePerItem: 0,
    loadingTimePerItem: 0,
    iconEmoji: "",
    description: "",
    isActive: true,
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Furniture", label: "Furniture" },
    { value: "Appliances", label: "Appliances" },
    { value: "Electronics", label: "Electronics" },
    { value: "Construction", label: "Construction Debris" },
    { value: "Yard Waste", label: "Yard Waste" },
    { value: "Automotive", label: "Automotive" },
    { value: "Household", label: "Household Items" },
    { value: "Hazardous", label: "Hazardous Materials" },
  ];

  // Load items from API or localStorage
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      
      // Try to load from API first, fallback to localStorage
      let savedItems = [];
      try {
        const response = await fetch('/api/admin/debris-items');
        if (response.ok) {
          const data = await response.json();
          savedItems = data.items || [];
        }
      } catch (error) {
        console.log('API not available, using localStorage');
      }

      // Fallback to localStorage
      if (savedItems.length === 0) {
        const localItems = localStorage.getItem('admin-debris-items');
        if (localItems) {
          savedItems = JSON.parse(localItems);
        } else {
          // Initialize with sample data
          savedItems = [
            {
              id: "sample-1",
              name: "Reclining Couch",
              category: "Furniture",
              weightPerItem: 0.12,
              volumePerItem: 4.5,
              loadingTimePerItem: 22,
              iconEmoji: "🛋️",
              description: "Large reclining sofa, heavy and bulky",
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "sample-2", 
              name: "Refrigerator",
              category: "Appliances",
              weightPerItem: 0.18,
              volumePerItem: 3.2,
              loadingTimePerItem: 35,
              iconEmoji: "❄️",
              description: "Standard size refrigerator, requires careful handling",
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "sample-3",
              name: "Hot Tub (4-6 person)",
              category: "Appliances",
              weightPerItem: 0.8,
              volumePerItem: 6.5,
              loadingTimePerItem: 120,
              iconEmoji: "🛁",
              description: "Medium hot tub, requires special equipment",
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
        }
      }

      setItems(savedItems);
    } catch (error) {
      console.error('Error loading items:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load debris items.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveItems = async (updatedItems: DebrisItem[]) => {
    try {
      // Save to localStorage immediately
      localStorage.setItem('admin-debris-items', JSON.stringify(updatedItems));
      
      // Try to save to API
      try {
        await fetch('/api/admin/debris-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: updatedItems }),
        });
      } catch (error) {
        console.log('API save failed, using localStorage only');
      }
      
      setItems(updatedItems);
    } catch (error) {
      console.error('Error saving items:', error);
      throw error;
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const itemData: DebrisItem = {
        id: editingItem?.id || `item-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        weightPerItem: formData.weightPerItem,
        volumePerItem: formData.volumePerItem,
        loadingTimePerItem: formData.loadingTimePerItem,
        iconEmoji: formData.iconEmoji,
        description: formData.description,
        isActive: formData.isActive,
        createdAt: editingItem?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedItems = editingItem
        ? items.map(item => item.id === editingItem.id ? itemData : item)
        : [...items, itemData];

      await saveItems(updatedItems);

      toast({
        title: editingItem ? "Item Updated" : "Item Added",
        description: `${formData.name} has been ${editingItem ? 'updated' : 'added'} successfully.`,
      });

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save item. Please try again.",
      });
    }
  };

  const handleEdit = (item: DebrisItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      weightPerItem: item.weightPerItem,
      volumePerItem: item.volumePerItem,
      loadingTimePerItem: item.loadingTimePerItem,
      iconEmoji: item.iconEmoji || "",
      description: item.description || "",
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const updatedItems = items.filter(item => item.id !== itemId);
      await saveItems(updatedItems);

      toast({
        title: "Item Deleted",
        description: "The debris item has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete item. Please try again.",
      });
    }
  };

  const toggleItemStatus = async (itemId: string, isActive: boolean) => {
    try {
      const updatedItems = items.map(item => 
        item.id === itemId ? { ...item, isActive, updatedAt: new Date().toISOString() } : item
      );
      await saveItems(updatedItems);

      toast({
        title: `Item ${isActive ? 'Enabled' : 'Disabled'}`,
        description: `The item has been ${isActive ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update item status.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      weightPerItem: 0,
      volumePerItem: 0,
      loadingTimePerItem: 0,
      iconEmoji: "",
      description: "",
      isActive: true,
    });
    setEditingItem(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Furniture: "bg-blue-100 text-blue-800",
      Appliances: "bg-green-100 text-green-800",
      Electronics: "bg-purple-100 text-purple-800",
      Construction: "bg-orange-100 text-orange-800",
      "Yard Waste": "bg-emerald-100 text-emerald-800",
      Automotive: "bg-red-100 text-red-800",
      Household: "bg-yellow-100 text-yellow-800",
      Hazardous: "bg-red-100 text-red-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Pricing Calculator Items</h1>
          <p className="text-muted-foreground">
            Manage debris items for the pricing calculator
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </div>
              <Package className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Items</p>
                <p className="text-2xl font-bold">
                  {items.filter(item => item.isActive).length}
                </p>
              </div>
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">
                  {new Set(items.map(item => item.category)).size}
                </p>
              </div>
              <Filter className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Items ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading items...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Weight (tons)</TableHead>
                  <TableHead>Volume (yd³)</TableHead>
                  <TableHead>Loading Time (min)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.iconEmoji || "📦"}</span>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.weightPerItem}</TableCell>
                    <TableCell>{item.volumePerItem}</TableCell>
                    <TableCell>{item.loadingTimePerItem}</TableCell>
                    <TableCell>
                      <Badge className={item.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="w-3 h-3 mr-2" />
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => toggleItemStatus(item.id, !item.isActive)}
                          >
                            {item.isActive ? "Disable" : "Enable"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-2" />
                            Delete Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredItems.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No items found.</p>
              <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                Add Your First Item
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Item" : "Add New Item"}
            </DialogTitle>
            <DialogDescription>
              {editingItem 
                ? "Update the debris item details below."
                : "Add a new debris item for the pricing calculator."
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Reclining Couch"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="weight">Weight (tons) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weightPerItem}
                  onChange={(e) => setFormData(prev => ({ ...prev, weightPerItem: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.12"
                  required
                />
              </div>

              <div>
                <Label htmlFor="volume">Volume (cubic yards) *</Label>
                <Input
                  id="volume"
                  type="number"
                  step="0.1"
                  value={formData.volumePerItem}
                  onChange={(e) => setFormData(prev => ({ ...prev, volumePerItem: parseFloat(e.target.value) || 0 }))}
                  placeholder="4.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="time">Loading Time (minutes) *</Label>
                <Input
                  id="time"
                  type="number"
                  value={formData.loadingTimePerItem}
                  onChange={(e) => setFormData(prev => ({ ...prev, loadingTimePerItem: parseInt(e.target.value) || 0 }))}
                  placeholder="22"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input
                id="icon"
                value={formData.iconEmoji}
                onChange={(e) => setFormData(prev => ({ ...prev, iconEmoji: e.target.value }))}
                placeholder="🛋️"
                maxLength={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use an emoji to represent this item (e.g., 🛋️, ❄️, 🛁)
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the item..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? "Update Item" : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
