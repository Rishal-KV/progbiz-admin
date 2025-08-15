import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Link, FileText } from "lucide-react"

interface About {
  heading: string
  description: string
  createdAt: string
  slug: string
  status: "active" | "inactive"
}

interface AboutModalProps {
  about: About
  children: React.ReactNode
}

export function AboutModal({ about, children }: AboutModalProps) {
  

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px] p-10">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {about.heading}
            <Badge
              variant={about.status === "active" ? "default" : "secondary"}
              className={
                about.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
              }
            >
              {about.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>View details for this about section</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileText className="h-4 w-4" />
              Description
            </div>
            <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: about.description }}></p>
          </div>

         
        </div>
      </DialogContent>
    </Dialog>
  )
}
