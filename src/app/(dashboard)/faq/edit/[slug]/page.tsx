"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TiptapEditor } from "@/components/text-editor/editor";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateFaq } from "@/services/faq";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getFaqById } from "@/services/faq";
import ConfirmationModal from "@/components/modals/confirmation-modal";

const testimonialSchema = z.object({
  question: z.string().min(2, {
    message: "Question must be at least 2 characters.",
  }),
  answer: z
    .string()
    .min(10, {
      message: "Answer must be at least 10 characters.",
    })
    .max(500, {
      message: "    Answer must not exceed 500 characters.",
    }),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export default function TestimonialForm() {
    const [open, setOpen] = useState(false)
  const { slug } = useParams();
  const router = useRouter();

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await getFaqById(slug as string);
        console.log(response, "okkk");
        form.reset(response.data.data);
      } catch (error: any) {
        toast.error(
          error.response.data.message ||
            "Something went wrong. Please try again."
        );
        console.error("Error fetching faq data:", error);
      }
    };
    fetchTestimonial();
  }, [slug]);

  const onSubmit = async (data: TestimonialFormValues) => {
    try {
      // Simulate API call - replace with your actual submission logic
      const response = await updateFaq(data, slug as string);
      toast.success(response.message);
      router.push("/faq?type=faq");

      // Reset form
      form.reset();
    } catch (error: any) {
      toast.error(
        error.response.data.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <Card className="w-full  mx-auto">
      <CardHeader>
        <CardDescription>
          We'd love to hear about your experience. Your feedback helps us
          improve and helps others make informed decisions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(()=>setOpen(true))}>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
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
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <ConfirmationModal    
        open={open}
        onConfirm={async () => {
          await onSubmit(form.getValues())
          setOpen(false)
        }}
        title="Edit Q&A " 
        description="Are you sure you want to edit this Q&A?"
        onOpenChange={setOpen}
      />    
    </Card>
  );
}
