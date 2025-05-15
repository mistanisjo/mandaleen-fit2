"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

import { cn } from "@/lib/utils";

import MarkdownTableRenderer from "./markdown-table-renderer";
import { PreviewAttachment } from "./preview-attachment";
import { Weather } from "./weather";
import { AuthorizePayment } from "../flights/authorize-payment";
import { DisplayBoardingPass } from "../flights/boarding-pass";
import { CreateReservation } from "../flights/create-reservation";
import { FlightStatus } from "../flights/flight-status";
import { ListFlights } from "../flights/list-flights";
import { SelectSeats } from "../flights/select-seats";
import { VerifyPayment } from "../flights/verify-payment";

import type { Attachment, ToolInvocation } from "ai";
import type { ReactNode } from "react";

// Modern icon components
const ModernUserIcon = () => (
  <User className="size-4 text-primary-foreground" />
);

const ModernBotIcon = () => (
  <Bot className="size-4 text-secondary-foreground" />
);

// Message loading animation
const MessageLoading = () => (
  <div className="flex space-x-1.5 items-center justify-center py-2">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="size-1.5 rounded-full bg-primary/60"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.2,
          repeat: Number.POSITIVE_INFINITY,
          delay: i * 0.2,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export const Message = ({
  chatId,
  role,
  content,
  toolInvocations,
  attachments,
}: {
  chatId: string;
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  const isUser = role === "user";

  return (
    <motion.div
      className="flex flex-row gap-5 px-4 w-full md:w-[800px] md:px-0 first-of-type:pt-20"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div
        className={cn(
          "flex-shrink-0 mt-1 h-8 w-8 rounded-lg shadow-sm border border-border/30 flex items-center justify-center",
          isUser ? "bg-primary" : "bg-secondary",
        )}
      >
        {isUser ? <ModernUserIcon /> : <ModernBotIcon />}
      </div>

      <div
        className={cn(
          "flex flex-col gap-3 w-full",
          isUser ? "items-start" : "items-start", // Note: both are items-start, might be intentional or a small oversight by the refiner
        )}
      >
        {content && typeof content === "string" && (
          <motion.div
            className={cn(
              "px-4 py-3 rounded-2xl shadow-sm max-w-[90%]",
              isUser
                ? "bg-primary text-primary-foreground rounded-tl-sm"
                : "bg-card text-card-foreground dark:bg-slate-800/80 rounded-tr-sm border border-border/10",
            )}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-sm flex flex-col gap-4">
              <MarkdownTableRenderer markdownContent={content} />
            </div>
          </motion.div>
        )}

        {toolInvocations && (
          <div
            className={cn(
              "flex flex-col gap-4 p-4 rounded-2xl max-w-[90%]",
              "bg-card dark:bg-slate-800/80 border border-border/10 shadow-sm",
            )}
          >
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "result") {
                const { result } = toolInvocation;

                return (
                  <div key={toolCallId}>
                    {toolName === "getWeather" ? (
                      <Weather weatherAtLocation={result} />
                    ) : toolName === "displayFlightStatus" ? (
                      <FlightStatus flightStatus={result} />
                    ) : toolName === "searchFlights" ? (
                      <ListFlights chatId={chatId} results={result} />
                    ) : toolName === "selectSeats" ? (
                      <SelectSeats chatId={chatId} availability={result} />
                    ) : toolName === "createReservation" ? (
                      Object.keys(result).includes("error") ? null : (
                        <CreateReservation reservation={result} />
                      )
                    ) : toolName === "authorizePayment" ? (
                      <AuthorizePayment intent={result} />
                    ) : toolName === "displayBoardingPass" ? (
                      <DisplayBoardingPass boardingPass={result} />
                    ) : toolName === "verifyPayment" ? (
                      <VerifyPayment result={result} />
                    ) : (
                      <div className="text-sm font-mono p-2 bg-muted rounded-md overflow-auto">
                        {JSON.stringify(result, null, 2)}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={toolCallId} className="animate-pulse">
                  {toolName === "getWeather" ? (
                    <Weather />
                  ) : toolName === "displayFlightStatus" ? (
                    <FlightStatus />
                  ) : toolName === "searchFlights" ? (
                    <ListFlights chatId={chatId} />
                  ) : toolName === "selectSeats" ? (
                    <SelectSeats chatId={chatId} />
                  ) : toolName === "createReservation" ? (
                    <CreateReservation />
                  ) : toolName === "authorizePayment" ? (
                    <AuthorizePayment />
                  ) : toolName === "displayBoardingPass" ? (
                    <DisplayBoardingPass />
                  ) : (
                    <MessageLoading />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {attachments && (
          <div className="flex flex-row gap-2 mt-2">
            {attachments.map((attachment) => (
              <motion.div
                key={attachment.url}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <PreviewAttachment attachment={attachment} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
