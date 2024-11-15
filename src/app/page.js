'use client';
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

const WritingSpace = () => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);

  // Load content when component mounts
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content');
        const data = await response.json();
        if (data.content) {
          setContent(data.content);
        }
      } catch (err) {
        console.error('Failed to load content:', err);
        setError('Failed to load your content');
      }
    };
    
    loadContent();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (!response.ok) throw new Error('Failed to save');
      
      setLastSaved(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to save:', err);
      setError('Failed to save your content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Writing Space</h1>
          <div className="flex items-center gap-4">
            {error && (
              <span className="text-sm text-red-500">{error}</span>
            )}
            {lastSaved && !error && (
              <span className="text-sm text-gray-500">
                Last saved: {lastSaved}
              </span>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={isSaving}
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
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