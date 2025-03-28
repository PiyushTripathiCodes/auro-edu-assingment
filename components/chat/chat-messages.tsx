"use client"

import { useRef } from "react"
import type { Message } from "@/types/chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Check, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import MessageContent from "./message-content"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

interface ChatMessagesProps {
  messages: Message[]
  isTyping: boolean
  onEditMessage: (id: string, content: string) => void
  onDeleteMessage: (id: string) => void
}

export default function ChatMessages({ messages, isTyping, onEditMessage, onDeleteMessage }: ChatMessagesProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const startEditing = (message: Message) => {
    setEditingId(message.id)
    setEditContent(message.content)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
  }

  const cancelEditing = () => {
    setEditingId(null)
  }

  const saveEdit = (id: string) => {
    onEditMessage(id, editContent)
    setEditingId(null)
  }

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={cn("flex items-start gap-3", message.sender.role === "user" ? "justify-end" : "justify-start")}
          >
            {message.sender.role !== "user" && (
              <Avatar>
                <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                <AvatarFallback>{message.sender.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            )}

            <div
              className={cn("flex flex-col max-w-[80%]", message.sender.role === "user" ? "items-end" : "items-start")}
            >
              <Card
                className={cn(
                  "mb-1",
                  message.sender.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                <CardContent className="p-3">
                  {editingId === message.id ? (
                    <div className="space-y-2">
                      <Textarea
                        ref={textareaRef}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[60px] bg-background"
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={cancelEditing}>
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                        <Button size="sm" onClick={() => saveEdit(message.id)}>
                          <Check className="h-4 w-4 mr-1" /> Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <MessageContent content={message.content} />
                  )}
                </CardContent>
              </Card>

              <div className="flex items-center text-xs text-muted-foreground gap-2">
                <span>{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</span>

                {message.status && (
                  <span className="text-xs">
                    {message.status === "sent" && "✓"}
                    {message.status === "delivered" && "✓✓"}
                    {message.status === "read" && <span className="text-blue-500">✓✓</span>}
                  </span>
                )}

                {message.sender.role === "user" && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startEditing(message)}>
                      <Edit className="h-3 w-3" />
                      <span className="sr-only">Edit message</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDeleteMessage(message.id)}>
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only">Delete message</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {message.sender.role === "user" && (
              <Avatar>
                <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                <AvatarFallback>{message.sender.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            )}
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <Card className="bg-muted mb-1">
              <CardContent className="p-3">
                <div className="flex space-x-1">
                  <div
                    className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

