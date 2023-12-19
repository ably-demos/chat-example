import React, { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type InviteUsersProps = {
  open: boolean
  channelId: string
  channelName: string
  onOpenChange: (open: boolean) => void
}

const InviteUsers = ({
  channelId,
  channelName,
  open,
  onOpenChange,
}: InviteUsersProps) => {
  const [users, setUsers] = useState<string[]>([])
  const [input, setInput] = useState("")

  const handleAddUser = () => {
    // TODO: validate email
    // TODO: check duplicate
    // TODO: check if user exists
    setUsers([...users, input])
    setInput("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 outline-none bg-background">
        <DialogHeader className="px-4 pb-4 pt-5">
          <DialogTitle>New message</DialogTitle>
          <DialogDescription>
            Invite a user to {channelName ?? "the channel"}. This will create a
            new group message.
          </DialogDescription>
        </DialogHeader>
        <div className="border-b border-muted-foreground inline-flex">
          <Input
            type="email"
            placeholder="Email"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
          />
          <Button onClick={handleAddUser}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
          {users.length > 0 ? (
            <div className="flex -space-x-2 overflow-hidden">
              {users.map((user) => (
                <p key={user}>{user}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select users to add to this thread.
            </p>
          )}
          <Button
            disabled={users.length == 0}
            onClick={() => onOpenChange(false)}
          >
            Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InviteUsers

// <Avatar
//   key={user.email}
//   className="inline-block border-2 border-background"
// >
//   <AvatarImage src={user.avatar} />
//   <AvatarFallback>{user.name[0]}</AvatarFallback>
// </Avatar>
