import React, { ForwardedRef, useEffect } from "react"
import { ControllerRenderProps } from "react-hook-form"

import {
  FormControl,
  FormItem,
  FormMessage,
  useFormField,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

type MessageInputFieldProps = Omit<
  ControllerRenderProps<{ content: string }, "content">,
  "ref"
> & {
  id?: HTMLElement["id"]
  onClear?: () => void
  showClear?: boolean
  children?: React.ReactNode
}

export default React.forwardRef(function MessageInputField(
  { showClear, children, ...props }: MessageInputFieldProps,
  ref: ForwardedRef<any>
) {
  const formField = useFormField()
  useEffect(() => {
    console.log("remount")
  }, [])

  return (
    <FormItem className="w-full">
      {formField.error?.type !== "too_small" ? <FormMessage /> : null}
      <div className="relative flex w-full rounded-md border border-input bg-transparent pb-9 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
        <FormControl>
          <Textarea
            placeholder="Type your message..."
            className="min-h-[80px] resize-none border-none focus-visible:ring-0"
            ref={ref}
            {...props}
          />
        </FormControl>

        <div className="absolute bottom-0 left-0 w-full">
          <Separator className="m-auto flex w-full" />
          {children}
        </div>
      </div>
    </FormItem>
  )
})
