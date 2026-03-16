import { createClient } from "@/lib/supabase/server"
import { ResultsTable } from "@/components/admin/results-table"

export default async function ResultsPage() {
  const supabase = await createClient()

  const { data: results } = await supabase
    .from("results")
    .select(`
      *,
      student:student_id (id, first_name, last_name),
      subject:subject_id (id, name),
      class:class_id (id, name)
    `)
    .order("created_at", { ascending: false })
    .limit(100)

  const { data: students } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, class_id")
    .eq("role", "student")
    .order("first_name")

  const { data: classes } = await supabase
    .from("classes")
    .select("id, name")
    .order("name")

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name")
    .order("name")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Results</h2>
        <p className="text-muted-foreground">
          View and manage student examination results.
        </p>
      </div>
      <ResultsTable 
        results={results || []} 
        students={students || []} 
        classes={classes || []} 
        subjects={subjects || []} 
      />
    </div>
  )
}
