import { useState } from 'react';
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
  const [color, setColor] = useState('')
  const newDate = new Date();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value); 
  };

  const confirmAddNote = async () => { 
      const newNote: Note = {
        id: `${newDate.getMonth() + 1}${newDate.getDate()}${newDate.getFullYear()}${newDate.getHours()}${newDate.getMinutes()}${newDate.getMilliseconds()}`,
        title: title,
        date: format(newDate, 'MMMM d, yyyy, h:mm a'),
        content: content,
        tags: ['tag 1', 'tag 2'],
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
    setTitle(e.target.value)
  }

  return (
    <>
      <div className="bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-md w-full h-full px-32">
        <div className='flex justify-evenly items-center'>
          <img src="/arrow-icon.png" className='wh-10 cursor-pointer' onClick={() => setIsEditing(false)} />

          <div className='flex gap-4 items-center justify-center'>
            {editingTitle ? 
              <input 
                placeholder='Enter new title...'
                value={title}
                className='text-3xl p-2 font-bold w-1/2 border-2 rounded-md'
                onChange={(event) => editTitle(event)}
              />
              : 
              <h1 className='text-5xl font-bold'>{title}</h1>
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

        <div className='flex justify-center items-center'>
            <div>
              <div className={"wh-10 " + color}></div>
              <select onChange={(e) => setColor(e.target.value)}>
                <option value="bg-slate-400">Default</option>
                <option value="bg-lime-400">Limegreen</option>
                <option value="bg-blue-500">Blue</option>
                <option value="bg-amber-300">Yellow</option>
                <option value="bg-cyan-400">Cyan</option>
                <option value="bg-red-600">Red</option>
              </select>
            </div>

          <textarea
            value={content} 
            onChange={handleChange}
            placeholder='Start taking your note...'
            className='resize-none w-3/4 mx-auto mt-8 outline-none p-4 rounded-lg'
          />
        </div>
      </div>
    </>
  );
}

export default NewNote;