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
        <div className="relative mt-2 rounded-md shadow-sm placeholder:text-gray-400 focus-within:ring-2 focus-within:ring-indigo-600 " >
          <Textarea
            placeholder="Send a message"
            className={clsx(
                "block min-h-[45px] max-h-[80px] w-full font-medium resize-none rounded-md border-0 bg-muted pr-10 text-sm ring-none focus-visible:ring-none sm:leading-6 placeholder-shown:leading-8",
            )}
            value={value}
            ref={ref}
            rows={value ? 3: 1}
            {...props}

          />
        <div className="absolute right-0 top-0 flex pr-1 pt-1.5">
            <EmojiSelect onSelect={onEmoji} />
        </div>
        </div>
      </FormControl>
    </FormItem>
  )
})
