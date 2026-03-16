"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty } from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Megaphone, Loader2, Calendar } from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  is_active: boolean
  created_at: string
}

export function AnnouncementsTable({ announcements: initialAnnouncements }: { announcements: Announcement[] }) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editAnnouncement, setEditAnnouncement] = useState<Announcement | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const resetForm = () => {
    setTitle("")
    setContent("")
    setEditAnnouncement(null)
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return
    setIsLoading(true)

    const supabase = createClient()

    if (editAnnouncement) {
      const { data, error } = await supabase
        .from("announcements")
        .update({ title, content })
        .eq("id", editAnnouncement.id)
        .select()
        .single()

      if (!error && data) {
        setAnnouncements(announcements.map((a) => (a.id === editAnnouncement.id ? data : a)))
      }
    } else {
      const { data, error } = await supabase
        .from("announcements")
        .insert({ title, content, is_active: true })
        .select()
        .single()

      if (!error && data) {
        setAnnouncements([data, ...announcements])
      }
    }

    setIsLoading(false)
    setIsAddOpen(false)
    resetForm()
    router.refresh()
  }

  const handleToggleActive = async (announcement: Announcement) => {
    const supabase = createClient()
    const { data } = await supabase
      .from("announcements")
      .update({ is_active: !announcement.is_active })
      .eq("id", announcement.id)
      .select()
      .single()

    if (data) {
      setAnnouncements(announcements.map((a) => (a.id === announcement.id ? data : a)))
    }
    router.refresh()
  }

  const handleDelete = async (announcementId: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return
    
    const supabase = createClient()
    await supabase.from("announcements").delete().eq("id", announcementId)
    setAnnouncements(announcements.filter((a) => a.id !== announcementId))
    router.refresh()
  }

  const openEdit = (announcement: Announcement) => {
    setEditAnnouncement(announcement)
    setTitle(announcement.title)
    setContent(announcement.content)
    setIsAddOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isAddOpen} onOpenChange={(open) => {
          setIsAddOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editAnnouncement ? "Edit Announcement" : "Create Announcement"}</DialogTitle>
              <DialogDescription>
                {editAnnouncement ? "Update the announcement details" : "Create a new school-wide announcement"}
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  placeholder="Announcement title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="content">Content</FieldLabel>
                <Textarea
                  id="content"
                  placeholder="Write your announcement here..."
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={isLoading || !title.trim() || !content.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editAnnouncement ? "Update" : "Publish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <Empty
              icon={Megaphone}
              title="No announcements yet"
              description="Create your first announcement to share with the school"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className={!announcement.is_active ? "opacity-60" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <Badge variant={announcement.is_active ? "default" : "secondary"}>
                        {announcement.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(announcement.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(announcement)}
                    >
                      {announcement.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(announcement)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {announcement.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
