function Header() {
  const currentAcc = 'Cherryl'

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center gap-4">
          <div className="bg-lime-300 rounded-full w-14 h-14 grid place-content-center">
            <p className="text-white text-2xl sans">{currentAcc[0]}</p>
          </div>

          <p className="text-xl"><span className="text-gray-500">Welcome back, </span>{currentAcc}</p>
        </div>

        <p className="text-md">"Your thoughts, your events, your way."</p>

        <div className="flex justify-end items-center gap-4">
          <img src="/search-icon.png" className="wh-10"/>
          <img src="/settings-icon.png" className="wh-10"/>
        </div>
      </div>
    </>
  )
}

export default Header