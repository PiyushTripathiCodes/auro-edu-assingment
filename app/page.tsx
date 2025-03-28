"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/use-chat";
import { useTheme } from "@/hooks/use-theme";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function ChatPage() {
  const { theme, toggleTheme } = useTheme();
  const {
    messages,
    sendMessage,
    isTyping,
    onlineUsers,
    editMessage,
    deleteMessage,
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold text-primary">Auro Edu Ai Chat</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <ChatHeader onlineUsers={onlineUsers} />

      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessages
          messages={messages}
          isTyping={isTyping}
          onEditMessage={editMessage}
          onDeleteMessage={deleteMessage}
        />
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
}
