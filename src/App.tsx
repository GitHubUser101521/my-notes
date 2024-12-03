import { useEffect, useState } from 'react';
import Header from './Header.tsx';
import Notes from './Notes.tsx';
import PreviewNotes from './PreviewNotes.tsx';

export type Note = {
  id: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
  color: string;
};

function App() {
  const url = 'http://localhost:3000/notes';
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNoteOpen, setIsNoteOpen] = useState<boolean>(false);
  const [openedNoteIndex, setOpenedNoteIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      const fetchedData: Note[] = await response.json();
      setNotes(fetchedData.reverse());
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteNote = async (noteId: string) => {
    try {
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
      setIsNoteOpen(false); 

      const response = await fetch(`${url}/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Error deleting note:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const addNote = async (newNote: Note) => {
    setNotes([newNote, ...notes])

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNote)
      })

      console.log(response.ok)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container">
      <Header 
        notes={notes}
        url={url}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredNotes={filteredNotes}
        setFilteredNotes={setFilteredNotes}
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="flex justify-between mt-8 gap-4 flex-grow">
          <Notes
            searchTerm={searchTerm}
            notes={notes}
            setIsNoteOpen={setIsNoteOpen}
            setOpenedNoteIndex={setOpenedNoteIndex}
            addNote={addNote}
            filteredNotes={filteredNotes}
          />
          <PreviewNotes
            notes={notes}
            isNoteOpen={isNoteOpen}
            openedNoteIndex={openedNoteIndex}
            deleteNote={deleteNote}
            setIsNoteOpen={setIsNoteOpen}
            url={url}
            fetchData={fetchData}
          />
        </div>
      )}
    </div>
  );
}

export default App;
