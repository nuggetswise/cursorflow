"use client"

import { Button } from "@/components/ui/button"

export default function HelloWorld() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div>Hello World!</div>
      <Button>Click me</Button>
    </div>
  )
}
