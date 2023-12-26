"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form"

type Props = {
  onSubmit: (value: string) => void
}

const messageSchema = z.object({
  message: z
    .string()
    .min(1, {
      message: "Must be at least 1 character.",
    })
    .max(200, {
      message: "Cannot exceed 200 characters.",
    }),
})

const MessageInput = ({ onSubmit }: Props) => {
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
    mode: "onChange",
  })

  const handleSubmit = (values: z.infer<typeof messageSchema>) => {
    if (!values?.message) return
    onSubmit(values.message)
  }
  const handleInvalid = () => {}

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}
        className="flex w-full items-center space-x-2"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="grow">
              <FormControl>
                <Textarea
                  placeholder="Type your message..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {form.getValues("message").length || 0}/200
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="icon"
          disabled={form.getValues("message").length === 0}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </Form>
  )
}

export default MessageInput

{
  /* <form className="flex w-full items-center space-x-2">
        <Textarea
          id="message"
          className="flex-1"
          autoComplete="off"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </form> */
}
