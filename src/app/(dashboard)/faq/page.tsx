
"use client"
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/nav-bar";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllFaqs, toggleFaqStatus } from "@/services/faq";
import { format } from "date-fns";
import { StatusBadge } from "@/components/badges/custom-badges";
import { EditIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
interface Faq {
    question: string;
    answer: string;
    status:"active" | "inactive"
    createdAt: Date;    
    slug:string
    
}

export default function FaqPage() {
    const [data, setData] = useState<Faq[]>([])

    const fetchFaqs = async () => {
        try {
            const response = await getAllFaqs()
            setData(response.data.data)
        } catch (error) {
            console.error("Error fetching faqs data:", error)
        }
    }
    useEffect(() => {
        fetchFaqs()
    }, [])

    const FaqColumns: ColumnDef<Faq>[]   = [
        {
            accessorKey: "question",
            header: "Question",
        },
        {
            accessorKey: "answer",
            header: "Answer",

            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2 max-w-sm truncate">
                        <p dangerouslySetInnerHTML={{ __html: row.original.answer }}></p>
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
                            await toggleFaqStatus(row.original.slug)
                            fetchFaqs()
                        }}
                        />
                        <Link href={`/faq/edit/${row.original.slug}`}>
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
  return (
    <div className="space-y-6">
      <NavBar button={
        <Link href="/faq/create?type=faq">
        <Button
            type="button"
           
        >
        Create
        </Button>
        </Link>
      } label="FAQ" />
      <DataTable columns={FaqColumns} data={data} />
    </div>
  );
}