
"use client"
import { AboutModal } from "@/components/about/about-details-modal";
import { StatusBadge } from "@/components/badges/custom-badges";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/nav-bar";
import { Switch } from "@/components/ui/switch";
import { getAbout, toggleAboutStatus } from "@/services/about";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EditIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface About {
    heading: string;
    description: string;
    createdAt: string;
    slug: string;
    status: "active" | "inactive"
}




export default function AboutPage() {

    const [data, setData] = useState<About[]>([])

    const columns: ColumnDef<About>[] = [
        {
            accessorKey: "heading",
            header: "Heading",
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2 max-w-sm truncate">
                        <p dangerouslySetInnerHTML={{ __html: row.original.description }} />
                    </div>
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
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2">
                        <Switch 
                        checked={row.original.status === "active"}
                        onCheckedChange={async() => {
                            await toggleAboutStatus(row.original.slug)
                            fetchAboutData()
                        }}
                        />
                        <Link href={`/about/edit/${row.original.slug}`}>
                            <Button variant="outline" size="sm">
                                <EditIcon />
                            </Button>
                        </Link>
                        <AboutModal  about={row.original}>
                            <Button variant="outline" size="sm">
                                <EyeIcon />
                            </Button>
                        </AboutModal>
                    </div>
                )
            },
        },
    ];

    const fetchAboutData = async () => {
        try {
            const response = await getAbout()
            setData(response.data.data)
        } catch (error) {
            console.error("Error fetching about data:", error)
        }
    }
    useEffect(() => {
        fetchAboutData()
    }, [])

 
    
    return (
        <div className="space-y-6">
            <NavBar label="About Section"  button={

                <Link href="/about/create">
                <Button>
                    Create
                </Button>
                </Link>
            } />
            <DataTable columns={columns} data={data} />
        </div>
    );


}