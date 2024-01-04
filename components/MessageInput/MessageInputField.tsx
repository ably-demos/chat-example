import React from "react"
import { Laugh, Send } from "lucide-react"
import { ControllerRenderProps, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormDescription,
  FormItem,
  FormMessage,
  useFormField,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

import { Separator } from "../ui/separator"
import EmojiButton from "./EmojiButton"

type MessageInputFieldProps = ControllerRenderProps<
  { content: string },
  "content"
> & {
  id?: HTMLElement["id"]
}

const MessageInputField = (props: MessageInputFieldProps) => {
  const form = useForm()
  const formField = useFormField()

  console.log(props.ref)
  const inputLength = form.watch<string>(formField.name)?.length ?? 0

  return (
    <FormItem className="w-full">
      <FormMessage />
      <div className="relative flex w-full rounded-md border border-input bg-transparent pb-9 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
        <FormControl>
          <Textarea
            placeholder="Type your message..."
            className="resize-none border-none focus-visible:ring-0"
            maxLength={200}
            {...props}
          />
        </FormControl>

        <div className="absolute bottom-0 left-0 w-full">
          <Separator className="m-auto flex w-full " />
          <div className="flex w-full items-center justify-between px-2">
            <EmojiButton disabled={formField.invalid} />
            <div className="flex items-center">
              <FormDescription>{inputLength}/200</FormDescription>
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="text-primary-foreground"
                disabled={formField.invalid}
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FormItem>
  )
}

export default MessageInputField
