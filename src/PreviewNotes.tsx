import { useEffect, useRef, useState } from 'react';
import { Note } from './App.tsx'

type PreviewProps = {
  notes: Note[],
  isNoteOpen: boolean,
  openedNoteIndex: number,
  deleteNote: (noteId: string) => Promise<void>,
  setIsNoteOpen: React.Dispatch<React.SetStateAction<boolean>>,
  url: string,
  fetchData: () => Promise<void>
}

function PreviewNotes({ 
    notes, 
    isNoteOpen, 
    openedNoteIndex, 
    deleteNote, 
    setIsNoteOpen, 
    url, 
    fetchData 
  }: PreviewProps) {
  const currentNote = notes[openedNoteIndex];
  const [editingHeader, setEditingHeader] = useState(false)
  const [editedNote, setEditedNote] = useState(currentNote)
  const [editingContent, setEditingContent] = useState(false)
  const textareaRef= useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (editingHeader && event.key === 'Enter') {
        setEditingHeader(false);
      } else if (editingContent) {
        if (event.key === 'Escape') {
          setEditingContent(false);
        } else if (event.ctrlKey && event.key === 'Enter') {
          const newContent = `${editedNote.content}\n`;
          setEditedNote({ ...editedNote, content: newContent });
        } else if (event.key === 'Enter') {
          handleConfirmEdit()
          setEditingContent(false)
        } else {

        }
      } else {
        return;
      }
    
      console.log(editedNote);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  })

  useEffect(() => {
    setEditedNote({...currentNote})
  }, [openedNoteIndex])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedNote({ ...currentNote, title: e.target.value });
  };

  const handleConfirmEdit = async () => {
      try {
        const response = await fetch(`${url}/${currentNote.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editedNote)
        });
    
        if (!response.ok) {
          console.log('Response: ' + response.ok)
        }
    
        const result = await response.json();
        console.log('Success:', result);
      } catch (error) {
        console.error('Error:', error);
      }

      fetchData()
  }

  useEffect(() => {
    const handleBlur = () => {
      if (editingContent) {
        setEditingContent(false);
      }
    }

    if (textareaRef.current) {
      textareaRef.current.addEventListener('blur', handleBlur);
    }

    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener('blur', handleBlur);
      }
    }
  }, [editingContent, textareaRef])

  return (
    <div className='w-1/2 overflow-y-hidden'>
      {isNoteOpen && (openedNoteIndex || openedNoteIndex === 0)? (
        <div className="w-full h-full flex flex-col gap-4 border-black border-4 border-b-2 rounded-t-2xl p-2 justify-between">

          <div>
            <div className={currentNote.color + " rounded-md w-full h-36 p-4 flex justify-between"}>
              <div className="flex flex-col justify-between">
                <div>
                  <p className='font-bold text-2xl'>
                    {editingHeader ? 
                      <input 
                        type="text" 
                        className='rounded-md'
                        placeholder={currentNote.title}
                        onChange={(e) => handleTitleChange(e)}
                      />
                    : currentNote.title}
                  </p>
                  <p className='font-medium'>{currentNote.date}</p>
                </div>

                <div className='flex gap-3'>
                  {currentNote.tags.map((tag) => (
                    <p className='font-bold' key={tag}>#{tag}</p>
                  ))}
                </div>
              </div>

              {editingHeader ? 
                <img 
                  src="/check-icon.png" 
                  className='wh-10'
                  onClick={() => {
                    setEditingHeader(false)
                    handleConfirmEdit()
                  }}
                />
              :
                <img 
                  src="/edit-icon.png" 
                  className='wh-10'
                  onClick={() => setEditingHeader(true)}
                />
              }
            </div>

            <div className='p-4 w-full h-96 overflow-y-auto' onClick={() => setEditingContent(true)}>
              {editingContent ? 
                <textarea 
                  value={editedNote.content} 
                  className='resize-none w-full h-full'
                  ref={textareaRef}
                  autoFocus
                  onChange={(e) => {
                    setEditedNote({...editedNote, content: e.target.value})
                  }}
                />
                :
                currentNote.content
              }
            </div>
          </div>

          <div className='flex justify-evenly place-items-end text-gray-600 pb-4'>
            <p>{editingContent ? 'Editing...' : 'Tip: click to edit!'}</p>
            <p onClick={() => setIsNoteOpen(false)} className='cursor-pointer'>Close Note</p>
            <p className='cursor-pointer hover:bg-red-600 hover:text-white rounded-lg hover:py-1 hover:px-2'
              onClick={() => deleteNote(currentNote.id)}
            >Delete?</p>
          </div>

        </div>
      ) : (
        <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
          <img src="/arrow-icon.png" className="w-12 h-12" />
          <p className="text-sm text-gray-500">Tip: Open a note or make a new one!</p>
        </div>
      )}
    </div>
  );
}

export default PreviewNotes