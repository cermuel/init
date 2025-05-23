"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useTheme } from "next-themes";
import { BsPencilSquare, BsTrash3 } from "react-icons/bs";
import { ContextType, FileType } from "@/types/context";
import { useFiles } from "@/hooks/useFile";
import { FaSave } from "react-icons/fa";
import Save from "../controls/Save";

export type Note = {
  id: string;
  title: string;
  content: string;
  updated: number;
};

export default function NotesApp({ currentNote }: { currentNote?: FileType }) {
  const { theme } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    currentNote && currentNote.id ? currentNote.id.toString() : null
  );
  const [showSaveModal, setShowSaveModal] = useState(false);

  useLayoutEffect(() => {
    if (currentNote) {
      setNotes((prevNotes) => {
        const existingIndex = prevNotes.findIndex(
          (note) =>
            note.id == currentNote?.id ||
            (note.title === currentNote?.content?.title &&
              note.content === currentNote?.content?.content)
        );

        if (existingIndex !== -1) {
          const updatedNotes = [...prevNotes];
          updatedNotes[existingIndex] = {
            title: currentNote?.content?.title,
            id: currentNote?.id?.toString(),
            updated: Date.now(),
            content: currentNote?.content.content,
          };
          return updatedNotes;
        }

        return [
          {
            title: currentNote?.content?.title,
            id: currentNote?.id?.toString(),
            updated: Date.now(),
            content: currentNote?.content.content,
          },
          ...prevNotes,
        ];
      });

      setActiveNoteId(currentNote.id);
    }
  }, [currentNote]);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const createNote = () => {
    const newNote: Note = {
      id: nanoid(),
      title: "Untitled Note",
      content: "",
      updated: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === activeNoteId
          ? { ...note, ...updates, updated: Date.now() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (activeNoteId === id) {
      setActiveNoteId(remaining[0]?.id || null);
    }
  };

  // useEffect(() => {
  //   const stored = localStorage.getItem("notes");
  //   if (stored) {
  //     const parsed: Note[] = JSON.parse(stored);
  //     setNotes(parsed);
  //     if (parsed.length) setActiveNoteId(parsed[0].id);
  //   }
  // }, [notes]);

  return (
    <div
      className={`flex h-full flex-1 ${
        theme == "dark" ? "bg-[#1b1d1f]" : "bg-[#efefef]"
      }`}
    >
      {showSaveModal && activeNote && (
        <Save
          cancel={setShowSaveModal}
          currentFile={currentNote}
          fileToSave={{
            id: activeNote.id.toString(),
            filetype: "notes",
            content: activeNote,
          }}
        />
      )}
      {/* Sidebar */}
      <div
        className={`w-64 flex flex-col  border-t ${
          theme === "dark"
            ? "bg-[#181E25] border-t-[#dddddd0a]"
            : "bg-[#efefef] border-t-[#dddddd]"
        }`}
      >
        <div className="p-2 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Notes</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={createNote}
              className="text-sm p-1 bg-transparent hover:bg-[#FED702DA] text-white rounded-[2px]"
            >
              <BsPencilSquare />
            </button>
            <button
              onClick={() => activeNoteId && deleteNote(activeNoteId)}
              className="text-sm p-1 bg-transparent hover:bg-[#FED702DA] text-white rounded-[2px]"
            >
              <BsTrash3 />
            </button>
          </div>
        </div>
        <div className="overflow-auto flex-1 gap-2 flex flex-col p-2 bg-transparent">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`px-3 py-2 cursor-pointer rounded-md  ${
                note.id === activeNoteId
                  ? `${theme == "dark" ? "bg-[#FED702]/80" : "bg-[#FED702]"}`
                  : `${theme == "dark" ? "bg-[#EBEBF54A]" : "bg-gray-300"}`
              }`}
            >
              <div
                className={`font-semibold text-sm truncate ${
                  theme !== "dark" ? "text-[#000000]" : "text-[#ffffff]"
                }`}
              >
                {note.title || "Untitled"}
              </div>
              <div
                className={`text-xs  truncate ${
                  theme !== "dark" ? "text-[#000000]" : "text-[#ffffff]"
                }`}
              >
                {note.content?.slice(0, 50) || "No content"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div
        className={`flex-1 flex flex-col p-4 ${
          theme == "dark" ? "bg-[#000000FA]" : "bg-[#FFFFFF]"
        } `}
      >
        {activeNote ? (
          <>
            <div className="w-full flex items-center gap-2">
              <input
                className="text-lg font-bold pb-1 focus:outline-none flex-1"
                value={activeNote.title}
                onChange={(e) => updateNote({ title: e.target.value })}
              />
              <FaSave
                className="cursor-pointer"
                onClick={() => setShowSaveModal(true)}
              />
            </div>
            <textarea
              className="flex-1 text-sm focus:outline-none resize-none"
              value={activeNote.content}
              onChange={(e) => updateNote({ content: e.target.value })}
            />
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Select or create a note
          </div>
        )}
      </div>
    </div>
  );
}
