'use client';
import { useState } from 'react';
import { Save } from 'lucide-react';

const WritingSpace = () => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Writing Space</h1>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={isSaving}
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="w-full min-h-[70vh] p-6 bg-white rounded-lg shadow-sm border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-serif text-lg leading-relaxed"
        />
        
        <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
          <span>{content.length} characters</span>
          <span>{content.split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </main>
    </div>
  );
};

export default WritingSpace;