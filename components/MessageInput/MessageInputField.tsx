import React, { ForwardedRef } from "react"
import clsx from "clsx"
import { ControllerRenderProps } from "react-hook-form"

import {
  FormControl,
  FormItem,
  FormMessage,
  useFormField,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { MessageInputSchema } from "@/components/MessageInput/index"

type MessageInputFieldProps = Omit<
  ControllerRenderProps<{ content: string }, "content">,
  "ref"
> & {
  id?: HTMLElement["id"]
} & { onSubmit: (values: MessageInputSchema) => void }

export default React.forwardRef(function MessageInputField(
  { value, onSubmit, ...props }: MessageInputFieldProps,
  ref: ForwardedRef<any>
) {
  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault() // Prevent default form submission
      onSubmit({ content: value }) // Call the onSubmit function
    }
  }

  const formField = useFormField()
  return (
    <FormItem className="w-full">
      {formField.error?.type !== "too_small" ? <FormMessage /> : null}
      <FormControl>
        <div className="relative rounded-md shadow-sm placeholder:text-gray-400 focus-within:ring-2 focus-within:ring-indigo-600 ">
          <Textarea
            placeholder=""
            className={clsx(
              "block min-h-[45px] max-h-[45px] w-full font-medium resize-none rounded-md border-0 bg-muted pr-10 text-sm ring-none focus-visible:ring-none sm:leading-6 placeholder-shown:leading-8"
            )}
            value={value}
            ref={ref}
            rows={value ? 3 : 1}
            onKeyDown={handleKeyDown}
            {...props}
          />
        </div>
      </FormControl>
    </FormItem>
  )
})
