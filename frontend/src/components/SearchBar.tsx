import { useState } from "react"

type Props = {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: Props) {
  const [text, setText] = useState("");
  

  return (
    <div className="flex items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search campaigns..."
        className="border rounded-md p-2 w-64"
      />
      <button
        onClick={() => onSearch(text)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  )
}
