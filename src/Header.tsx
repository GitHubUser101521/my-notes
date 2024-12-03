import { Note } from './App.tsx'
import { useEffect, useRef } from 'react';

type HeaderProp = {
  notes: Note[],
  url: string,
  searchTerm: string,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  filteredNotes: Note[],
  setFilteredNotes: React.Dispatch<React.SetStateAction<Note[]>>
}

function Header({ notes, url, searchTerm, setSearchTerm, filteredNotes, setFilteredNotes}: HeaderProp) {
    const currentAcc = 'Cherryl'
    const inputRef = useRef<HTMLInputElement>(null)
    console.log(searchTerm)
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          const fetchedData: Note[] = await response.json();
          setFilteredNotes(fetchedData.reverse());
        } catch (error) {
          console.error('Error fetching notes:', error);
        } 
      };
  
      fetchData();

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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)

      // Copy notes so the filteredNotes will reset (prevent empty filteredNotes)
      const originalNotes = [...notes]

      const searchedNote = filteredNotes.filter((note) => {
        setFilteredNotes(originalNotes)
        console.log(filteredNotes)
        const searchTermLower = e.target.value.toLowerCase();
        const noteTitleLower = note.title.toLowerCase() 

        return noteTitleLower.includes(searchTermLower)
      })

      setFilteredNotes(searchedNote)
      console.log(e.target.value, filteredNotes)
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center gap-4">
          <div className="bg-lime-300 rounded-full w-14 h-14 grid place-content-center">
            <p className="text-white text-2xl sans">{currentAcc[0]}</p>
          </div>

          <p className="text-xl"><span className="text-gray-500">Welcome back, </span>{currentAcc}</p>
        </div>

        <div className='flex gap-6'>
          <p className=''>Notes</p>
          <p>Calendar</p>
        </div>

        <div className="flex justify-end items-center gap-4">
          <select name="" id="">
            <option value="">Folders</option>
          </select>

          <input 
            type='text'
            placeholder="Search note... (ctrl + m)" 
            className="p-1 px-3 rounded-full border-2 border-black h-10"
            onChange={(e) => {
              handleSearch(e)
            }}
            ref={inputRef}
          />

          <img src="/search-icon.png" className="wh-10"/>
          <img src="/settings-icon.png" className="wh-10"/>
        </div>
      </div>
    </>
  )
}

export default Header