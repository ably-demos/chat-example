import React, { ForwardedRef } from "react"
import { Send } from "lucide-react"
import { ControllerRenderProps, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormDescription,
  FormItem,
  FormMessage,
  useFormField,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

import { Input } from "../ui/input"
import EmojiButton from "./EmojiButton"

type MessageInputFieldProps = ControllerRenderProps<
  { content: string },
  "content"
> & {
  id?: HTMLElement["id"]
}

export default React.forwardRef(function MessageInputField(
  props: Omit<MessageInputFieldProps, "ref">,
  ref: ForwardedRef<any> //ControllerRenderProps["ref"]
) {
  const formField = useFormField()

  return (
    <FormItem className="w-full">
      {formField.error?.type !== "too_small" ? <FormMessage /> : null}
      <div className="relative flex w-full rounded-md border border-input bg-transparent pb-9 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
        <FormControl>
          <Input
            placeholder="Type your message..."
            className="min-h-[80px] resize-none border-none focus-visible:ring-0"
            ref={ref}
            {...props}
          />
        </FormControl>

        <div className="absolute bottom-0 left-0 w-full">
          <Separator className="m-auto flex w-full " />
          <div className="flex w-full items-center justify-between">
            <EmojiButton disabled={formField.error?.type === "too_long"} />
            <div className="flex items-center">
              {/* TODO: Fix character count*/}
              {/* <FormDescription>0/200</FormDescription> */}
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
})
