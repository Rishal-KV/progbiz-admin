"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { TiptapEditor } from "@/components/text-editor/editor"
import { createAbout } from "@/services/about"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import ConfirmationModal from "@/components/modals/confirmation-modal"
import { useState } from "react"


const aboutSectionSchema = z.object({
  heading: z.string().min(1, "Heading is required").max(100, "Heading must be less than 100 characters"),
  description: z.string().min(1, "Description text is required").max(1000, "Description must be less than 1000 characters"),
})

type AboutSectionFormValues = z.infer<typeof aboutSectionSchema>

export default function AboutSectionForm() {

  const router = useRouter()
  const form = useForm<AboutSectionFormValues>({
    resolver: zodResolver(aboutSectionSchema),
    defaultValues: {
      heading: "",
      description: "",
    },
  })

  async function onFormSubmit(data: AboutSectionFormValues) {
    try {
      console.log(data)
      const response = await createAbout(data)
      router.push("/about?type=about")
      toast.success(response.message)
    } catch (error:any) {
      toast.error(error.response.data.message || "Something went wrong. Please try again.")
    }
  } 

  const [open, setOpen] = useState<boolean>  (false)

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>About Section</CardTitle>
        <CardDescription>Configure the heading and paragraph text for your about section.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => setOpen(true))} className="space-y-6">
            <FormField
              control={form.control}
              name="heading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heading</FormLabel>
                  <input
                    type="text"
                    placeholder="Enter section heading..."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  />
                  <FormDescription>The main heading for your about section (max 100 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paragraph Text</FormLabel>
                  <TiptapEditor
                    content={field.value}
                    onChange={field.onChange}
                    
                  />
                  <FormDescription>The main content for your about section (max 1000 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
           
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create About Section"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <ConfirmationModal 
        open={open}
        onConfirm={async () => {
          await onFormSubmit(form.getValues());
          setOpen(false);
        }}
        title="Create About Section"
        description="Are you sure you want to create this about section?"
        onOpenChange={setOpen}
      />  
    </Card>
  )
}
