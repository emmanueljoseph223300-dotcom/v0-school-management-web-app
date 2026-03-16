import { createClient } from "@/lib/supabase/server"
import { StudentsTable } from "@/components/admin/students-table"

export default async function StudentsPage() {
  const supabase = await createClient()

  const { data: students } = await supabase
    .from("profiles")
    .select(`
      *,
      classes:class_id (id, name)
    `)
    .eq("role", "student")
    .order("created_at", { ascending: false })

  const { data: classes } = await supabase
    .from("classes")
    .select("id, name")
    .order("name")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Students</h2>
        <p className="text-muted-foreground">
          Manage student accounts and class assignments.
        </p>
      </div>
      <StudentsTable students={students || []} classes={classes || []} />
    </div>
  )
}
