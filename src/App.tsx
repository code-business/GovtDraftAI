import { useState } from 'react';
import Sidebar from './components/Sidebar';
import DraftingForm from './components/DraftingForm';
import LetterPreview from './components/LetterPreview';
import { generateLetter } from './lib/gemini';
import { ShieldAlert, AlertCircle, X, FileText, CheckCircle2 } from 'lucide-react';

export interface UploadedFile {
  id: string;
  name: string;
  content: string;
  type: string;
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState('Oncology');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [showComparePrompt, setShowComparePrompt] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  const handleGenerate = async (formData: {
    govtBody: string;
    ministry: string;
    letterType: string;
    referenceText: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setGeneratedLetter('');
    setShowComparePrompt(false);
    try {
      const result = await generateLetter({
        ...formData,
        category: selectedCategory,
      });
      setGeneratedLetter(result);
      setShowComparePrompt(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFiles((prev) => [...prev, file]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter(f => f.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setGeneratedLetter('');
          setError(null);
          setShowComparePrompt(false);
        }}
      />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2 text-blue-600">
              <ShieldAlert className="w-8 h-8" />
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Drafting Dashboard</h2>
            </div>
            <p className="text-slate-500">
              Select a department and provide the necessary details to generate a secure government submission draft.
            </p>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8">
            <DraftingForm
              category={selectedCategory}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              uploadedFiles={uploadedFiles}
              onFileUpload={handleFileUpload}
              onRemoveFile={removeFile}
              onPreviewFile={setPreviewFile}
            />

            <div className="relative">
              <LetterPreview content={generatedLetter} />
            </div>
          </div>
        </div>
      </main>

      {/* Compare Prompt Modal */}
      {showComparePrompt && generatedLetter && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-200 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-4 mb-8">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-2">Draft Generated!</h3>
                <p className="text-slate-500 leading-relaxed">
                  Your government draft is ready. Would you like to compare it with your original source documents?
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowComparePrompt(false)}
                className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsComparing(true);
                  setShowComparePrompt(false);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {isComparing && (
        <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[60] p-6 backdrop-blur-md">
          <div className="bg-white rounded-2xl w-full h-full max-w-[95vw] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-xl text-slate-900">
                  Document Comparison
                </h3>
              </div>
              <button
                onClick={() => setIsComparing(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden bg-slate-100">
              {/* Left Side: Uploaded Content */}
              <div className="w-1/2 flex flex-col border-r border-slate-300">
                <div className="px-6 py-3 bg-slate-200/50 border-b border-slate-300 font-bold text-slate-700 flex items-center justify-between">
                  <span>Source Documents</span>
                  <span className="text-xs bg-slate-300 px-2 py-1 rounded">Original</span>
                </div>
                <div className="flex-1 overflow-y-auto p-8 bg-white/50">
                  <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-full whitespace-pre-wrap font-serif text-slate-800 leading-relaxed text-sm">
                    {uploadedFiles.map(f => `--- ${f.name} ---\n${f.content}`).join('\n\n')}
                  </div>
                </div>
              </div>

              {/* Right Side: Generated Content */}
              <div className="w-1/2 flex flex-col">
                <div className="px-6 py-3 bg-blue-50 border-b border-slate-300 font-bold text-blue-800 flex items-center justify-between">
                  <span>AI Generated Draft</span>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Generated</span>
                </div>
                <div className="flex-1 overflow-y-auto p-8 bg-blue-50/20">
                  <div className="bg-white p-8 rounded-xl border border-blue-100 shadow-md min-h-full whitespace-pre-wrap font-serif text-slate-900 leading-relaxed text-sm">
                    {generatedLetter}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsComparing(false)}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 truncate max-w-[400px]">
                  {previewFile.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-full whitespace-pre-wrap font-serif text-slate-800 leading-relaxed">
                {previewFile.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
