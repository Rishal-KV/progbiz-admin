"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/tables/data-table"
import Image from "next/image"
import { format } from "date-fns"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import NavBar from "@/components/ui/nav-bar"
import Link from "next/link"
import { getHero, toggleHeroStatus } from "@/services/hero"
import { StatusBadge } from "@/components/badges/custom-badges"
import { EditIcon } from "lucide-react"

export type HeroSection = {
  _id: string
  title: string
  subtitle: string
  image: {
    secure_url: string
    public_id: string
  }
  status: "active" | "inactive"
  createdAt: string
  slug?: string
}



const HeroSectionPage = () => {
  const columns: ColumnDef<HeroSection>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "subtitle",
      header: "Subtitle",
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.original.image.secure_url
        return (
          <Image
            src={imageUrl}
            alt="Hero"
            width={60}
            height={40}
            className="rounded-md object-cover"
          />
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as "active" | "inactive"
        return (
          <StatusBadge status={status} />
        ) 
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt") as string)
        return format(date, "PPP") // e.g., Aug 13, 2025
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => { 
        return (
          <div className="flex items-center gap-2">
            <Switch 
            checked={row.original.status === "active"}
            onCheckedChange={async() => {
                await toggleHeroStatus(row.original.slug as string)
                fetchHeroData()
            }}
            />
            <Link href={`/hero/edit/${row.original.slug}`}>
            <Button
              variant="outline"
              size="sm"
            
            >
              <EditIcon />
            </Button>
            </Link>
          </div>
        )
      },
    },
  ]

  const fetchHeroData = async () => {
    try {
      const response = await getHero()

      console.log(response.data)
      setData(response.data.data)
    } catch (error) {
      console.error("Error fetching hero data:", error)
    }
  }
  useEffect(() => {
    fetchHeroData()
  }, [])
  const [data, setData] = useState<HeroSection[]>([])
  return (
    <div className="space-y-6">
      <NavBar button={
        <Link href="/hero/create?type=hero">
        <Button
            type="button"
           
        >
        Create
        </Button>
        </Link>
      } label="Hero Section" />
      <DataTable columns={columns} data={data || []} />
    </div>
  )
}

export default HeroSectionPage
