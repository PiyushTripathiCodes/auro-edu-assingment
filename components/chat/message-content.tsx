"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface MessageContentProps {
  content: string
  className?: string
}

export default function MessageContent({ content, className }: MessageContentProps) {
  const [formattedContent, setFormattedContent] = useState(content)

  useEffect(() => {
    // Process markdown-like formatting
    let processed = content
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Links
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">$1</a>',
      )
      // Lists
      .replace(/^\s*-\s+(.*?)$/gm, "<li>$1</li>")
      // Code
      .replace(/`([^`]+)`/g, '<code class="bg-muted-foreground/20 px-1 py-0.5 rounded">$1</code>')
      // User mentions
      .replace(/@(\w+)/g, '<span class="text-blue-500 font-medium">@$1</span>')

    // Wrap lists in <ul>
    if (processed.includes("<li>")) {
      processed = processed.replace(/(<li>.*?<\/li>)/gs, '<ul class="list-disc pl-5">$1</ul>')
    }

    // Replace newlines with <br>
    processed = processed.replace(/\n/g, "<br>")

    setFormattedContent(processed)
  }, [content])

  return (
    <div
      className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  )
}

