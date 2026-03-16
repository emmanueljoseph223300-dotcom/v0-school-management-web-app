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
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Search, UserCog, Loader2 } from "lucide-react"

interface Teacher {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  created_at: string
}

interface Assignment {
  id: string
  teacher_id: string
  class_id: string
  subject_id: string
}

interface Class {
  id: string
  name: string
}

interface Subject {
  id: string
  name: string
}

export function TeachersTable({ 
  teachers: initialTeachers, 
  classes, 
  subjects,
  assignments: initialAssignments 
}: { 
  teachers: Teacher[]
  classes: Class[]
  subjects: Subject[]
  assignments: Assignment[]
}) {
  const [teachers, setTeachers] = useState(initialTeachers)
  const [assignments, setAssignments] = useState(initialAssignments)
  const [search, setSearch] = useState("")
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.first_name} ${teacher.last_name} ${teacher.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const getTeacherAssignments = (teacherId: string) => {
    return assignments.filter((a) => a.teacher_id === teacherId)
  }

  const handleAssign = async () => {
    if (!selectedTeacher || !selectedClass || !selectedSubject) return
    setIsLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase
      .from("teacher_assignments")
      .insert({
        teacher_id: selectedTeacher.id,
        class_id: selectedClass,
        subject_id: selectedSubject,
      })
      .select()
      .single()

    if (!error && data) {
      setAssignments([...assignments, data])
    }

    setIsLoading(false)
    setIsAssignOpen(false)
    setSelectedClass("")
    setSelectedSubject("")
    router.refresh()
  }

  const handleRemoveAssignment = async (assignmentId: string) => {
    const supabase = createClient()
    await supabase.from("teacher_assignments").delete().eq("id", assignmentId)
    setAssignments(assignments.filter((a) => a.id !== assignmentId))
    router.refresh()
  }

  const handleDelete = async (teacherId: string) => {
    if (!confirm("Are you sure you want to remove this teacher?")) return
    
    const supabase = createClient()
    await supabase.from("profiles").delete().eq("id", teacherId)
    setTeachers(teachers.filter((t) => t.id !== teacherId))
    router.refresh()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teachers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filteredTeachers.length === 0 ? (
          <Empty
            icon={UserCog}
            title="No teachers found"
            description={search ? "Try adjusting your search" : "Teachers will appear here when they sign up"}
          />
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assignments</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => {
                  const teacherAssignments = getTeacherAssignments(teacher.id)
                  return (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">
                        {teacher.first_name} {teacher.last_name}
                      </TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacherAssignments.length === 0 ? (
                            <span className="text-muted-foreground text-sm">No assignments</span>
                          ) : (
                            teacherAssignments.slice(0, 3).map((a) => {
                              const cls = classes.find((c) => c.id === a.class_id)
                              const subj = subjects.find((s) => s.id === a.subject_id)
                              return (
                                <Badge key={a.id} variant="secondary" className="text-xs">
                                  {cls?.name} - {subj?.name}
                                </Badge>
                              )
                            })
                          )}
                          {teacherAssignments.length > 3 && (
                            <Badge variant="outline">+{teacherAssignments.length - 3}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(teacher.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={isAssignOpen && selectedTeacher?.id === teacher.id} onOpenChange={(open) => {
                            setIsAssignOpen(open)
                            if (open) setSelectedTeacher(teacher)
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                Assign
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Assign Class & Subject</DialogTitle>
                                <DialogDescription>
                                  Assign a class and subject to {teacher.first_name} {teacher.last_name}
                                </DialogDescription>
                              </DialogHeader>
                              <FieldGroup>
                                <Field>
                                  <FieldLabel>Class</FieldLabel>
                                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id}>
                                          {cls.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </Field>
                                <Field>
                                  <FieldLabel>Subject</FieldLabel>
                                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {subjects.map((subj) => (
                                        <SelectItem key={subj.id} value={subj.id}>
                                          {subj.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </Field>
                              </FieldGroup>
                              <DialogFooter>
                                <Button onClick={handleAssign} disabled={isLoading || !selectedClass || !selectedSubject}>
                                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                  Assign
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(teacher.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
