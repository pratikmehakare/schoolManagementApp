import React, { useEffect, useState } from "react";
import { getAllNote, createNote, deleteNote } from "../../../services/oprations/noteAPI";
import ListDisplay from "../../common/ListDisplay";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");

  // Modal state for adding a new note
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);

  // State for new note data (Add Note Modal)
  const [newNoteData, setNewNoteData] = useState({
    title: "",
    content: "",
    date: "", // Optional: allow users to set a specific date
  });

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

  // ===== Add Note Modal Handlers =====
  const openAddNoteModal = () => {
    setShowAddNoteModal(true);
  };

  const closeAddNoteModal = () => {
    setShowAddNoteModal(false);
    setNewNoteData({
      title: "",
      content: "",
      date: "",
    });
  };

  const handleNewNoteChange = (e) => {
    const { name, value } = e.target;
    setNewNoteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNoteSubmit = async (e) => {
    e.preventDefault();
    const noteData = {
      title: newNoteData.title,
      content: newNoteData.content,
      date: newNoteData.date || new Date().toISOString(), // fallback to current date if not provided
    };
    try {
      const createdNote = await createNote(noteData);
      setNotes((prev) => [...prev, createdNote]);
      closeAddNoteModal();
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  // ===== Delete Note Handler =====
  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes((prev) =>
        prev.filter((note) => (note._id || note.id) !== noteId)
      );
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Filter notes based on search title (case-insensitive)
  const filteredNotes = searchTitle
    ? notes.filter((note) =>
        note.title.toLowerCase().includes(searchTitle.toLowerCase())
      )
    : notes;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Note Management</h1>
      <p className="mb-6 text-gray-300">
        Manage your notes and related information.
      </p>

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
            <div className="mt-4 flex space-x-3">
              <button
                className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded transition-colors"
                onClick={() => handleDeleteNote(note._id || note.id)}
              >
                Delete
              </button>
            </div>
          </div>
        )}
        noDataText="No notes found."
      />

      {/* Floating "Add Note" Button */}
      <button
        className="fixed bottom-9 right-9 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-full shadow-lg transition-colors"
        onClick={openAddNoteModal}
      >
        Add Note
      </button>

      {/* ===== Add Note Modal ===== */}
      {showAddNoteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Note</h2>
            <form onSubmit={handleAddNoteSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={newNoteData.title}
                  onChange={handleNewNoteChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="content" className="block text-gray-300">
                  Content
                </label>
                <textarea
                  name="content"
                  id="content"
                  value={newNoteData.content}
                  onChange={handleNewNoteChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={newNoteData.date}
                  onChange={handleNewNoteChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeAddNoteModal}
                  className="mr-2 px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Note;
