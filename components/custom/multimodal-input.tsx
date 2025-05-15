"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

import { ArrowUpIcon, PaperclipIcon, StopIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import useWindowSize from "./use-window-size";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

import type {
  Attachment,
  ChatRequestOptions,
  CreateMessage,
  Message,
} from "ai";
import type { Dispatch, SetStateAction, ChangeEvent } from "react";
// import { Card } from "../ui/card"; // Card import is not used in the provided refined code for suggestions.

const suggestedActions = [
  {
    title: "أنشئ خطة تمارين رياضية", // Emoji removed
    label: "للمنزل، 30 دقيقة، بدون معدات",
    action:
      "أنشئ لي خطة تمارين رياضية منزلية لمدة 30 دقيقة، بدون الحاجة لمعدات.",
    icon: "💪",
  },
  {
    title: "أفكار وجبات صحية", // Emoji removed
    label: "لخسارة الوزن، عالية البروتين",
    action:
      "هل يمكن أن تعطيني بعض أفكار الوجبات الصحية عالية البروتين لخسارة الوزن؟",
    icon: "🥗",
  },
  {
    title: "تتبع السعرات الحرارية", // Emoji removed
    label: "كيف أحسب سعراتي اليومية؟",
    action: "كيف يمكنني حساب احتياجاتي اليومية من السعرات الحرارية؟",
    icon: "📊",
  },
  {
    title: "نصيحة تحفيزية", // Emoji removed
    label: "أشعر بالإحباط، ماذا أفعل؟",
    action: "أشعر بالإحباط تجاه التزامي بالرياضة، هل لديك نصيحة تحفيزية؟",
    icon: "🚀",
  },
];

export function MultimodalInput({
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  append,
  handleSubmit,
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [attachments, handleSubmit, setAttachments, width]);

  const uploadFile = useCallback(
    async (file: File): Promise<Attachment | undefined> => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`/api/files/upload`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const { url, pathname, contentType } = data;

          return {
            url,
            name: pathname,
            contentType: contentType,
          };
        }
        // Removed else block
        const { error } = await response.json();
        toast.error(error);
      } catch (error) {
        toast.error("Failed to upload file, please try again!");
      }
    },
    [],
  );

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment): attachment is Attachment => attachment !== undefined,
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments, uploadFile],
  );

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
          <div className="grid sm:grid-cols-2 gap-3 w-full mx-auto md:max-w-[600px]">
            {suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  delay: 0.05 * index,
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                key={suggestedAction.title} // Changed key from index to title
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  type="button"
                  onClick={async () => {
                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                  }}
                  className="group size-full text-right rounded-xl transition-all duration-200 overflow-hidden"
                >
                  <div className="relative p-4 h-full bg-background border border-border/70 dark:border-border/50 shadow-sm hover:border-primary/30 dark:hover:border-primary/40 rounded-xl flex flex-col gap-1 transition-all duration-200 group-hover:shadow-md group-hover:shadow-primary/10 dark:group-hover:shadow-primary/15">
                    <div className="flex justify-between items-start">
                      <div className="shrink-0 size-9 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-lg">
                        {suggestedAction.icon}
                      </div>
                      <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                        {suggestedAction.title}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground mt-1">
                      {suggestedAction.label}
                    </span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-5 bg-gradient-to-br from-primary/50 to-primary/10 transition-opacity duration-300 rounded-xl" />{" "}
                    {/* Made self-closing */}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}

      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-scroll">
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}

          {uploadQueue.map((filename) => (
            <PreviewAttachment
              key={filename}
              attachment={{
                url: "",
                name: filename,
                contentType: "",
              }}
              isUploading={true}
            />
          ))}
        </div>
      )}

      <Textarea
        ref={textareaRef}
        placeholder="أرسل لي رسالة 😊🤸‍♂️"
        value={input}
        onChange={handleInput}
        className="min-h-[24px] overflow-hidden resize-none rounded-lg text-base bg-muted border-none text-right"
        rows={3}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            if (isLoading) {
              toast.error("Please wait for the model to finish its response!");
            } else {
              submitForm();
            }
          }
        }}
      />

      {isLoading ? (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 left-2 m-0.5 text-white"
          onClick={(event) => {
            event.preventDefault();
            stop();
          }}
        >
          <StopIcon size={14} />
        </Button>
      ) : (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 left-2 m-0.5 text-white"
          onClick={(event) => {
            event.preventDefault();
            submitForm();
          }}
          disabled={input.length === 0 || uploadQueue.length > 0}
        >
          <ArrowUpIcon size={14} />
        </Button>
      )}

      <Button
        className="rounded-full p-1.5 h-fit absolute bottom-2 left-10 m-0.5 dark:border-zinc-700"
        onClick={(event) => {
          event.preventDefault();
          fileInputRef.current?.click();
        }}
        variant="outline"
        disabled={isLoading}
      >
        <PaperclipIcon size={14} />
      </Button>
    </div>
  );
}
