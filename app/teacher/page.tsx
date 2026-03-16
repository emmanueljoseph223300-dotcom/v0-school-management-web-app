import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { School, ClipboardList, Megaphone, Users } from "lucide-react"

export default async function TeacherDashboardPage() {
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

  // Get count of students in assigned classes
  const classIds = assignments?.map(a => a.class_id) || []
  const { count: studentsCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student")
    .in("class_id", classIds.length > 0 ? classIds : ["none"])

  // Get results uploaded by this teacher (via their classes)
  const { count: resultsCount } = await supabase
    .from("results")
    .select("*", { count: "exact", head: true })
    .in("class_id", classIds.length > 0 ? classIds : ["none"])

  // Get active announcements
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    { title: "My Classes", value: assignments?.length || 0, icon: School, color: "text-blue-600" },
    { title: "My Students", value: studentsCount || 0, icon: Users, color: "text-green-600" },
    { title: "Results Uploaded", value: resultsCount || 0, icon: ClipboardList, color: "text-purple-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome, {user?.user_metadata?.first_name || "Teacher"}!
        </h2>
        <p className="text-muted-foreground">
          {"Here's an overview of your classes and activities."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* My Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              My Assignments
            </CardTitle>
            <CardDescription>Classes and subjects you teach</CardDescription>
          </CardHeader>
          <CardContent>
            {assignments && assignments.length > 0 ? (
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{assignment.class?.name}</p>
                      <p className="text-sm text-muted-foreground">{assignment.subject?.name}</p>
                    </div>
                    <Badge variant="secondary">{assignment.subject?.name}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No classes assigned yet. Contact your administrator.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              School Announcements
            </CardTitle>
            <CardDescription>Latest news and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {announcements && announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border-l-2 border-primary pl-4">
                    <p className="font-medium text-sm">{announcement.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No announcements at this time.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
