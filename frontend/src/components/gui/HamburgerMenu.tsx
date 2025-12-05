import { Link } from "react-router-dom"
// Props type definition for the HamburgerMenu component
// open: determines whether the menu is visible or hidden
// setOpen: function used to toggle the menu state
type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function HamburgerMenu({ open, setOpen }: Props) {
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="space-y-1">
        <div className="w-6 h-0.5 bg-black"></div>
        <div className="w-6 h-0.5 bg-black"></div>
        <div className="w-6 h-0.5 bg-black"></div>
      </button>
      {open && (
        <div className="absolute top-14 right-4 bg-white shadow-md rounded-md flex flex-col p-4 space-y-2">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/campaigns" onClick={() => setOpen(false)}>Campaigns</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
        </div>
      )}
    </div>
  )
}
