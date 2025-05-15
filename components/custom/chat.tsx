"use client";

import { useChat } from "ai/react";
import { useState } from "react";

import { Message as PreviewMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";

import type { Attachment, Message } from "ai";

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      id,
      body: { id },
      initialMessages,
      maxSteps: 10,
      onFinish: () => {
        window.history.replaceState({}, "", `/chat/${id}`);
      },
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    // Changed to a full-screen flex column
    <div className="flex flex-col h-screen bg-background">
      {/* This div will manage the overall layout: messages area and input form */}
      <div className="flex flex-col flex-1 overflow-hidden items-center w-full">
        {/* Messages container: takes available space and scrolls */}
        <div
          ref={messagesContainerRef}
          className="flex flex-col flex-1 gap-4 w-full max-w-3xl mx-auto px-4 pt-4 pb-2 overflow-y-auto"
        >
          {messages.length === 0 && <Overview />}

          {messages.map((message) => (
            <PreviewMessage
              key={message.id}
              chatId={id}
              role={message.role}
              content={message.content}
              attachments={message.experimental_attachments}
              toolInvocations={message.toolInvocations}
            />
          ))}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>
        {/* Input form container: stays at the bottom */}
        <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[800px] max-w-[calc(100dvw-32px)] px-4 md:px-0 pb-4 md:pb-8">
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            append={append}
          />
        </form>
      </div>
    </div>
  );
}
