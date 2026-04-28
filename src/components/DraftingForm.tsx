import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Send, Loader2, X, Eye } from 'lucide-react';
import type { UploadedFile } from '../App';

interface DraftingFormProps {
  category: string;
  onGenerate: (data: {
    govtBody: string;
    ministry: string;
    letterType: string;
    referenceText: string;
  }) => void;
  isLoading: boolean;
  uploadedFiles: UploadedFile[];
  onFileUpload: (file: UploadedFile) => void;
  onRemoveFile: (id: string) => void;
  onPreviewFile: (file: UploadedFile) => void;
}

const DraftingForm: React.FC<DraftingFormProps> = ({
  category,
  onGenerate,
  isLoading,
  uploadedFiles,
  onFileUpload,
  onRemoveFile,
  onPreviewFile
}) => {
  const [formData, setFormData] = useState({
    govtBody: '',
    ministry: '',
    letterType: 'Request',
    referenceText: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update referenceText whenever uploadedFiles changes
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      // Concatenate content of all uploaded files for reference
      const combinedContent = uploadedFiles.map(f => f.content).join('\n\n---\n\n');
      setFormData(prev => ({ ...prev, referenceText: combinedContent }));
    } else {
      setFormData(prev => ({ ...prev, referenceText: '' }));
    }
  }, [uploadedFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          onFileUpload({
            id: Math.random().toString(36).substring(7),
            name: file.name,
            content: text,
            type: file.type || 'text/plain'
          });
        };
        reader.readAsText(file);
      });
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
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
            Ministry
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
            Selected Department
          </label>
          <div className="w-full px-4 py-2 text-black  bg-slate-50 border border-slate-200 rounded-lg font-medium">
            {category}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Upload Reference Letters / Content
        </label>

        {/* Upload Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group mb-4"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.md"
            multiple
          />
          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-slate-400 group-hover:text-blue-500 transition-colors" />
            <p className="text-slate-600 font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-400">TXT or Markdown (Max 5MB)</p>
          </div>
        </div>

        {/* File List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wider">Uploaded Files</h4>
            <div className="grid grid-cols-1 gap-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg group hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                    <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPreviewFile(file)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-md transition-all shadow-sm border border-transparent hover:border-slate-200"
                      title="Preview file"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveFile(file.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-md transition-all shadow-sm border border-transparent hover:border-slate-200"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || uploadedFiles.length === 0}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all ${isLoading || uploadedFiles.length === 0
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
      {uploadedFiles.length === 0 && (
        <p className="text-center text-xs text-red-500">Please upload at least one reference letter to proceed.</p>
      )}
    </form>
  );
};

export default DraftingForm;
