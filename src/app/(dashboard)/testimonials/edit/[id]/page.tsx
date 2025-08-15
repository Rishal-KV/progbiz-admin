"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TiptapEditor } from "@/components/text-editor/editor"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createTestimonial, updateTestimonial } from "@/services/testimonials"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { getTestimonialById } from "@/services/testimonials"

const testimonialSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  quote: z
    .string()
    .min(10, {
      message: "Testimonial must be at least 10 characters.",
    })
    .max(500, {
      message: "Testimonial must not exceed 500 characters.",
    }),
})

type TestimonialFormValues = z.infer<typeof testimonialSchema>

export default function TestimonialForm() {
    const router = useRouter()
    const { id } = useParams()

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      role: "",
      quote: "",
    },
  })

  const onSubmit = async (data: TestimonialFormValues) => {
    try {
      // Simulate API call - replace with your actual submission logic
      const response = await updateTestimonial  (data,id as string)
      toast.success(response.message)
      router.push("/testimonials?type=testimonials")

      // Reset form
      form.reset()
    } catch (error:any) {
      toast.error(error.response.data.message || "Something went wrong. Please try again.")
    }
  }

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await getTestimonialById(id as string)
        form.reset(response.data.data)
      } catch (error:any) {
        toast.error(error.response.data.message || "Something went wrong. Please try again.")
      }
    }
    fetchTestimonial()
  }, [id])

  return (
    <Card className="w-full  mx-auto">
      <CardHeader>
        <CardDescription>
          We'd love to hear about your experience. Your feedback helps us improve and helps others make informed
          decisions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      placeholder="Enter your full name"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role/Title</FormLabel>
                    <Input
                      placeholder="e.g., CEO at Company, Student, etc."
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="quote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Testimonial</FormLabel>
                  <TiptapEditor
                content={field.value}
                onChange={field.onChange}
                
                  />
                  <FormDescription>{field.value.length}/500 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

<div className="flex justify-end">
            <Button type="submit"  disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
