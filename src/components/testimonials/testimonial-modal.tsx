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
import { Calendar, User, Briefcase, Quote } from "lucide-react"

interface Testimonial {
  _id: string
  name: string
  role: string
  quote: string
  status: "active" | "inactive"
  createdAt: Date
}

interface TestimonialModalProps {
  testimonial: Testimonial
  children: React.ReactNode
}

export function TestimonialModal({ testimonial, children }: TestimonialModalProps) {
 

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px] p-10">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {testimonial.name}
            <Badge
              variant={testimonial.status === "active" ? "default" : "secondary"}
              className={
                testimonial.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : ""
              }
            >
              {testimonial.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>View details for this testimonial</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
            Name
            </div>
            <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{testimonial.name}</code>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              Role
            </div>
            <p className="text-sm">{testimonial.role}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Quote className="h-4 w-4" />
              Quote
            </div>
            <blockquote dangerouslySetInnerHTML={{ __html: testimonial.quote }} className="text-sm leading-relaxed italic border-l-4 border-muted pl-4">
            </blockquote>
          </div>

       
        </div>
      </DialogContent>
    </Dialog>
  )
}
