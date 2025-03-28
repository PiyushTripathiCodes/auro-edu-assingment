"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile, Send, Mic, MicOff, HelpCircle } from "lucide-react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { motion } from "framer-motion"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (content: string) => void
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [showCommands, setShowCommands] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { theme } = useTheme()
  const maxLength = 1000

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift + Enter for new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }

    // / for commands
    if (e.key === "/" && message === "") {
      setShowCommands(true)
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
      textareaRef.current?.focus()
    }
  }

  const addEmoji = (emoji: any) => {
    setMessage((prev) => prev + emoji.native)
    textareaRef.current?.focus()
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real app, we would start/stop recording here
  }

  const insertCommand = (command: string) => {
    setMessage(command + " ")
    setShowCommands(false)
    textareaRef.current?.focus()
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const commands = [
    { command: "/help", description: "Show available commands" },
    { command: "/clear", description: "Clear chat history" },
    { command: "/topic", description: "Change discussion topic" },
    { command: "/explain", description: "Request detailed explanation" },
    { command: "/quiz", description: "Start a quiz on the current topic" },
  ]

  return (
    <div className="p-4 border-t bg-background">
      {showCommands && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mb-2 bg-muted rounded-md p-2"
        >
          <h3 className="text-sm font-medium mb-1">Available Commands</h3>
          <ul className="space-y-1">
            {commands.map((cmd) => (
              <li
                key={cmd.command}
                className="text-sm p-1 hover:bg-muted-foreground/10 rounded cursor-pointer flex justify-between"
                onClick={() => insertCommand(cmd.command)}
              >
                <span className="font-mono">{cmd.command}</span>
                <span className="text-muted-foreground">{cmd.description}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[60px] resize-none pr-12 py-3"
            maxLength={maxLength}
          />

          {message.length > 0 && (
            <div
              className={cn(
                "absolute bottom-2 right-2 text-xs",
                message.length > maxLength * 0.8 ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {message.length}/{maxLength}
            </div>
          )}
        </div>

        <div className="flex gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Insert emoji">
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none" side="top">
              <Picker data={data} onEmojiSelect={addEmoji} theme={theme} />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleRecording}
            className={isRecording ? "text-destructive" : ""}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Help">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top">
              <div className="space-y-2">
                <h3 className="font-medium">Keyboard Shortcuts</h3>
                <ul className="text-sm space-y-1">
                  <li>
                    <kbd className="px-1 bg-muted rounded">Enter</kbd> Send message
                  </li>
                  <li>
                    <kbd className="px-1 bg-muted rounded">Shift + Enter</kbd> New line
                  </li>
                  <li>
                    <kbd className="px-1 bg-muted rounded">/</kbd> Show commands
                  </li>
                </ul>
                <h3 className="font-medium pt-2">Formatting</h3>
                <ul className="text-sm space-y-1">
                  <li>
                    <code>**bold**</code> for <strong>bold</strong>
                  </li>
                  <li>
                    <code>*italic*</code> for <em>italic</em>
                  </li>
                  <li>
                    <code>`code`</code> for <code className="bg-muted px-1 rounded">code</code>
                  </li>
                  <li>
                    <code>@username</code> to mention someone
                  </li>
                </ul>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={handleSendMessage} disabled={!message.trim()}>
            <Send className="h-5 w-5 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

