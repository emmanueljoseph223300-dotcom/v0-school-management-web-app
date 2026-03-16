import { createClient } from "@/lib/supabase/server"
import { ClassesTable } from "@/components/admin/classes-table"

export default async function ClassesPage() {
  const supabase = await createClient()

  const { data: classes } = await supabase
    .from("classes")
    .select("*")
    .order("name")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Classes</h2>
        <p className="text-muted-foreground">
          Manage school classes and grade levels.
        </p>
      </div>
      <ClassesTable classes={classes || []} />
    </div>
  )
}
