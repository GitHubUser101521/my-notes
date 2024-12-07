import { useState, useEffect } from 'react';
import { Note } from './App.tsx';
import { format } from 'date-fns';

type NewNoteProps = {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  addNote: (newNote: Note) => Promise<void>;
};

function NewNote({ setIsEditing, addNote }: NewNoteProps) {
  const [content, setContent] = useState(''); 
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState('No Title Note');
  const [color, setColor] = useState('bg-slate-100')
  const newDate = new Date();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!editingTitle && event.key === 'Enter') {
        confirmAddNote()
      } else if (editingTitle && event.key === 'Enter') {
        setEditingTitle(false)
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  })

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value); 
  };

  const confirmAddNote = async () => { 
      const newNote: Note = {
        id: `${newDate.getMonth() + 1}${newDate.getDate()}${newDate.getFullYear()}${newDate.getHours()}${newDate.getMinutes()}${newDate.getMilliseconds()}`,
        title: title,
        date: format(newDate, 'MMMM d, yyyy, h:mm a'),
        content: content,
        category: 'All',
        color: color
      };

      try {
        await addNote(newNote); 
        setIsEditing(false);
      } catch (error) {
        console.error('Error adding note:', error);
      }
  };

  const editTitle = (e: any) => {
    if (e.target.value.length > 25) {
      setTitle(title)
    } else {
      setTitle(e.target.value)
    }
  }

  return (
    <>
      <div className="bg-note">
        <div className='flex justify-between items-center'>
          <img src="/arrow-icon.png" className='wh-10 cursor-pointer' onClick={() => setIsEditing(false)} />

          <div className='flex gap-4 items-center justify-center'>
            {editingTitle ? 
              <input 
                placeholder='Enter new title...'
                value={title}
                className='text-5xl font-bold border-2 rounded-md h-12 text-center'
                onChange={(event) => editTitle(event)}
              />
              : 
              <p className='text-5xl font-bold' onClick={() => setEditingTitle(true)}>{title}</p>
            }
            {editingTitle ? 
              <img 
                src="/check-icon.png" 
                className='wh-10'
                onClick={() => {
                  setEditingTitle(false)
                }}
              />
              :
              <img 
                src="/edit-icon.png" 
                className='wh-10 cursor-pointer'
                onClick={() => {setEditingTitle(true)}}
              /> 
            }
          </div>

          <img src="/plus-icon.png" className='wh-10' onClick={confirmAddNote}/>
        </div>

        <div className='flex justify-between items-center border-2 mt-4 rounded-lg'>
            <div className='flex p-2 gap-2'>
              <div className={"rounded-sm wh-10 " + color}></div>
              <select onChange={(e) => {setColor(e.target.value)}} className='outline-none w-20'>
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
            value={content} 
            onChange={handleChange}
            placeholder='Start taking your note...'
            className='resize-none w-full mx-auto mt-4 outline-none rounded-lg h-120'
        />
      </div>
    </>
  );
}


export default NewNote;