import { useState } from 'react';
import Sidebar from './components/Sidebar';
import DraftingForm from './components/DraftingForm';
import LetterPreview from './components/LetterPreview';
import { generateLetter } from './lib/gemini';
import { ShieldAlert, AlertCircle } from 'lucide-react';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('Oncology');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (formData: {
    govtBody: string;
    ministry: string;
    letterType: string;
    referenceText: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateLetter({
        ...formData,
        category: selectedCategory,
      });
      setGeneratedLetter(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setGeneratedLetter('');
          setError(null);
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
            />

            <LetterPreview content={generatedLetter} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
