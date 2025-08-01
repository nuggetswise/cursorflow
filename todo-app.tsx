"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { useState } from "react"

export default function Component() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { text: newTask }])
      setNewTask("")
    }
  }

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 md:p-6">
      <h1 className="text-2xl font-bold">Todo List</h1>
      <div className="flex items-center w-full max-w-lg space-x-2">
        <Input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTask()
            }
          }}
        />
        <Button onClick={addTask}>Add</Button>
      </div>
      <div className="w-full max-w-md space-y-2">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-muted hover:shadow-md p-3 shadow-sm transition-shadow"
          >
            <span className="font-medium">{task.text}</span>
            <Button variant="ghost" size="icon" onClick={() => removeTask(index)} aria-label="Remove task">
              <Trash className="w-5 h-5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
