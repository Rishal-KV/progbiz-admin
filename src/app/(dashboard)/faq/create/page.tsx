"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm} from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createFaq } from "@/services/faq"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { TiptapEditor } from "@/components/text-editor/editor"
import { Input } from "@/components/ui/input"
import ConfirmationModal from "@/components/modals/confirmation-modal"
import { useState } from "react"
const questionAnswerSchema = z.object({
  question: z.string().min(1, "Question is required").max(200, "Question must be less than 200 characters"),
  answer: z.string().min(1, "Answer is required").max(1000, "Answer must be less than 1000 characters"),
})

type QuestionAnswerFormValues = z.infer<typeof questionAnswerSchema>

const initialData = {
  question: "",
  answer: "",
}

export default function QuestionAnswerForm() {
    const [open, setOpen] = useState(false)
    const router = useRouter()
  const form = useForm<QuestionAnswerFormValues>({
    resolver: zodResolver(questionAnswerSchema),
    defaultValues: {
      question: initialData?.question || "",
      answer: initialData?.answer || "",
    },
  })

  const onFormSubmit = async (data: QuestionAnswerFormValues) => {
    try {
      const response = await createFaq(data)
      toast.success(response.message)
      router.push("/faq?type=faq")
      form.reset()
    } catch (error:any) {
      toast.error(error.response.data.message || "Something went wrong. Please try again.")
    }
  }

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Question & Answer</CardTitle>
        <CardDescription>Configure the question and answer content for your FAQ section.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(()=>setOpen(true))} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <Input
                    placeholder="Enter your question..."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  />
                  <FormDescription>The question text (max 200 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <TiptapEditor
                    content={field.value}
                    onChange={field.onChange}
                  />
                  <FormDescription>The detailed answer content (max 1000 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
          
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Q&A"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <ConfirmationModal
        open={open}
        onConfirm={async () => {
          await onFormSubmit(form.getValues())
          setOpen(false)
        }}
        title="Create Q&A " 
        description="Are you sure you want to create this Q&A?"
        onOpenChange={setOpen}
      />    
    </Card>
  )
}
