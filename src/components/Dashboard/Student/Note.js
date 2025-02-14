import React, { useEffect, useState } from "react";
import { getAllNote } from "../../../services/oprations/noteAPI";
import ListDisplay from "../../common/ListDisplay";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");

  // Fetch notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await getAllNote();
        setNotes(res);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  // Filter notes by title (case-insensitive)
  const filteredNotes = searchTitle
    ? notes.filter((note) =>
        note.title.toLowerCase().includes(searchTitle.toLowerCase())
      )
    : notes;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Notes</h1>
      <p className="mb-6 text-gray-300">Here are your notes.</p>

      {/* Search Input Field */}
      <div className="mb-4">
        <label htmlFor="searchTitle" className="block text-gray-300 mb-2">
          Search by Title
        </label>
        <input
          type="text"
          id="searchTitle"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          placeholder="Enter note title..."
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
        />
      </div>

      <ListDisplay
        title="Notes List"
        items={filteredNotes}
        renderItem={(note) => (
          <div className="p-4 border-b border-gray-700">
            <p>
              <strong>Title:</strong> {note?.title}
            </p>
            <p>
              <strong>Content:</strong> {note?.content}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {note?.date ? new Date(note.date).toLocaleDateString() : "N/A"}
            </p>
          </div>
        )}
        noDataText="No notes found."
      />
    </div>
  );
};

export default Note;
