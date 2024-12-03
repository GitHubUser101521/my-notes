import NewNote from './NewNote.tsx';
import { Note } from './App.tsx';
import { useState } from 'react';

type NotesProps = {
  notes: Note[];
  setIsNoteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenedNoteIndex: React.Dispatch<React.SetStateAction<number>>;
  addNote: (newNote: Note) => Promise<void>;
  searchTerm: string;
  filteredNotes: Note[];
};

function Notes({ notes, setIsNoteOpen, setOpenedNoteIndex, addNote, searchTerm, filteredNotes }: NotesProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="flex flex-col w-1/2 h-fit">
        <div className="flex justify-between items-center gap-4 mb-8">
          <p className="bebas-neue text-7xl border-b-4 border-spacing-10 border-black">Your Notes</p>
          <img
            src="/plus-icon.png"
            className="w-12 h-12"
            onClick={() => setIsEditing(true)}
          />
        </div>

        <div className="h-120">
          {notes && notes.length > 0 ? (
            <div className="grid gap-2 grid-cols-2 pr-2 max-lg:grid-cols-1">
              {searchTerm ? (
                <>
                  {filteredNotes.map((note: Note, index) => (
                    <div
                      key={index}
                      className={
                        "animation-up border-2 p-4 rounded-md border-black h-60 flex justify-between flex-col cursor-pointer hover:brightness-75 " +
                        note.color
                      }
                      onClick={() => {
                        setIsNoteOpen(true);
                        setOpenedNoteIndex(index);
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
                </>
              ) : (
                <>
                  {notes.map((note: Note, index) => (
                    <div
                      key={index}
                      className={
                        "animation-up border-2 p-4 rounded-md border-black h-60 flex justify-between flex-col cursor-pointer hover:brightness-75 " +
                        note.color
                      }
                      onClick={() => {
                        setIsNoteOpen(true);
                        setOpenedNoteIndex(index);
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
                </>
              )}
            </div>
          ) : (
            <div className="flex w-full h-full justify-center items-center flex-col pb-24">
              <p className="text-gray-600">Empty note!</p>
            </div>
          )}

          {notes.length > 0 && <p className="text-gray-500 text-center m-4">You've reached the end!</p>}
        </div>

        {isEditing && <NewNote setIsEditing={setIsEditing} addNote={addNote} />}
      </div>
    </>
  );
}

export default Notes;