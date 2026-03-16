import { createClient } from "@/lib/supabase/server"
import { TeachersTable } from "@/components/admin/teachers-table"

export default async function TeachersPage() {
  const supabase = await createClient()

  const { data: teachers } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "teacher")
    .order("created_at", { ascending: false })

  const { data: classes } = await supabase
    .from("classes")
    .select("id, name")
    .order("name")

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name")
    .order("name")

  const { data: assignments } = await supabase
    .from("teacher_assignments")
    .select("*")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Teachers</h2>
        <p className="text-muted-foreground">
          Manage teacher accounts and class/subject assignments.
        </p>
      </div>
      <TeachersTable 
        teachers={teachers || []} 
        classes={classes || []} 
        subjects={subjects || []}
        assignments={assignments || []}
      />
    </div>
  )
}
