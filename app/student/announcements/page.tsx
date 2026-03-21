import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Megaphone, Calendar, User } from "lucide-react"

export default async function StudentAnnouncementsPage() {
  const supabase = await createClient()

  // Get all active announcements
  const { data: announcements } = await supabase
    .from("announcements")
    .select(`
      *,
      author:created_by (
        first_name,
        last_name
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Announcements</h2>
        <p className="text-muted-foreground">
          Stay updated with the latest news and important information.
        </p>
      </div>

      {announcements && announcements.length > 0 ? (
        <div className="grid gap-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Megaphone className="h-5 w-5 text-primary" />
                      {announcement.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(announcement.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      {announcement.author && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {announcement.author.first_name} {announcement.author.last_name}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {isRecent(announcement.created_at) ? "New" : "Announcement"}
                  </Badge>
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
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Announcements</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              There are no announcements at this time. Check back later for updates.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function isRecent(dateString: string): boolean {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  return diffInDays <= 7
}
