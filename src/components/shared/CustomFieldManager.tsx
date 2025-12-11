"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, Plus, Trash2, Loader2 } from "lucide-react";
import { createCustomFieldDefinition, getCustomFieldDefinitions, deleteCustomFieldDefinition, type CustomFieldType } from "@/actions/custom-field-actions";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

interface CustomFieldManagerProps {
  entityType: string;
  trigger?: React.ReactNode;
}

export function CustomFieldManager({ entityType, trigger }: CustomFieldManagerProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // New field state
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<CustomFieldType>("TEXT");
  const [creating, setCreating] = useState(false);

  // Fetch fields when dialog opens
  useEffect(() => {
    if (open && user?.publicMetadata?.companyId) {
      fetchFields();
    }
  }, [open, user]);

  const fetchFields = async () => {
    const companyId = user?.publicMetadata?.companyId as string;
    if (!companyId) return;
    
    setLoading(true);
    const result = await getCustomFieldDefinitions(companyId, entityType);
    if (result.success) {
      setFields(result.data || []);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newFieldName.trim()) return;
    
    setCreating(true);
    const companyId = user?.publicMetadata?.companyId as string;
    
    // Generate a safe key from the name (e.g., "T-Shirt Size" -> "t_shirt_size")
    const nameKey = newFieldName.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    
    const result = await createCustomFieldDefinition({
      entityType,
      companyId,
      name: nameKey,
      label: newFieldName,
      type: newFieldType,
    });

    if (result.success) {
      toast.success("Field added successfully");
      setNewFieldName("");
      fetchFields();
    } else {
      toast.error(result.error);
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will delete the field definition but existing data may remain.")) {
      const result = await deleteCustomFieldDefinition(id);
      if (result.success) {
        toast.success("Field deleted");
        fetchFields();
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Settings2 className="h-4 w-4 mr-2" />
            Customize
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Customize Fields</DialogTitle>
          <DialogDescription>
            Add or remove custom fields for this page.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Add New Field</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Field Name</Label>
                <Input 
                  placeholder="e.g. T-Shirt Size" 
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newFieldType} onValueChange={(v) => setNewFieldType(v as CustomFieldType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEXT">Text</SelectItem>
                    <SelectItem value="NUMBER">Number</SelectItem>
                    <SelectItem value="DATE">Date</SelectItem>
                    {/* <SelectItem value="SELECT">Select</SelectItem> */} 
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleCreate} disabled={creating || !newFieldName} className="w-full">
              {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Field
            </Button>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Existing Fields</h4>
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
              </div>
            ) : fields.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-2">No custom fields defined.</p>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {fields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between p-2 rounded-md border bg-zinc-50 dark:bg-zinc-900">
                    <div>
                      <p className="text-sm font-medium">{field.label}</p>
                      <p className="text-xs text-zinc-500">{field.type}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(field.id)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
