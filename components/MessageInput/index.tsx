"use client"

import React, { useCallback, useId } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"

import MessageInputField from "./MessageInputField"

type Props = {
  onSubmit: (value: string) => void
}

const messageSchema = z.object({
  content: z.string().min(1).max(200, {
    message: "Cannot exceed 200 characters.",
  }),
})

export type MessageInputSchema = z.infer<typeof messageSchema>

const MessageInput = React.memo(function MessagInputInner({ onSubmit }: Props) {
  const textAreaId = useId()

  const form = useForm<MessageInputSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
    mode: "onChange",
  })

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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-2"
      >
        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <MessageInputField
                id={textAreaId}
                {...field}
                onSubmit={handleSubmit}
              />
            )}
          />
          <Button
            type="submit"
            size="sm"
            className="w-85 max-h-[45px] min-h-[45px] bg-blue-700"
          >
            Send
          </Button>
        </div>
      </form>
    </Form>
  )
})

export default MessageInput
