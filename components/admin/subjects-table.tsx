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
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"
import { Empty } from "@/components/ui/empty"
import { Plus, Pencil, Trash2, BookOpen, Loader2 } from "lucide-react"

interface Subject {
  id: string
  name: string
  code: string | null
  description: string | null
  created_at: string
}

export function SubjectsTable({ subjects: initialSubjects }: { subjects: Subject[] }) {
  const [subjects, setSubjects] = useState(initialSubjects)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editSubject, setEditSubject] = useState<Subject | null>(null)
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const resetForm = () => {
    setName("")
    setCode("")
    setDescription("")
    setEditSubject(null)
  }

  const handleSubmit = async () => {
    if (!name.trim()) return
    setIsLoading(true)

    const supabase = createClient()

    if (editSubject) {
      const { data, error } = await supabase
        .from("subjects")
        .update({ name, code: code || null, description: description || null })
        .eq("id", editSubject.id)
        .select()
        .single()

      if (!error && data) {
        setSubjects(subjects.map((s) => (s.id === editSubject.id ? data : s)))
      }
    } else {
      const { data, error } = await supabase
        .from("subjects")
        .insert({ name, code: code || null, description: description || null })
        .select()
        .single()

      if (!error && data) {
        setSubjects([...subjects, data])
      }
    }

    setIsLoading(false)
    setIsAddOpen(false)
    resetForm()
    router.refresh()
  }

  const handleDelete = async (subjectId: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return
    
    const supabase = createClient()
    await supabase.from("subjects").delete().eq("id", subjectId)
    setSubjects(subjects.filter((s) => s.id !== subjectId))
    router.refresh()
  }

  const openEdit = (subject: Subject) => {
    setEditSubject(subject)
    setName(subject.name)
    setCode(subject.code || "")
    setDescription(subject.description || "")
    setIsAddOpen(true)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-end mb-6">
          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editSubject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
                <DialogDescription>
                  {editSubject ? "Update the subject details" : "Create a new subject for the school"}
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Subject Name</FieldLabel>
                  <Input
                    id="name"
                    placeholder="e.g., Mathematics"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="code">Subject Code (Optional)</FieldLabel>
                  <Input
                    id="code"
                    placeholder="e.g., MTH"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
                  <Input
                    id="description"
                    placeholder="Brief description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <Button onClick={handleSubmit} disabled={isLoading || !name.trim()}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editSubject ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {subjects.length === 0 ? (
          <Empty
            icon={BookOpen}
            title="No subjects yet"
            description="Create your first subject to get started"
          />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>{subject.code || "-"}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {subject.description || "-"}
                    </TableCell>
                    <TableCell>
                      {new Date(subject.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(subject)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(subject.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
