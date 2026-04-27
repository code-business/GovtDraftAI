import React, { useState, useRef } from 'react';
import { Upload, FileText, Send, Loader2 } from 'lucide-react';

interface DraftingFormProps {
  category: string;
  onGenerate: (data: {
    govtBody: string;
    ministry: string;
    letterType: string;
    referenceText: string;
  }) => void;
  isLoading: boolean;
}

const DraftingForm: React.FC<DraftingFormProps> = ({ category, onGenerate, isLoading }) => {
  const [formData, setFormData] = useState({
    govtBody: '',
    ministry: '',
    letterType: 'Request',
    referenceText: '',
  });
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setFormData((prev) => ({ ...prev, referenceText: text }));
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Target Government Body
          </label>
          <input
            type="text"
            required
            placeholder="e.g. National Health Service, FDA"
            className="w-full px-4 text-black  py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={formData.govtBody}
            onChange={(e) => setFormData({ ...formData, govtBody: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Ministry / Department
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Ministry of Health, Research Dept"
            className="w-full text-black px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={formData.ministry}
            onChange={(e) => setFormData({ ...formData, ministry: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Type of Letter
          </label>
          <select
            className="w-full px-4 py-2 text-black  border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            value={formData.letterType}
            onChange={(e) => setFormData({ ...formData, letterType: e.target.value })}
          >
            <option>Request</option>
            <option>Update</option>
            <option>Research Detail</option>
            <option>Grant Application</option>
            <option>Policy Proposal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Selected Category
          </label>
          <div className="w-full px-4 py-2 text-black  bg-slate-50 border border-slate-200 rounded-lg font-medium">
            {category}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Upload Reference Letter / Content
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.md"
          />
          {fileName ? (
            <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
              <FileText className="w-6 h-6" />
              <span>{fileName}</span>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 mx-auto text-slate-400 group-hover:text-blue-500 transition-colors" />
              <p className="text-slate-600">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400">TXT or Markdown (Max 5MB)</p>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.referenceText}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all ${isLoading || !formData.referenceText
          ? 'bg-slate-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
          }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating AI Draft...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Generate Government Draft
          </>
        )}
      </button>
      {!formData.referenceText && (
        <p className="text-center text-xs text-red-500">Please upload a reference letter to proceed.</p>
      )}
    </form>
  );
};

export default DraftingForm;
