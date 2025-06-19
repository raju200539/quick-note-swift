
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import AddNoteModal from '../components/AddNoteModal';

interface Note {
  id: string;
  content: string;
  createdAt: Date;
}

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Welcome to QuickNotes! 📝 Start capturing your ideas instantly.',
      createdAt: new Date()
    },
    {
      id: '2', 
      content: 'This is your second note. Click the + button to add more notes!',
      createdAt: new Date()
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addNote = (content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      createdAt: new Date()
    };
    setNotes(prev => [newNote, ...prev]);
    setIsModalOpen(false);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              QuickNotes
            </h1>
            <p className="text-gray-600 text-lg">
              Fast and simple note-taking
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{notes.length}</div>
                <div className="text-sm text-gray-600">Total Notes</div>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus size={20} />
              <span>Add Note</span>
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No notes yet</h3>
            <p className="text-gray-600 mb-6">Click the + button to create your first note!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Create First Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={deleteNote}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button - Mobile */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-110 z-50"
      >
        <Plus size={24} />
      </button>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addNote}
      />

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-200/50 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">
            Built with ❤️ using React & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
