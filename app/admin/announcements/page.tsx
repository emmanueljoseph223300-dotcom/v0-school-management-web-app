import { createClient } from "@/lib/supabase/server"
import { AnnouncementsTable } from "@/components/admin/announcements-table"

export default async function AnnouncementsPage() {
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Announcements</h2>
        <p className="text-muted-foreground">
          Create and manage school-wide announcements.
        </p>
      </div>
      <AnnouncementsTable announcements={announcements || []} />
    </div>
  )
}
