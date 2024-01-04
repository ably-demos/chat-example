"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form, FormField } from "@/components/ui/form"

import MessageInputField from "./MessageInputField"

type Props = {
  onSubmit: (value: string) => void
}

const messageSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: "Must be at least 1 character.",
    })
    .max(200, {
      message: "Cannot exceed 200 characters.",
    }),
})

export type MessageInputSchema = z.infer<typeof messageSchema>

const MessageInput = ({ onSubmit }: Props) => {
  const form = useForm<MessageInputSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
    mode: "onChange",
  })

  const textAreaId = React.useId()
  const handleSubmit = (values: MessageInputSchema) => {
    console.log(values)
    if (!values?.content) {
      console.error("No content. Assert disabled set on button.")
      return
    }
    onSubmit(values.content)
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-1 items-center space-x-2"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <MessageInputField id={textAreaId} {...field} />
          )}
        />
      </form>
    </Form>
  )
}

export default MessageInput
