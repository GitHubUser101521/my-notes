import { Note } from './App.tsx';
import { useState, useRef, useEffect, useMemo } from 'react';
import NewNote from './NewNote.tsx';

type NotesProps = {
  notes: Note[];
  setIsNoteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenedNoteIndex: React.Dispatch<React.SetStateAction<number>>;
  addNote: (newNote: Note) => Promise<void>;
  searchTerm: string,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  openedNoteIndex: number,
};

function Notes({ notes, setIsNoteOpen, setOpenedNoteIndex, addNote, searchTerm, setSearchTerm, openedNoteIndex }: NotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'm') {
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredNotes = useMemo(() => {
    if (searchTerm) {
      return notes.filter(note => {
        return note.title.toLowerCase().includes(searchTerm.toLowerCase())
      })
    } else {
      return notes;
    }
  }, [notes, searchTerm])

  return (
    <>
      <div className="flex flex-col w-1/2 h-full">
        <div>
          <div className='flex justify-between items-center gap-4 mb-4'>
            <p className="bebas-neue text-6xl border-black">Your Notes</p>
            <img
              src="/plus-icon.png"
              className="w-12 h-12"
              onClick={() => setIsEditing(true)}
            />
          </div>

          <div className='flex justify-between mb-4 gap-4 items-center'>
            <input 
              type='search'
              value={searchTerm}
              placeholder="Search note... (ctrl + m)" 
              className="p-1 px-3 rounded-full border-2 border-black h-10 w-3/4 outline-none"
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
              ref={inputRef}
            />

            <select className='w-1/4 text-center border-2 rounded-full px-4 h-10'>
              <option value="">Folders</option>
            </select>
          </div>
        </div>

        <div className="h-120">
          {notes && notes.length > 0 ? (
            <div className="grid gap-2 grid-cols-2 pr-2 max-lg:grid-cols-1">
                  {filteredNotes.map((note: Note, index) => (
                    <div
                      key={index}
                      className={
                        `${"break-words border-2 p-4 rounded-md border-black h-60 flex justify-between flex-col cursor-pointer hover:brightness-75 " + note.color} ${openedNoteIndex === index ? 'active' : ''}`
                      }
                      onClick={() => {
                        setOpenedNoteIndex(index)
                        setIsNoteOpen(true)
                      }}
                    >
                          <div>
                            <p className="font-bold text-2xl">{note.title}</p>
                            <p className="text-black">{note.date}</p>
                          </div>

                          <p className="multi-truncate">{note.content}</p>

                          <div className="flex gap-2">
                            {note.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="border-2 p-4 max-w-20 text-sm text-center max-h-8 flex justify-center items-center rounded-lg bg-white border-gray-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                    </div>
                  ))}
            </div>
          ) : (
            <div className="flex w-full h-full justify-center items-center flex-col pb-24">
              <p className="text-gray-600">Empty note!</p>
            </div>
          )}

          {notes.length > 0 && <p className="text-gray-500 text-center m-4">You've reached the end!</p>}
        </div>
      </div>

      {isEditing && <NewNote 
        setIsEditing={setIsEditing}
        addNote={addNote}
      />}
    </>
  );
}

export default Notes;