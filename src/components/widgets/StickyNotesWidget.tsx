"use client";

import React, { useState, useEffect } from "react";

interface StickyNotesWidgetProps {
  id: string; // Unique identifier for the widget
  content: string; // Initial content of the note
  onSave: (id: string, content: string) => void; // Callback to save content
}

const StickyNotesWidget: React.FC<StickyNotesWidgetProps> = ({
  id,
  content,
  onSave,
}) => {
  const [notes, setNotes] = useState(content);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  useEffect(() => {
    onSave(id, notes);
  }, [notes, id, onSave]);

  return (
    <div className="w-full h-full bg-yellow-200 py-2 rounded-lg shadow-md">
      <h1 className="text-xs font-semibold text-center border-b border-yellow-600 pb-1 text-black">
        MY NOTES
      </h1>
      <textarea
        value={notes}
        onChange={handleChange}
        placeholder="Write your notes here..."
        className="w-full h-full bg-transparent p-2 border-none outline-none resize-none text-black text-sm"
      />
    </div>
  );
};

export default StickyNotesWidget;
