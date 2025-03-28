"use client"

import { useState, useEffect } from "react"
import type { Message, User } from "@/types/chat"
import { v4 as uuidv4 } from "uuid"
import { useStore } from "@/store/store"

// Mock AI responses
const aiResponses = [
  "That's a great question! Let me explain...",
  "I understand your point. However, consider this perspective...",
  "Based on the latest research in this field...",
  "Let me break this down into simpler concepts...",
  "Here's a step-by-step approach to solve this problem...",
  "This is a common misconception. Actually...",
  "Great question! The key concept here is...",
  "Let me provide some examples to illustrate this...",
]

// Mock users
const mockUsers: User[] = [
  {
    id: "ai-assistant",
    name: "AI Assistant",
    role: "assistant",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  {
    id: "current-user",
    name: "You",
    role: "user",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  {
    id: "john-doe",
    name: "John Doe",
    role: "user",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  {
    id: "jane-smith",
    name: "Jane Smith",
    role: "user",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
  },
]

export function useChat() {
  const { messages, setMessages, addMessage, updateMessage, removeMessage } = useStore()
  const [isTyping, setIsTyping] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<User[]>(mockUsers)

  // Simulate user status changes
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setOnlineUsers((prev) => {
        const newUsers = [...prev]
        // Randomly change a user's status
        if (newUsers.length > 2) {
          // Don't change AI or current user
          const randomIndex = Math.floor(Math.random() * (newUsers.length - 2)) + 2
          const user = newUsers[randomIndex]

          if (user.status === "online") {
            newUsers[randomIndex] = { ...user, status: Math.random() > 0.7 ? "typing" : "offline" }
          } else if (user.status === "offline") {
            newUsers[randomIndex] = { ...user, status: "online" }
          } else if (user.status === "typing") {
            newUsers[randomIndex] = { ...user, status: "online" }
          }
        }
        return newUsers
      })
    }, 5000)

    return () => clearInterval(statusInterval)
  }, [])

  // Initialize with a welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: uuidv4(),
        content:
          "👋 Welcome to the Educational Chat! I'm your AI learning assistant. Ask me anything about any topic, and I'll do my best to help you understand it. You can use **bold**, *italic*, and `code` formatting in your messages.",
        sender: mockUsers[0],
        timestamp: new Date().toISOString(),
        status: "read",
      }

      addMessage(welcomeMessage)
    }
  }, [messages.length, addMessage])

  const sendMessage = (content: string) => {
    // Handle commands
    if (content.startsWith("/")) {
      const command = content.split(" ")[0]

      if (command === "/clear") {
        setMessages([])
        return
      }

      if (command === "/help") {
        const helpMessage: Message = {
          id: uuidv4(),
          content:
            "**Available Commands:**\n- /help - Show this help message\n- /clear - Clear chat history\n- /topic [topic] - Change discussion topic\n- /explain [concept] - Get detailed explanation\n- /quiz [topic] - Start a quiz on a topic",
          sender: mockUsers[0],
          timestamp: new Date().toISOString(),
          status: "read",
        }

        addMessage(helpMessage)
        return
      }
    }

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: mockUsers[1],
      timestamp: new Date().toISOString(),
      status: "sent",
    }

    addMessage(userMessage)

    // Update message status to delivered after a short delay
    setTimeout(() => {
      updateMessage(userMessage.id, { status: "delivered" })
    }, 1000)

    // Update message status to read after another delay
    setTimeout(() => {
      updateMessage(userMessage.id, { status: "read" })
    }, 2000)

    // Simulate AI typing
    setIsTyping(true)

    // Simulate AI response after a delay
    const typingDuration = Math.max(1500, content.length * 30)
    setTimeout(() => {
      setIsTyping(false)

      // Generate AI response
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      let aiContent = randomResponse

      // Add more context based on user message
      if (content.toLowerCase().includes("explain")) {
        aiContent += " Let me provide a detailed explanation with examples..."
      } else if (content.toLowerCase().includes("difference")) {
        aiContent += " The key differences are..."
      } else if (content.toLowerCase().includes("how to")) {
        aiContent += " Here's a step-by-step guide:"
      }

      const aiMessage: Message = {
        id: uuidv4(),
        content: aiContent,
        sender: mockUsers[0],
        timestamp: new Date().toISOString(),
        status: "read",
      }

      addMessage(aiMessage)
    }, typingDuration)
  }

  const editMessage = (id: string, content: string) => {
    updateMessage(id, { content })
  }

  const deleteMessage = (id: string) => {
    removeMessage(id)
  }

  return {
    messages,
    sendMessage,
    isTyping,
    onlineUsers,
    editMessage,
    deleteMessage,
  }
}

