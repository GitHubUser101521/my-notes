import { useEffect, useRef, useState } from 'react';
import { Note, Category } from './App.tsx'
import EditNote from './EditNote.tsx';

type PreviewProps = {
  notes: Note[],
  isNoteOpen: boolean,
  openedNoteIndex: number,
  deleteNote: (noteId: string) => Promise<void>,
  setIsNoteOpen: React.Dispatch<React.SetStateAction<boolean>>,
  url: string,
  fetchData: () => Promise<void>
  categories: Category[]
}

function PreviewNotes({ 
    notes, 
    isNoteOpen, 
    openedNoteIndex, 
    deleteNote, 
    setIsNoteOpen, 
    url, 
    fetchData,
    categories
  }: PreviewProps) {
  const currentNote = notes[openedNoteIndex];
  const [editingHeader, setEditingHeader] = useState(false)
  const [editedNote, setEditedNote] = useState(currentNote)
  const [editingContent, setEditingContent] = useState(false)
  const [editFullscreen, setEditFullscreen] = useState(false)
  const textareaRef= useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (editingHeader && event.key === 'Enter') {
        setEditingHeader(false);
        handleConfirmEdit()
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  })

  useEffect(() => {
    setEditedNote({...currentNote})
  }, [openedNoteIndex])

  useEffect(() => {
    console.log(editedNote)
    console.log()
  }, [editedNote])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 25 || e.target.value.length < 1) {
      setEditedNote({ ...currentNote, title: e.target.value.slice(0, 25) });
      setEditingHeader(false)
      handleConfirmEdit()
    } else {
      setEditedNote({ ...currentNote, title: e.target.value });
    }
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
        console.error(currentNote.id, error);
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

  const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedNote({...editedNote, category: e.target.value})
    handleConfirmEdit()
  }

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
                        autoFocus
                        className='rounded-md outline-none'
                        placeholder={currentNote.title}
                        onChange={(e) => handleTitleChange(e)}
                      />
                    : <span onClick={() => setEditingHeader(true)}>{currentNote.title}</span>}
                  </p>
                  <p className='font-medium'>{currentNote.date}</p>
                </div>

                <select 
                  onChange={(e) => handleChangeCategory(e)}
                  className='px-2 py-1 rounded-sm w-fit outline-none'
                  value={currentNote.category}
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category.name}>{category.name}</option>
                  ))}
                </select>

                {/* {currentNote.category && 
                  <div className="border-2 p-4 max-w-20 text-sm text-center max-h-8 flex justify-center items-center rounded-lg bg-white border-gray-600">
                    {currentNote.category}
                  </div>
                } */}
              </div>

              <img 
                src="/edit-icon.png" 
                className='wh-10'
                onClick={() => {
                  setEditFullscreen(true)
                  setEditedNote({...currentNote})
                }}
              />
            </div>

            <div className='p-4 w-full h-96 overflow-y-auto' onClick={() => setEditingContent(true)}>
              {editingContent ? 
                <textarea 
                  value={editedNote.content} 
                  className='resize-none w-full h-full outline-none'
                  ref={textareaRef}
                  autoFocus
                  placeholder='Leaving it empty?'
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

      {editFullscreen && <EditNote 
        setEditFullscreen={setEditFullscreen}
        editingHeader={editingHeader}
        setEditedNote={setEditedNote}
        editedNote={editedNote}
        setEditingHeader={setEditingHeader}
        handleConfirmEdit={handleConfirmEdit}
      />}
    </div>
  );
}

export default PreviewNotes