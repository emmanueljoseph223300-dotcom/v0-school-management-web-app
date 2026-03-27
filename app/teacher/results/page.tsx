import { createClient } from "@/lib/supabase/server"
import { TeacherResultsForm } from "@/components/teacher/teacher-results-form"

export default async function TeacherResultsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get teacher assignments
  const { data: assignments } = await supabase
    .from("teacher_assignments")
    .select(`
      *,
      class:class_id (id, name),
      subject:subject_id (id, name)
    `)
    .eq("teacher_id", user?.id)

  // Get students for assigned classes
  const classIds = [...new Set(assignments?.map(a => a.class_id) || [])]
  
  const { data: students } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, class_id")
    .eq("role", "student")
    .in("class_id", classIds.length > 0 ? classIds : ["none"])
    .order("first_name")

  // Get existing results
  const { data: existingResults } = await supabase
    .from("results")
    .select(`
      id,
      student_id,
      subject_id,
      class_id,
      term,
      session,
      ca_score,
      exam_score,
      total,
      grade,
      created_at,
      student:student_id (id, first_name, last_name),
      subject:subject_id (id, name),
      class:class_id (id, name)
    `)
    .in("class_id", classIds.length > 0 ? classIds : ["none"])
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Upload Results</h2>
        <p className="text-muted-foreground">
          Enter and manage student examination results for your classes.
        </p>
      </div>
      <TeacherResultsForm 
        assignments={assignments || []} 
        students={students || []}
        existingResults={existingResults || []}
      />
    </div>
  )
}
