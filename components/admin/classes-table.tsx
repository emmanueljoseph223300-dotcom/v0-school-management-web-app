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
import { Plus, Pencil, Trash2, School, Loader2 } from "lucide-react"

interface Class {
  id: string
  name: string
  description: string | null
  created_at: string
}

export function ClassesTable({ classes: initialClasses }: { classes: Class[] }) {
  const [classes, setClasses] = useState(initialClasses)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editClass, setEditClass] = useState<Class | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const resetForm = () => {
    setName("")
    setDescription("")
    setEditClass(null)
  }

  const handleSubmit = async () => {
    if (!name.trim()) return
    setIsLoading(true)

    const supabase = createClient()

    if (editClass) {
      const { data, error } = await supabase
        .from("classes")
        .update({ name, description })
        .eq("id", editClass.id)
        .select()
        .single()

      if (!error && data) {
        setClasses(classes.map((c) => (c.id === editClass.id ? data : c)))
      }
    } else {
      const { data, error } = await supabase
        .from("classes")
        .insert({ name, description })
        .select()
        .single()

      if (!error && data) {
        setClasses([...classes, data])
      }
    }

    setIsLoading(false)
    setIsAddOpen(false)
    resetForm()
    router.refresh()
  }

  const handleDelete = async (classId: string) => {
    if (!confirm("Are you sure you want to delete this class? This will affect all students assigned to it.")) return
    
    const supabase = createClient()
    await supabase.from("classes").delete().eq("id", classId)
    setClasses(classes.filter((c) => c.id !== classId))
    router.refresh()
  }

  const openEdit = (cls: Class) => {
    setEditClass(cls)
    setName(cls.name)
    setDescription(cls.description || "")
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
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editClass ? "Edit Class" : "Add New Class"}</DialogTitle>
                <DialogDescription>
                  {editClass ? "Update the class details" : "Create a new class for the school"}
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Class Name</FieldLabel>
                  <Input
                    id="name"
                    placeholder="e.g., JSS 1, SS 2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
                  <Input
                    id="description"
                    placeholder="e.g., Junior Secondary School 1"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <Button onClick={handleSubmit} disabled={isLoading || !name.trim()}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editClass ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {classes.length === 0 ? (
          <Empty
            icon={School}
            title="No classes yet"
            description="Create your first class to get started"
          />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">{cls.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {cls.description || "-"}
                    </TableCell>
                    <TableCell>
                      {new Date(cls.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(cls)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(cls.id)}
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
