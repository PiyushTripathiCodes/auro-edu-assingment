import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Message } from "@/types/chat"

interface StoreState {
  messages: Message[]
  theme: "light" | "dark"
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  updateMessage: (id: string, updates: Partial<Message>) => void
  removeMessage: (id: string) => void
  setTheme: (theme: "light" | "dark") => void
}

const useStore = create<StoreState>()(
  persist(
    (set) => ({
      messages: [],
      theme: "light",
      setMessages: (messages) => set({ messages }),
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      updateMessage: (id, updates) =>
        set((state) => ({
          messages: state.messages.map((message) => (message.id === id ? { ...message, ...updates } : message)),
        })),
      removeMessage: (id) =>
        set((state) => ({
          messages: state.messages.filter((message) => message.id !== id),
        })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        messages: state.messages,
        theme: state.theme,
      }),
    },
  ),
)

export { useStore }

