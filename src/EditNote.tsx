import { Note } from './App.tsx'
import { useEffect } from 'react';

type EditNoteProps = {
    setEditFullscreen: React.Dispatch<React.SetStateAction<boolean>>
    editingHeader: boolean
    setEditedNote: React.Dispatch<React.SetStateAction<Note>>
    editedNote: Note
    setEditingHeader: React.Dispatch<React.SetStateAction<boolean>>
    handleConfirmEdit: () => Promise<void>
}

function EditNote({ 
    setEditFullscreen, 
    editingHeader, 
    setEditedNote, 
    editedNote, 
    setEditingHeader, 
    handleConfirmEdit, 
}: EditNoteProps) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (editingHeader && event.key === 'Enter') {
            setEditingHeader(false)
          } 
        };
    
        window.addEventListener('keydown', handleKeyDown);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      })
  return (
    <div className='bg-note'>
        <div className='flex justify-between items-center'>
          <img src="/arrow-icon.png" className='wh-10 cursor-pointer' onClick={() => setEditFullscreen(false)} />

          <div className='flex gap-4 items-center justify-center'>
            {editingHeader ? 
              <input 
                placeholder='Enter new title...'
                value={editedNote.title}
                className='text-5xl font-bold border-2 rounded-md h-12 text-center'
                onChange={(event) => setEditedNote({...editedNote, title: event.target.value})}
              />
              : 
              <p className='text-5xl font-bold' onClick={() => setEditingHeader(true)}>{editedNote.title}</p>
            }
            {editingHeader ? 
              <img 
                src="/check-icon.png" 
                className='wh-10'
                onClick={() => {
                    setEditingHeader(false)
                }}
              />
              :
              <img 
                src="/edit-icon.png" 
                className='wh-10 cursor-pointer'
                onClick={() => {setEditingHeader(true)}}
              /> 
            }
          </div>

          <img src="/check-icon.png" className='wh-10' onClick={handleConfirmEdit}/>
        </div>

        <div className='flex justify-between items-center border-2 mt-4 rounded-lg'>
            <div className='flex p-2 gap-2'>
              <div className={"rounded-sm wh-10 " + editedNote.color}></div>
              <select onChange={(e) => setEditedNote({...editedNote, color: e.target.value})} className='outline-none w-20' value={editedNote.color}>
                <option value="bg-slate-100">Default</option>
                <option value="bg-lime-400">Lime</option>
                <option value="bg-blue-500">Blue</option>
                <option value="bg-amber-300">Yellow</option>
                <option value="bg-cyan-400">Cyan</option>
                <option value="bg-red-600">Red</option>
              </select>
            </div>
        </div>

        <textarea
            value={editedNote.content} 
            onChange={(e) => setEditedNote({...editedNote, content: e.target.value})}
            placeholder='Start taking your note...'
            className='resize-none w-full mx-auto mt-4 outline-none rounded-lg h-120'
        />
    </div>
  )
}

export default EditNote
