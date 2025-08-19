"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { createHero, getHeroById, updateHero } from "@/services/hero"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import ConfirmationModal from "@/components/modals/confirmation-modal"

// Zod schema for form validation
const heroFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  subtitle: z.string().min(1, "Subtitle is required").max(500, "Subtitle must be less than 500 characters"),
  image: z.any().optional(), // We'll handle file validation separately
})

type HeroFormValues = z.infer<typeof heroFormSchema>

export default function HeroAdminForm() {
    const { slug } = useParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageError, setImageError] = useState<string>("")
  const [existingImagePublicId, setExistingImagePublicId] = useState<string | null>(null)

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      image: undefined,
    },

  })

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await getHeroById(slug as string)

        console.log(response,"okkk")
        form.setValue("title", response.data.data.title)
        form.setValue("subtitle", response.data.data.subtitle)
        form.setValue("image", response.data.data.image.secure_url)
        setImagePreview(response.data.data.image.secure_url)
        setExistingImagePublicId(response.data.data.image.public_id)
      } catch (error) {
        console.error("Error fetching hero data:", error)
      }
    }
    fetchHeroData()
  }, [slug])

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const onSubmit = async (data: HeroFormValues) => {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("subtitle", data.subtitle)

    if (existingImagePublicId) {
      formData.append("oldImagePublicId", existingImagePublicId)
    }

    if (imageFile) {
      formData.append("image", imageFile)
    }

  

    setImageError("")

    try {
      setIsSubmitting(true)

      const response = await updateHero(formData,slug as string)
      router.push("/hero?type=hero")
      
      toast.success(response.message)      
        // Reset form
      form.reset()
      setImageFile(null)
      setImagePreview("")
      
      // You can add a success toast here
      // toast({
      //   title: "Success",
      //   description: "Hero section updated successfully!",
      // })


    } catch (error:any) {

      toast.error(error.response.data.message || "Something went wrong. Please try again.")
      // toast({
      //   title: "Error",
      //   description: "Something went wrong. Please try again.",
      //   variant: "destructive",
      // })
    }
    finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setImageError("")

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setImageError("Please select an image file.")
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setImageError("Please select an image smaller than 5MB.")
        return
      }

      setImageFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    setImageError("")
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const [open, setOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Hero Section</CardTitle>
        <CardDescription>Update the title, subtitle, and image for your hero section.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(()=>setOpen(true))} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter hero title..." {...field} />
                  </FormControl>
                  <FormDescription>
                    The main heading that will appear in your hero section.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter hero subtitle..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Supporting text that provides more context about your offering.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Hero Image</FormLabel>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
              />

              <div
                onClick={triggerFileInput}
                className="relative w-full h-48 border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-ring transition-colors bg-muted/50 hover:bg-muted/80"
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Hero preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage()
                      }}
                      className="absolute top-2 right-2 h-8 px-2 text-xs"
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-sm font-medium">Click to upload image</p>
                    <p className="text-xs">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>

              {imageFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}

              {imageError && (
                <p className="text-sm text-destructive">{imageError}</p>
              )}

              <FormDescription>
                Click the box above to select an image file for the hero section. Maximum size: 5MB.
              </FormDescription>
            </div>

            <div className="w-full flex justify-end items-center">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
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
        title="Update Hero Section" 
        description="Are you sure you want to update this hero section?"
        onOpenChange={setOpen}
      />        
    </Card>
  )
}