"use client"

import React, { useCallback, useId } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { getReactionFromCode } from "@/lib/reaction"
import { Button } from "@/components/ui/button"
import { Form, FormDescription, FormField } from "@/components/ui/form"

import EmojiSelect from "./EmojiSelect"
import MessageInputField from "./MessageInputField"

type Props = {
  defaultValue: string | null
  onSubmit: (value: string) => void
}

const messageSchema = z.object({
  content: z.string().min(1).max(200, {
    message: "Cannot exceed 200 characters.",
  }),
})

export type MessageInputSchema = z.infer<typeof messageSchema>

const MessageInput = React.memo(function MessagInputInner({
  onSubmit,
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

  const handleAddEmoji = useCallback(
    (emoji: string) => {
      const fieldValue = contentValue
      console.log("emoji", emoji)
      console.log("fieldValue", fieldValue)
      form.setValue("content", `${fieldValue}${getReactionFromCode(emoji)}`)
    },
    [contentValue, form]
  )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-2"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <MessageInputField id={textAreaId} {...field} onEmoji={handleAddEmoji} />
          )}
        />
        <div className="flex w-full items-center justify-between">
            <FormDescription className="px-2">
              <span>{form.getValues("content")?.length ?? 0}/200</span>
            </FormDescription>
          <div className="flex items-center">
            <Button
              type="submit"
              size="sm"
              className="bg-blue-700"
            >
              Send
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
})

export default MessageInput
