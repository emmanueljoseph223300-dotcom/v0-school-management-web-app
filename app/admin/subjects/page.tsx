import { createClient } from "@/lib/supabase/server"
import { SubjectsTable } from "@/components/admin/subjects-table"

export default async function SubjectsPage() {
  const supabase = await createClient()

  const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .order("name")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Subjects</h2>
        <p className="text-muted-foreground">
          Manage school subjects and courses.
        </p>
      </div>
      <SubjectsTable subjects={subjects || []} />
    </div>
  )
}
