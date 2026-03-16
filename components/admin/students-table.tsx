"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"
import { Empty } from "@/components/ui/empty"
import { Plus, Pencil, Trash2, Search, Users, Loader2 } from "lucide-react"

interface Student {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  class_id: string | null
  classes: { id: string; name: string } | null
  created_at: string
}

interface Class {
  id: string
  name: string
}

export function StudentsTable({ students: initialStudents, classes }: { students: Student[]; classes: Class[] }) {
  const [students, setStudents] = useState(initialStudents)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editStudent, setEditStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const filteredStudents = students.filter((student) =>
    `${student.first_name} ${student.last_name} ${student.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const handleUpdateClass = async (studentId: string, classId: string | null) => {
    const supabase = createClient()
    await supabase.from("profiles").update({ class_id: classId }).eq("id", studentId)
    router.refresh()
  }

  const handleDelete = async (studentId: string) => {
    if (!confirm("Are you sure you want to remove this student?")) return
    
    const supabase = createClient()
    await supabase.from("profiles").delete().eq("id", studentId)
    setStudents(students.filter((s) => s.id !== studentId))
    router.refresh()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <Empty
            icon={Users}
            title="No students found"
            description={search ? "Try adjusting your search" : "Students will appear here when they sign up"}
          />
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.first_name} {student.last_name}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Select
                        value={student.class_id || "unassigned"}
                        onValueChange={(value) => 
                          handleUpdateClass(student.id, value === "unassigned" ? null : value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(student.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
