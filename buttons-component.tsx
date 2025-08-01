"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Component() {
  // Initialize an array of 5 booleans, all false (not clicked)
  const [clickedStates, setClickedStates] = useState<boolean[]>(Array(5).fill(false))

  const handleClick = (index: number) => {
    setClickedStates((prevStates) => {
      const newStates = [...prevStates]
      newStates[index] = !newStates[index] // Toggle the state for the clicked button
      return newStates
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center gap-4 bg-white p-4">
      {clickedStates.map((isClicked, index) => (
        <Button
          key={index}
          className={`px-6 py-3 text-white font-semibold rounded-md transition-colors duration-300 ${
            isClicked ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={() => handleClick(index)}
        >
          Button {index + 1}
        </Button>
      ))}
    </div>
  )
}
