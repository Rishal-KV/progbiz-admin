"use client"
import { DataTable } from "@/components/tables/data-table";
import NavBar from "@/components/ui/nav-bar";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { getTestimonials, toggleTestimonialStatus } from "@/services/testimonials";
import { useState } from "react";
import { StatusBadge } from "@/components/badges/custom-badges";
import { format } from "date-fns";
import { EditIcon, EyeIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { TestimonialModal } from "@/components/testimonials/testimonial-modal";

interface Testimonial {

    _id:string
    name:string;
    role:string;
    quote:string;
    status:"active" | "inactive"
    createdAt:Date;
    
}


export default function TestimonialsPage() {

    const [data, setData] = useState<Testimonial[]>([])

    const fetchTestimonials = async () => {
        try {
            const response = await getTestimonials()
            setData(response.data.data)
        } catch (error) {
            console.error("Error fetching testimonials data:", error)
        }
    }
    useEffect(() => {
        fetchTestimonials()
    }, [])
    
    const TestimonialColumns: ColumnDef<Testimonial>[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "role",
            header: "Role",
        },
        {
            accessorKey: "quote",
            header: "Quote",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2 truncate max-w-sm">
                        <p dangerouslySetInnerHTML={{ __html: row.original.quote }} />
                    </div>
                )
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2">
                        <StatusBadge status={row.original.status} />
                    </div>
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
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2">
                        <Switch 
                        checked={row.original.status === "active"}
                        onCheckedChange={async() => {
                            await toggleTestimonialStatus(row.original._id)
                            fetchTestimonials()
                        }}
                        />
                        <Link href={`/testimonials/edit/${row.original._id}`}>
                            <Button variant="outline" size="sm">
                                <EditIcon />
                            </Button>
                        </Link>

                        <TestimonialModal testimonial={row.original}>
                            <Button variant="outline" size="sm">
                                <EyeIcon />
                            </Button>
                        </TestimonialModal>
                    </div>
                )
            },
            },
    ]
    
    return (
        <div className="space-y-6">
            <NavBar label="Testimonials" button={
                <Link href="/testimonials/create?type=testimonials">
                <Button
                    type="button"
                   
                >
                Create
                </Button>
                </Link>
            }
                
             />
            <DataTable columns={TestimonialColumns} data={data} />
        </div>
    )
}
