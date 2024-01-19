"use client"

import React, { useCallback, useId } from "react"
import { Maybe } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { getReactionFromCode } from "@/lib/reaction"
import { Button } from "@/components/ui/button"
import { Form, FormDescription, FormField } from "@/components/ui/form"

import EmojiButton from "../EmojiButton"
import MessageInputField from "./MessageInputField"

type Props = {
  defaultValue: string | null
  onSubmit: (value: string) => void
  onClear: () => void
}

const messageSchema = z.object({
  content: z.string().min(1).max(200, {
    message: "Cannot exceed 200 characters.",
  }),
})

export type MessageInputSchema = z.infer<typeof messageSchema>

const MessageInput = React.memo(function MessagInputInner({
  onSubmit,
  onClear: handleClear,
  defaultValue,
}: Props) {
  const textAreaId = useId()

  const form = useForm<MessageInputSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: defaultValue ?? "",
    },
    mode: "onChange",
  })

  const contentState = form.getFieldState("content")
  const contentValue = form.watch("content")

  const handleSubmit = useCallback(
    (values: MessageInputSchema) => {
      if (!values?.content) {
        console.error("No content. Assert disabled set on button.")
        return
      }

      onSubmit(values.content)
      form.reset()
    },
    [form, onSubmit]
  )

  const handleSelectEmoji = useCallback(
    (emoji: string) => {
      const fieldValue = contentValue
      form.setValue("content", `${fieldValue}${getReactionFromCode(emoji)}`)
    },
    [contentValue, form]
  )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-1 flex-col items-center space-x-2"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <MessageInputField id={textAreaId} {...field}>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <EmojiButton
                    className="rounded-none"
                    disabled={contentState.error?.type === "too_long"}
                    onSelect={handleSelectEmoji}
                  />
                  <FormDescription className="px-2">
                    {form.getValues("content")?.length ?? 0}/200
                  </FormDescription>
                </div>
                <div className="flex items-center">
                  {defaultValue ? (
                    <Button
                      onClick={handleClear}
                      variant="ghost"
                      size={"sm"}
                      className="rounded-none text-muted-foreground"
                    >
                      Clear
                    </Button>
                  ) : null}
                  <Button
                    type="submit"
                    variant="ghost"
                    className="rounded-none text-primary-foreground"
                    disabled={contentState.invalid || !contentValue?.length}
                  >
                    <Send size="20" className="" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </MessageInputField>
          )}
        />
      </form>
    </Form>
  )
})

export default MessageInput
