/**
 * Debris Type Management Component - Admin Debris Calculator Types
 *
 * PURPOSE: Manage debris types for the debris weight calculator
 *
 * FEATURES:
 * - Add/edit/delete debris types
 * - Upload custom icons
 * - Set weight per unit and volume per unit
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
  Scale,
  Edit,
  Trash2,
  Plus,
  MoreHorizontal,
  Save,
  Search,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DebrisType {
  id: string;
  name: string;
  category: string;
  weightPerUnit: number; // pounds per unit
  volumePerUnit: number; // cubic yards per unit
  unit: string; // "cubic yard", "each", "bundle", etc.
  description: string;
  iconEmoji?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DebrisTypeManagement() {
  const { toast } = useToast();
  const [debrisTypes, setDebrisTypes] = useState<DebrisType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<DebrisType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    weightPerUnit: 0,
    volumePerUnit: 1,
    unit: "cubic yard",
    description: "",
    iconEmoji: "",
    isActive: true,
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Construction", label: "Construction Materials" },
    { value: "Metal", label: "Metals" },
    { value: "Organic", label: "Organic/Green Waste" },
    { value: "Earth", label: "Dirt & Stone" },
    { value: "Mixed", label: "Mixed Materials" },
    { value: "Appliances", label: "Appliances" },
    { value: "Electronics", label: "Electronics" },
    { value: "Auto", label: "Automotive" },
  ];

  const units = [
    { value: "cubic yard", label: "Cubic Yard" },
    { value: "each", label: "Each" },
    { value: "bundle", label: "Bundle" },
    { value: "sheet (4x8)", label: "Sheet (4x8)" },
    { value: "square foot", label: "Square Foot" },
    { value: "ton", label: "Ton" },
  ];

  // Load debris types from API or localStorage
  useEffect(() => {
    loadDebrisTypes();
  }, []);

  const loadDebrisTypes = async () => {
    try {
      setIsLoading(true);
      
      // Try to load from API first, fallback to localStorage
      let savedTypes = [];
      try {
        const response = await fetch('/api/admin/debris-types');
        if (response.ok) {
          const data = await response.json();
          savedTypes = data.types || [];
        }
      } catch (error) {
        console.log('API not available, using localStorage');
      }

      // Fallback to localStorage
      if (savedTypes.length === 0) {
        const localTypes = localStorage.getItem('admin-debris-types');
        if (localTypes) {
          savedTypes = JSON.parse(localTypes);
        } else {
          // Initialize with sample data
          savedTypes = [
            {
              id: "concrete",
              name: "Concrete",
              category: "Construction",
              weightPerUnit: 4000,
              volumePerUnit: 1.0,
              unit: "cubic yard",
              description: "Broken concrete, sidewalks, driveways",
              iconEmoji: "🧱",
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "steel",
              name: "Steel",
              category: "Metal",
              weightPerUnit: 15000,
              volumePerUnit: 1.0,
              unit: "cubic yard",
              description: "Steel beams, rebar, appliances",
              iconEmoji: "🔩",
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "yard_waste",
              name: "Yard Waste",
              category: "Organic",
              weightPerUnit: 400,
              volumePerUnit: 1.0,
              unit: "cubic yard",
              description: "Grass, leaves, small branches",
              iconEmoji: "🍃",
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "topsoil",
              name: "Topsoil",
              category: "Earth",
              weightPerUnit: 2200,
              volumePerUnit: 1.0,
              unit: "cubic yard",
              description: "Regular dirt and topsoil",
              iconEmoji: "🟫",
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
        }
      }

      setDebrisTypes(savedTypes);
    } catch (error) {
      console.error('Error loading debris types:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load debris types.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveDebrisTypes = async (updatedTypes: DebrisType[]) => {
    try {
      // Save to localStorage immediately
      localStorage.setItem('admin-debris-types', JSON.stringify(updatedTypes));
      
      // Try to save to API
      try {
        await fetch('/api/admin/debris-types', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ types: updatedTypes }),
        });
      } catch (error) {
        console.log('API save failed, using localStorage only');
      }
      
      setDebrisTypes(updatedTypes);
    } catch (error) {
      console.error('Error saving debris types:', error);
      throw error;
    }
  };

  const filteredTypes = debrisTypes.filter((type) => {
    const matchesSearch = searchQuery === "" ||
      type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || type.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const typeData: DebrisType = {
        id: editingType?.id || `type-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        weightPerUnit: formData.weightPerUnit,
        volumePerUnit: formData.volumePerUnit,
        unit: formData.unit,
        description: formData.description,
        iconEmoji: formData.iconEmoji,
        isActive: formData.isActive,
        createdAt: editingType?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedTypes = editingType
        ? debrisTypes.map(type => type.id === editingType.id ? typeData : type)
        : [...debrisTypes, typeData];

      await saveDebrisTypes(updatedTypes);

      toast({
        title: editingType ? "Debris Type Updated" : "Debris Type Added",
        description: `${formData.name} has been ${editingType ? 'updated' : 'added'} successfully.`,
      });

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save debris type. Please try again.",
      });
    }
  };

  const handleEdit = (type: DebrisType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      category: type.category,
      weightPerUnit: type.weightPerUnit,
      volumePerUnit: type.volumePerUnit,
      unit: type.unit,
      description: type.description,
      iconEmoji: type.iconEmoji || "",
      isActive: type.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (typeId: string) => {
    if (!confirm("Are you sure you want to delete this debris type?")) return;

    try {
      const updatedTypes = debrisTypes.filter(type => type.id !== typeId);
      await saveDebrisTypes(updatedTypes);

      toast({
        title: "Debris Type Deleted",
        description: "The debris type has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete debris type. Please try again.",
      });
    }
  };

  const toggleTypeStatus = async (typeId: string, isActive: boolean) => {
    try {
      const updatedTypes = debrisTypes.map(type => 
        type.id === typeId ? { ...type, isActive, updatedAt: new Date().toISOString() } : type
      );
      await saveDebrisTypes(updatedTypes);

      toast({
        title: `Debris Type ${isActive ? 'Enabled' : 'Disabled'}`,
        description: `The debris type has been ${isActive ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update debris type status.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      weightPerUnit: 0,
      volumePerUnit: 1,
      unit: "cubic yard",
      description: "",
      iconEmoji: "",
      isActive: true,
    });
    setEditingType(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Construction: "bg-orange-100 text-orange-800",
      Metal: "bg-gray-100 text-gray-800",
      Organic: "bg-green-100 text-green-800",
      Earth: "bg-amber-100 text-amber-800",
      Mixed: "bg-purple-100 text-purple-800",
      Appliances: "bg-blue-100 text-blue-800",
      Electronics: "bg-indigo-100 text-indigo-800",
      Auto: "bg-red-100 text-red-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Debris Type Management</h1>
          <p className="text-muted-foreground">
            Manage debris types for the debris weight calculator
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Debris Type
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Types</p>
                <p className="text-2xl font-bold">{debrisTypes.length}</p>
              </div>
              <Scale className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Types</p>
                <p className="text-2xl font-bold">
                  {debrisTypes.filter(type => type.isActive).length}
                </p>
              </div>
              <Scale className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">
                  {new Set(debrisTypes.map(type => type.category)).size}
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
          <CardTitle>Filter Debris Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search debris types..."
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

      {/* Debris Types Table */}
      <Card>
        <CardHeader>
          <CardTitle>Debris Types ({filteredTypes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading debris types...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Debris Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Weight per Unit</TableHead>
                  <TableHead>Volume per Unit</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{type.iconEmoji || "🔲"}</span>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          {type.description && (
                            <div className="text-sm text-muted-foreground">
                              {type.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(type.category)}>
                        {type.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{type.weightPerUnit.toLocaleString()} lbs</TableCell>
                    <TableCell>{type.volumePerUnit}</TableCell>
                    <TableCell>{type.unit}</TableCell>
                    <TableCell>
                      <Badge className={type.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {type.isActive ? "Active" : "Inactive"}
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
                          <DropdownMenuItem onClick={() => handleEdit(type)}>
                            <Edit className="w-3 h-3 mr-2" />
                            Edit Type
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => toggleTypeStatus(type.id, !type.isActive)}
                          >
                            {type.isActive ? "Disable" : "Enable"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(type.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-2" />
                            Delete Type
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredTypes.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No debris types found.</p>
              <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                Add Your First Debris Type
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
              {editingType ? "Edit Debris Type" : "Add New Debris Type"}
            </DialogTitle>
            <DialogDescription>
              {editingType 
                ? "Update the debris type details below."
                : "Add a new debris type for the weight calculator."
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Debris Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Concrete"
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
                <Label htmlFor="weight">Weight per Unit (lbs) *</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weightPerUnit}
                  onChange={(e) => setFormData(prev => ({ ...prev, weightPerUnit: parseInt(e.target.value) || 0 }))}
                  placeholder="4000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="volume">Volume per Unit *</Label>
                <Input
                  id="volume"
                  type="number"
                  step="0.1"
                  value={formData.volumePerUnit}
                  onChange={(e) => setFormData(prev => ({ ...prev, volumePerUnit: parseFloat(e.target.value) || 1 }))}
                  placeholder="1.0"
                  required
                />
              </div>

              <div>
                <Label htmlFor="unit">Unit *</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input
                id="icon"
                value={formData.iconEmoji}
                onChange={(e) => setFormData(prev => ({ ...prev, iconEmoji: e.target.value }))}
                placeholder="🧱"
                maxLength={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use an emoji to represent this debris type (e.g., 🧱, 🔩, 🍃)
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this debris type..."
                rows={3}
                required
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
                {editingType ? "Update Type" : "Add Type"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
