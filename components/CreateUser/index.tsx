"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type CreateUserProps = {
  onSubmit: (formData: FormData) => void
}

const createUserSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
})

const defaultValues: Partial<CreateUserSchema> = {
  username: undefined,
}

type CreateUserSchema = z.infer<typeof createUserSchema>

const CreateUser = ({ onSubmit }: CreateUserProps) => {
  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues,
    mode: "onChange",
  })

  return (
    <Form {...form}>
      <form action={onSubmit} className="space-y-8">
        <Card>
          <CardHeader>Username</CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name
                    or a pseudonym. You can only change this once every 30 days.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Create</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

export default CreateUser
