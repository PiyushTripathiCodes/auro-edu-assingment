"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/types/chat"
import { motion } from "framer-motion"

interface ChatHeaderProps {
  onlineUsers: User[]
}

export default function ChatHeader({ onlineUsers }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b bg-muted/30">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">AI Learning Assistant</h2>
          <p className="text-sm text-muted-foreground">Ask questions about any topic</p>
        </div>
        <div className="flex -space-x-2">
          {onlineUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Avatar className="border-2 border-background">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              {user.status === "online" && (
                <Badge
                  variant="default"
                  className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 p-0"
                />
              )}
              {user.status === "typing" && (
                <Badge variant="default" className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-blue-500 p-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

