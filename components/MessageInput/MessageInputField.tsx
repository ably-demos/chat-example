import React, { ForwardedRef, useCallback } from "react"
import { ControllerRenderProps, useForm } from "react-hook-form"

import {
  FormControl,
  FormItem,
  FormMessage,
  useFormField,
} from "@/components/ui/form"
import EmojiSelect from "./EmojiSelect"
import { Textarea } from "../ui/textarea"
import clsx from "clsx"

type MessageInputFieldProps = Omit<
  ControllerRenderProps<{ content: string }, "content">,
  "ref"
> & {
  id?: HTMLElement["id"],
  onEmoji: (emoji: string) => void
}

export default React.forwardRef(function MessageInputField(
   { value, onEmoji, ...props }: MessageInputFieldProps,
  ref: ForwardedRef<any>
) {
  const formField = useFormField()
  return (
    <FormItem className="w-full">
      {formField.error?.type !== "too_small" ? <FormMessage /> : null}
      <FormControl>
        <div className="relative mt-2 rounded-md focus-within:ring-2 focus-within:ring-blue-600" >
          <Textarea
            placeholder="Send a message"
            className={clsx(
                "block max-h-[80px] w-full animate-accordion-up font-medium resize-none rounded-md border-0 bg-muted pr-10 text-sm leading-normal placeholder-shown:pt-4 focus-visible:ring-none placeholder-shown:leading-none ",
              value ? "min-h-[80px]" : "min-h-min"
            )}
            value={value}
            ref={ref}
            {...props}
          />
          <div className="absolute inset-y-0 right-0 flex pt-1">
            <EmojiSelect onSelect={onEmoji} />
          </div>
        </div>
      </FormControl>
    </FormItem>
  )
})
