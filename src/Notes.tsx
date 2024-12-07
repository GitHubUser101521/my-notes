import { Note, Category } from './App.tsx';
import { useState, useRef, useEffect, useMemo } from 'react';
import NewNote from './NewNote.tsx';

type NotesProps = {
  notes: Note[];
  categories: Array<Category>
  setIsNoteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenedNoteIndex: React.Dispatch<React.SetStateAction<number>>;
  addNote: (newNote: Note) => Promise<void>;
  searchTerm: string,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  openedNoteIndex: number,
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
};

function Notes({ notes, categories, setIsNoteOpen, setOpenedNoteIndex, addNote, searchTerm, setSearchTerm, openedNoteIndex, setCategories }: NotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'm') {
        inputRef.current?.focus();
      }    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredNotes = useMemo(() => {
    if (searchTerm || categoryFilter) {
      return notes.filter(note => {
        return note.title.toLowerCase().includes(searchTerm.toLowerCase()) && note.category === categoryFilter
      })
    } else {
      return notes;
    }
  }, [notes, searchTerm, categoryFilter])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'Add') {
      const newCategoryInput = prompt('Add new category:');
      
      if (newCategoryInput) {
        const newCategory = {
          id: newCategoryInput.toLowerCase(),
          name: newCategoryInput
        }
        alert(`Category ${newCategoryInput} added!`)

        const addCategory = async () => {
          setCategories([...categories, newCategory])
          e.target.value = 'All'
      
          try {
            const response = await fetch('http://localhost:3000/categories', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newCategory)
            })
      
            console.log(response.ok)
          } catch (error) {
            console.log(error)
          }
        }

        addCategory()
      } 

      return;
    }

    if (e.target.value === 'Delete') {
      const categoryToDelete = prompt('Type the category you want to delete (case sensitive):')
      
      if (categoryToDelete === 'All') {
        alert('Cannot delete category All');
        return;
      } else {
        if (!categories.find(category => category.name === categoryToDelete?.toLocaleLowerCase())) {
          alert(`Category ${categoryToDelete} not found!`)
          e.target.value = 'All'
          return;
        }

        const deleteCategory = async () => {
          try {
            const response = await fetch(`http://localhost:3000/categories/${categoryToDelete}`, {
              method: 'DELETE',
            });
      
            if (!response.ok) {
              console.error('Error deleting note:', response.statusText);
            }
          } catch (error) {
            console.error('Error deleting note:', error);
          }
        };

        deleteCategory()
        alert(`Category ${categoryToDelete} deleted!`)
        e.target.value = 'All'
      }
    }
  }

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

            <select 
              className='w-1/4 text-center border-2 rounded-full px-4 h-10'
              onChange={e => {
                handleCategoryChange(e)
                setCategoryFilter(e.target.value)
                console.log(categoryFilter)
              }}
            >
              {categories.map((category, index) => (
                <option key={index} value={category.name}>{category.name}</option>
              ))}

              <option value="Add">+ Add new</option>
              <option value="Delete" className='text-red-600'>&#10005; Delete Category</option>
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

                          <div className={note.category ? 'border-2 p-4 max-w-20 text-sm text-center max-h-8 flex justify-center items-center rounded-lg bg-white border-gray-600' : 'opacity-0 '}>
                            {note.category}
                          </div> 
                    </div>
                  ))}
            </div>
          ) : (
            <div className="flex w-full h-full justify-center items-center flex-col pb-24">
              <p className="text-gray-600">Empty note!</p>
            </div>
          )}

          <p className="text-gray-500 text-center m-4">{
            filteredNotes.length > 0 ? "You've reached the end!" : "No note found"
          }</p> 
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