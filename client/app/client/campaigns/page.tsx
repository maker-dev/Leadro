"use client";
import { usePageContext } from "@/context/PageTitleContext";
import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaCog, FaChevronUp, FaChevronDown, FaEllipsisV } from "react-icons/fa";
import NormalTextInput from "@/components/ui/inputs/NormalTextInput";
import NormalTextAreaInput from "@/components/ui/inputs/NormalTextAreaInput";

interface Campaign {
  id: string;
  title: string;
  description: string;
  fields: CampaignField[];
}

interface CampaignField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string;
}

const CampaignsPage = () => {
  const { setLabel, setTitle } = usePageContext();
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [newCampaignTitle, setNewCampaignTitle] = useState("");
  const [newCampaignDescription, setNewCampaignDescription] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [newField, setNewField] = useState<Omit<CampaignField, 'id'>>({
    label: "New Field",
    type: "Text Input",
    required: false,
    options: "",
  });

  useEffect(() => {
    setLabel("Campaigns");
    setTitle("Campaigns");
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      setEditingTitle(selectedCampaign.title);
      setEditingDescription(selectedCampaign.description);
    }
  }, [selectedCampaign]);

  const createCampaign = () => {
    if (!newCampaignTitle.trim()) return;

    const newCampaign: Campaign = {
      id: Date.now().toString(),
      title: newCampaignTitle,
      description: newCampaignDescription,
      fields: [],
    };

    setCampaigns([...campaigns, newCampaign]);
    setSelectedCampaign(newCampaign);
    setNewCampaignTitle("");
    setNewCampaignDescription("");
  };

  const deleteCampaign = (campaignId: string) => {
    const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);
    setCampaigns(updatedCampaigns);
    
    if (selectedCampaign?.id === campaignId) {
      setSelectedCampaign(updatedCampaigns.length > 0 ? updatedCampaigns[0] : null);
    }
  };

  const updateCampaign = () => {
    if (!selectedCampaign) return;

    const updatedCampaign = {
      ...selectedCampaign,
      title: editingTitle,
      description: editingDescription,
    };

    setCampaigns(campaigns.map(c => c.id === selectedCampaign.id ? updatedCampaign : c));
    setSelectedCampaign(updatedCampaign);
  };

  const addField = () => {
    setShowFieldForm(true);
    setEditingFieldId(null);
    setNewField({
      label: "New Field",
      type: "Text Input",
      required: false,
      options: "",
    });
  };

  const editField = (field: CampaignField) => {
    setShowFieldForm(true);
    setEditingFieldId(field.id);
    setNewField({
      label: field.label,
      type: field.type,
      required: field.required,
      options: field.options || "",
    });
  };

  const saveField = () => {
    if (!selectedCampaign || !newField.label.trim()) return;

    if (editingFieldId) {
      // Update existing field
      const updatedFields = selectedCampaign.fields.map(field => 
        field.id === editingFieldId 
          ? { ...field, ...newField }
          : field
      );
      
      const updatedCampaign = {
        ...selectedCampaign,
        fields: updatedFields,
      };

      setCampaigns(campaigns.map(c => c.id === selectedCampaign.id ? updatedCampaign : c));
      setSelectedCampaign(updatedCampaign);
    } else {
      // Create new field
      const fieldToAdd: CampaignField = {
        id: Date.now().toString(),
        ...newField,
      };

      const updatedCampaign = {
        ...selectedCampaign,
        fields: [...selectedCampaign.fields, fieldToAdd],
      };

      setCampaigns(campaigns.map(c => c.id === selectedCampaign.id ? updatedCampaign : c));
      setSelectedCampaign(updatedCampaign);
    }

    setShowFieldForm(false);
    setEditingFieldId(null);
  };

  const cancelField = () => {
    setShowFieldForm(false);
    setEditingFieldId(null);
    setNewField({
      label: "New Field",
      type: "Text Input",
      required: false,
      options: "",
    });
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    if (!selectedCampaign) return;

    const fields = [...selectedCampaign.fields];
    const currentIndex = fields.findIndex(f => f.id === fieldId);
    
    if (currentIndex === -1) return;

    let newIndex: number;
    
    if (direction === 'up' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < fields.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      return; // Can't move in that direction
    }

    // Swap the fields
    [fields[currentIndex], fields[newIndex]] = [fields[newIndex], fields[currentIndex]];

    const updatedCampaign = {
      ...selectedCampaign,
      fields: fields,
    };

    setCampaigns(campaigns.map(c => c.id === selectedCampaign.id ? updatedCampaign : c));
    setSelectedCampaign(updatedCampaign);
  };

  const fieldTypes = [
    "Text Input",
    "Number Input", 
    "Email Input",
    "Phone Input",
    "Date Input",
    "Checkbox",
    "Radio Buttons",
    "Dropdown",
    "Textarea"
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Two Panels */}
        <div className="lg:col-span-1 space-y-6">
          {/* Create New Campaign Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Create New Campaign
              </h2>
              <p className="text-sm text-gray-600">
                Start building your form campaign
              </p>
            </div>
            
            <div className="space-y-4">
              <NormalTextInput
                label="Campaign Title"
                placeholder="Enter campaign title"
                name="campaignTitle"
                value={newCampaignTitle}
                onChange={(e) => setNewCampaignTitle(e.target.value)}
              />
              
              <NormalTextAreaInput
                label="Description"
                placeholder="Describe your campaign"
                name="description"
                value={newCampaignDescription}
                onChange={(e) => setNewCampaignDescription(e.target.value)}
              />
              
              <button 
                onClick={createCampaign}
                disabled={!newCampaignTitle.trim()}
                className="w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FaPlus className="text-sm" />
                Create Campaign
              </button>
            </div>
          </div>

          {/* Your Campaigns Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Your Campaigns
              </h3>
              <p className="text-sm text-gray-600">{campaigns.length} campaigns created</p>
            </div>
            
            {campaigns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  No campaigns yet. Create your first one!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    onClick={() => setSelectedCampaign(campaign)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCampaign?.id === campaign.id
                        ? "bg-blue-50 border-blue-300"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{campaign.title}</h4>
                        <p className="text-sm text-gray-600">{campaign.fields.length} fields</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCampaign(campaign.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="lg:col-span-2">
          {selectedCampaign ? (
            <div className="space-y-6">
              {/* Campaign Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedCampaign.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedCampaign.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    {selectedCampaign.fields.length} fields
                  </span>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Campaign Details</h3>
                
                <div className="space-y-4 mb-6">
                  <NormalTextInput
                    label="Campaign Title"
                    name="editingTitle"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                  />
                  
                  <NormalTextAreaInput
                    label="Campaign Description"
                    name="editingDescription"
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                  />
                  
                  <button
                    onClick={updateCampaign}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Update Campaign
                  </button>
                </div>

                {/* Field Form */}
                {showFieldForm && (
                  <div className="space-y-4 mb-6">
                    {/* Field Preview Card */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-1">
                            <FaChevronUp className="w-3 h-3 text-gray-400" />
                            <FaEllipsisV className="w-3 h-3 text-gray-400" />
                            <FaChevronDown className="w-3 h-3 text-gray-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{newField.label}</h4>
                            <p className="text-sm text-gray-600">{newField.type}</p>
                          </div>
                        </div>
                        <FaCog className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Field Configuration Card */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <FaChevronUp className="w-3 h-3 text-gray-400" />
                          <FaEllipsisV className="w-3 h-3 text-gray-400" />
                          <FaChevronDown className="w-3 h-3 text-gray-400" />
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          {/* Field Type */}
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Field Type</label>
                            <div className="flex items-center gap-3">
                              <select
                                value={newField.type}
                                onChange={(e) => setNewField({...newField, type: e.target.value})}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              >
                                {fieldTypes.map((type) => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="required"
                                  checked={newField.required}
                                  onChange={(e) => setNewField({...newField, required: e.target.checked})}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="required" className="text-sm text-gray-700">Required Field</label>
                              </div>
                            </div>
                          </div>

                          {/* Field Label */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Field Label</label>
                            <input
                              type="text"
                              value={newField.label}
                              onChange={(e) => setNewField({...newField, label: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              placeholder="Enter field label"
                            />
                          </div>

                          {/* Field Options - Only for checkbox, dropdown, and radio */}
                          {(newField.type === "Checkbox" || newField.type === "Dropdown" || newField.type === "Radio Buttons") && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Field Options</label>
                              <textarea
                                value={newField.options || ""}
                                onChange={(e) => setNewField({...newField, options: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                placeholder="Enter options, one per line&#10;Example:&#10;Option 1&#10;Option 2&#10;Option 3"
                                rows={4}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Enter each option on a new line
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={saveField}
                          disabled={!newField.label.trim()}
                          className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          {editingFieldId ? 'Update Field' : 'Done'}
                        </button>
                        <button
                          onClick={cancelField}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add New Field Button */}
                {!showFieldForm && (
                  <button
                    onClick={addField}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaPlus className="text-sm" />
                    Add New Field
                  </button>
                )}

                {/* Display Created Fields */}
                {selectedCampaign.fields.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Campaign Fields</h4>
                    <div className="space-y-3">
                      {selectedCampaign.fields.map((field, index) => (
                        <div key={field.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => moveField(field.id, 'up')}
                                  disabled={index === 0}
                                  className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                                    index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'
                                  }`}
                                >
                                  <FaChevronUp className="w-3 h-3" />
                                </button>
                                <div className="w-3 h-3 flex items-center justify-center">
                                  <FaEllipsisV className="w-3 h-3 text-gray-400" />
                                </div>
                                <button
                                  onClick={() => moveField(field.id, 'down')}
                                  disabled={index === selectedCampaign.fields.length - 1}
                                  className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                                    index === selectedCampaign.fields.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'
                                  }`}
                                >
                                  <FaChevronDown className="w-3 h-3" />
                                </button>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{field.label}</h5>
                                <p className="text-sm text-gray-600">{field.type}</p>
                                {field.options && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {field.options.split('\n').filter(opt => opt.trim()).length} options
                                  </p>
                                )}
                                {field.required && (
                                  <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full mt-1">
                                    Required
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => editField(field)}
                                className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <FaCog className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const updatedFields = selectedCampaign.fields.filter(f => f.id !== field.id);
                                  const updatedCampaign = { ...selectedCampaign, fields: updatedFields };
                                  setCampaigns(campaigns.map(c => c.id === selectedCampaign.id ? updatedCampaign : c));
                                  setSelectedCampaign(updatedCampaign);
                                }}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaPlus className="text-2xl text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  No Campaign Selected
                </h2>
                <p className="text-gray-600 max-w-md">
                  Create a new campaign or select an existing one to start building your form
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;