"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  Copy,
  CheckCircle2,
  AlertCircle,
  Brain,
  Users,
  Target,
  Zap,
} from "lucide-react";
import { 
  getScreeningTemplates, 
  createScreeningTemplate, 
  updateScreeningTemplate, 
  deleteScreeningTemplate,
  initializeDefaultTemplates 
} from "@/actions/screening-template-actions";

interface ScreeningTemplate {
  id: string;
  name: string;
  description?: string;
  type: string;
  systemPrompt: string;
  culturalValues: string[];
  evaluationCriteria: Record<string, number>;
  requiredSkillsWeight: number;
  culturalFitWeight: number;
  minPassingScore: number;
  autoRejectThreshold?: number | null;
  isDefault: boolean;
  isActive: boolean;
  _count: { jobs: number };
}

export default function SettingsPage() {
  const [templates, setTemplates] = useState<ScreeningTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ScreeningTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "CUSTOM" as const,
    systemPrompt: "",
    culturalValues: [] as string[],
    evaluationCriteria: {} as Record<string, number>,
    requiredSkillsWeight: 0.5,
    culturalFitWeight: 0.5,
    minPassingScore: 60,
    autoRejectThreshold: null as number | null,
    isDefault: false,
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const result = await getScreeningTemplates();
      if (result.success) {
        setTemplates(result.data || []);
      }
    } catch (error) {
      console.error("Failed to load templates:", error);
    }
  };

  const handleCreateTemplate = async () => {
    setLoading(true);
    try {
      const result = await createScreeningTemplate(formData);
      if (result.success) {
        await loadTemplates();
        resetForm();
      }
    } catch (error) {
      console.error("Failed to create template:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return;
    
    setLoading(true);
    try {
      const result = await updateScreeningTemplate(selectedTemplate.id, formData);
      if (result.success) {
        await loadTemplates();
        setIsEditing(false);
        setSelectedTemplate(null);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to update template:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    
    setLoading(true);
    try {
      const result = await deleteScreeningTemplate(id);
      if (result.success) {
        await loadTemplates();
      }
    } catch (error) {
      console.error("Failed to delete template:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeDefaults = async () => {
    setLoading(true);
    try {
      const result = await initializeDefaultTemplates();
      if (result.success) {
        await loadTemplates();
      }
    } catch (error) {
      console.error("Failed to initialize templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "CUSTOM",
      systemPrompt: "",
      culturalValues: [],
      evaluationCriteria: {},
      requiredSkillsWeight: 0.5,
      culturalFitWeight: 0.5,
      minPassingScore: 60,
      autoRejectThreshold: null,
      isDefault: false,
    });
  };

  const startEdit = (template: ScreeningTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || "",
      type: template.type as any,
      systemPrompt: template.systemPrompt,
      culturalValues: template.culturalValues,
      evaluationCriteria: template.evaluationCriteria,
      requiredSkillsWeight: template.requiredSkillsWeight,
      culturalFitWeight: template.culturalFitWeight,
      minPassingScore: template.minPassingScore,
      autoRejectThreshold: template.autoRejectThreshold || null,
      isDefault: template.isDefault,
    });
    setIsEditing(true);
  };

  const addCulturalValue = () => {
    const value = prompt("Enter cultural value:");
    if (value && !formData.culturalValues.includes(value)) {
      setFormData(prev => ({
        ...prev,
        culturalValues: [...prev.culturalValues, value]
      }));
    }
  };

  const removeCulturalValue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      culturalValues: prev.culturalValues.filter((_, i) => i !== index)
    }));
  };

  const addCriterion = () => {
    const name = prompt("Enter criteria name:");
    const weight = prompt("Enter weight (0-100):");
    if (name && weight) {
      setFormData(prev => ({
        ...prev,
        evaluationCriteria: {
          ...prev.evaluationCriteria,
          [name]: parseInt(weight)
        }
      }));
    }
  };

  const removeCriterion = (name: string) => {
    setFormData(prev => {
      const newCriteria = { ...prev.evaluationCriteria };
      delete newCriteria[name];
      return {
        ...prev,
        evaluationCriteria: newCriteria
      };
    });
  };

  return (
    <div className="space-y-6 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your AI screening templates and system configuration</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleInitializeDefaults}
            disabled={loading}
            className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Settings className="h-4 w-4 mr-2" />
            Initialize Defaults
          </Button>
          <Button 
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="bg-brand-600 hover:bg-brand-700 text-white dark:bg-brand-700 dark:hover:bg-brand-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Templates Grid */}
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="relative dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg dark:text-white">{template.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.description}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {template.isDefault && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Default
                      </Badge>
                    )}
                    {template.isActive ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500 dark:text-gray-400 dark:border-gray-600">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">{template.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Cultural Values:</span>
                    <span className="dark:text-gray-300">{template.culturalValues.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Technical Weight:</span>
                    <span className="dark:text-gray-300">{Math.round(template.requiredSkillsWeight * 100)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Cultural Weight:</span>
                    <span className="dark:text-gray-300">{Math.round(template.culturalFitWeight * 100)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Min Passing Score:</span>
                    <span className="dark:text-gray-300">{template.minPassingScore}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Used by Jobs:</span>
                    <span className="dark:text-gray-300">{template._count.jobs}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4 pt-4 border-t dark:border-gray-700">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => startEdit(template)}
                    className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {!template.isDefault && template._count.jobs === 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Template Form */}
      {isEditing && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center dark:text-white">
              <Brain className="h-5 w-5 mr-2" />
              {selectedTemplate ? "Edit Template" : "Create Template"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Japanese Culture Fit"
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                >
                  <option value="TECHNICAL_FIT">Technical Fit</option>
                  <option value="CULTURAL_FIT">Cultural Fit</option>
                  <option value="BALANCED">Balanced</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of when to use this template"
                className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              />
            </div>

            {/* System Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                System Prompt
              </label>
              <Textarea
                value={formData.systemPrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                rows={6}
                placeholder="Instructions for AI on how to evaluate candidates..."
                className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              />
            </div>

            {/* Cultural Values */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cultural Values
                </label>
                <Button variant="outline" size="sm" onClick={addCulturalValue} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Value
                </Button>
              </div>
              <div className="space-y-2">
                {formData.culturalValues.map((value, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border dark:border-gray-700 rounded dark:bg-gray-900">
                    <span className="dark:text-gray-300">{value}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeCulturalValue(index)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluation Criteria */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Evaluation Criteria
                </label>
                <Button variant="outline" size="sm" onClick={addCriterion} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Criterion
                </Button>
              </div>
              <div className="space-y-2">
                {Object.entries(formData.evaluationCriteria).map(([name, weight]) => (
                  <div key={name} className="flex items-center justify-between p-2 border dark:border-gray-700 rounded dark:bg-gray-900">
                    <span className="dark:text-gray-300">{name}: {weight}%</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeCriterion(name)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Weights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Technical Skills Weight
                </label>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.requiredSkillsWeight}
                  onChange={(e) => setFormData(prev => ({ ...prev, requiredSkillsWeight: parseFloat(e.target.value) }))}
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cultural Fit Weight
                </label>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.culturalFitWeight}
                  onChange={(e) => setFormData(prev => ({ ...prev, culturalFitWeight: parseFloat(e.target.value) }))}
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Thresholds */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Passing Score
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.minPassingScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, minPassingScore: parseInt(e.target.value) }))}
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auto-Reject Threshold (optional)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.autoRejectThreshold || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    autoRejectThreshold: e.target.value ? parseInt(e.target.value) : null 
                  }))}
                  placeholder="Leave empty to disable auto-reject"
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 pt-4 border-t dark:border-gray-700">
              <Button
                onClick={selectedTemplate ? handleUpdateTemplate : handleCreateTemplate}
                disabled={loading || !formData.name}
                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white dark:bg-brand-700 dark:hover:bg-brand-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {selectedTemplate ? "Update Template" : "Create Template"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedTemplate(null);
                  resetForm();
                }}
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}