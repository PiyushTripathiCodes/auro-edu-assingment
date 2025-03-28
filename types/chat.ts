export type UserStatus = "online" | "offline" | "typing"
export type UserRole = "user" | "assistant" | "system"
export type MessageStatus = "sent" | "delivered" | "read"

export interface User {
  id: string
  name: string
  role: UserRole
  avatar: string
  status: UserStatus
}

export interface Message {
  id: string
  content: string
  sender: User
  timestamp: string
  status?: MessageStatus
}

