'use client';

import React, { useState, useEffect } from 'react';
import { Save, Moon, Sun, Settings } from 'lucide-react';

const WritingSpace = () => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

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
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      {/* Glass container */}
      <div className="max-w-4xl mx-auto min-h-screen backdrop-blur-sm">
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`h-3 w-3 rounded-full ${content.length > 0 ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
            <h1 className={`font-mono text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {content ? content.slice(0, 20) : 'Untitled'}.txt
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {error && (
              <span className="text-sm text-red-500 bg-red-100/10 px-3 py-1 rounded-full">
                {error}
              </span>
            )}
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-transform hover:scale-110 ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600 shadow-sm'
              }`}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <button className={`p-2 rounded-full transition-transform hover:scale-110 ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600 shadow-sm'
            }`}>
              <Settings size={16} />
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all hover:scale-105 ${
                darkMode 
                  ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              <Save size={14} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full h-[70vh] p-8 rounded-2xl resize-none focus:outline-none transition-colors font-serif text-lg ${
              darkMode 
                ? 'bg-gray-800/50 text-gray-100 placeholder-gray-500' 
                : 'bg-white/50 text-gray-800 placeholder-gray-400 shadow-lg'
            }`}
            placeholder="Start writing..."
            style={{ lineHeight: '1.8' }}
          />
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 flex items-center justify-between ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className={`h-1 w-1 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
              {content.length} chars
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-1 w-1 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
              {content.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
          
          {lastSaved && !error && (
            <span className="text-xs font-mono opacity-50">Last saved {lastSaved}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WritingSpace;