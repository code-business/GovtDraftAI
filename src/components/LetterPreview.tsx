import React, { useState } from 'react';
import { Copy, Download, CheckCircle2 } from 'lucide-react';

interface LetterPreviewProps {
  content: string;
}

const LetterPreview: React.FC<LetterPreviewProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "government_draft_letter.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!content) return null;

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">Generated Draft Letter</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-white rounded-md transition-all border border-transparent hover:border-slate-200"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-white rounded-md transition-all border border-transparent hover:border-slate-200"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
      <div className="p-8 whitespace-pre-wrap font-serif text-slate-800 leading-relaxed max-h-[600px] overflow-y-auto bg-slate-50/50">
        {content}
      </div>
    </div>
  );
};

export default LetterPreview;
