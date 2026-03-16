import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Empty } from "@/components/ui/empty"
import { School, Users } from "lucide-react"

export default async function TeacherClassesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get teacher assignments with class and subject details
  const { data: assignments } = await supabase
    .from("teacher_assignments")
    .select(`
      *,
      class:class_id (id, name, description),
      subject:subject_id (id, name, code)
    `)
    .eq("teacher_id", user?.id)

  // Get students for each class
  const classIds = [...new Set(assignments?.map(a => a.class_id) || [])]
  
  const classStudentCounts: Record<string, number> = {}
  for (const classId of classIds) {
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student")
      .eq("class_id", classId)
    classStudentCounts[classId] = count || 0
  }

  // Group assignments by class
  const classesMapped = new Map<string, { class: { id: string; name: string; description: string | null }; subjects: { id: string; name: string; code: string | null }[] }>()
  
  assignments?.forEach((assignment) => {
    if (assignment.class) {
      if (!classesMapped.has(assignment.class.id)) {
        classesMapped.set(assignment.class.id, {
          class: assignment.class,
          subjects: []
        })
      }
      if (assignment.subject) {
        classesMapped.get(assignment.class.id)?.subjects.push(assignment.subject)
      }
    }
  })

  const classes = Array.from(classesMapped.values())

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Classes</h2>
        <p className="text-muted-foreground">
          View the classes and subjects you teach.
        </p>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <Empty
              icon={School}
              title="No classes assigned"
              description="Contact your administrator to be assigned to classes"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map(({ class: cls, subjects }) => (
            <Card key={cls.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{cls.name}</CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {classStudentCounts[cls.id] || 0}
                  </Badge>
                </div>
                {cls.description && (
                  <CardDescription>{cls.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Subjects I Teach:</p>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => (
                      <Badge key={subject.id} variant="secondary">
                        {subject.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
