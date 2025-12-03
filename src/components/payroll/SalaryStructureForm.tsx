"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DollarSign, Plus, Save, X } from "lucide-react";
import { createSalaryStructure } from "@/actions/salary-actions";
import { toast } from "sonner";

interface SalaryStructureFormProps {
  employeeId: string;
  employeeName: string;
  onSuccess?: () => void;
}

export function SalaryStructureForm({
  employeeId,
  employeeName,
  onSuccess,
}: SalaryStructureFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    basicSalary: "",
    hra: "",
    transportAllowance: "5000",
    medicalAllowance: "3000",
    specialAllowance: "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createSalaryStructure({
        employeeId,
        basicSalary: parseFloat(formData.basicSalary),
        hra: formData.hra ? parseFloat(formData.hra) : undefined,
        transportAllowance: parseFloat(formData.transportAllowance),
        medicalAllowance: parseFloat(formData.medicalAllowance),
        specialAllowance: parseFloat(formData.specialAllowance),
      });

      if (result.success) {
        toast.success("Salary structure created successfully!");
        setOpen(false);
        setFormData({
          basicSalary: "",
          hra: "",
          transportAllowance: "5000",
          medicalAllowance: "3000",
          specialAllowance: "0",
        });
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to create salary structure");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const calculateHRA = () => {
    if (formData.basicSalary) {
      const basic = parseFloat(formData.basicSalary);
      const hra = (basic * 0.4).toFixed(2);
      setFormData({ ...formData, hra });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-600 hover:bg-brand-700">
          <DollarSign className="h-4 w-4 mr-2" />
          Set Salary Structure
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Set Salary Structure</DialogTitle>
          <DialogDescription>
            Configure salary components for {employeeName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="basicSalary">Basic Salary *</Label>
              <Input
                id="basicSalary"
                type="number"
                step="0.01"
                required
                value={formData.basicSalary}
                onChange={(e) =>
                  setFormData({ ...formData, basicSalary: e.target.value })
                }
                placeholder="Enter basic salary"
              />
            </div>

            <div>
              <Label htmlFor="hra">
                HRA (House Rent Allowance)
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={calculateHRA}
                  className="ml-2 h-auto p-0 text-xs"
                >
                  Auto-calculate (40%)
                </Button>
              </Label>
              <Input
                id="hra"
                type="number"
                step="0.01"
                value={formData.hra}
                onChange={(e) => setFormData({ ...formData, hra: e.target.value })}
                placeholder="Leave empty for auto-calculation"
              />
            </div>

            <div>
              <Label htmlFor="transportAllowance">Transport Allowance</Label>
              <Input
                id="transportAllowance"
                type="number"
                step="0.01"
                value={formData.transportAllowance}
                onChange={(e) =>
                  setFormData({ ...formData, transportAllowance: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="medicalAllowance">Medical Allowance</Label>
              <Input
                id="medicalAllowance"
                type="number"
                step="0.01"
                value={formData.medicalAllowance}
                onChange={(e) =>
                  setFormData({ ...formData, medicalAllowance: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="specialAllowance">Special Allowance</Label>
              <Input
                id="specialAllowance"
                type="number"
                step="0.01"
                value={formData.specialAllowance}
                onChange={(e) =>
                  setFormData({ ...formData, specialAllowance: e.target.value })
                }
              />
            </div>
          </div>

          {formData.basicSalary && (
            <Card className="bg-brand-50 dark:bg-brand-900/20 border-brand-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Salary Breakdown Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Basic Salary:</span>
                  <span className="font-semibold">
                    ${parseFloat(formData.basicSalary).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>HRA:</span>
                  <span className="font-semibold">
                    $
                    {(
                      formData.hra
                        ? parseFloat(formData.hra)
                        : parseFloat(formData.basicSalary) * 0.4
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Transport:</span>
                  <span className="font-semibold">
                    ${parseFloat(formData.transportAllowance).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Medical:</span>
                  <span className="font-semibold">
                    ${parseFloat(formData.medicalAllowance).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Special:</span>
                  <span className="font-semibold">
                    ${parseFloat(formData.specialAllowance).toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-brand-300 dark:border-brand-700 pt-2 mt-2 flex justify-between font-bold text-brand-700 dark:text-brand-400">
                  <span>Gross Salary:</span>
                  <span>
                    $
                    {(
                      parseFloat(formData.basicSalary) +
                      (formData.hra
                        ? parseFloat(formData.hra)
                        : parseFloat(formData.basicSalary) * 0.4) +
                      parseFloat(formData.transportAllowance) +
                      parseFloat(formData.medicalAllowance) +
                      parseFloat(formData.specialAllowance)
                    ).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700"
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Structure"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
