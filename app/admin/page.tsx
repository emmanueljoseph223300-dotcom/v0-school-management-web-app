import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCog, School, BookOpen, ClipboardList, Megaphone, TrendingUp } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch counts
  const [
    { count: studentsCount },
    { count: teachersCount },
    { count: classesCount },
    { count: subjectsCount },
    { count: resultsCount },
    { count: announcementsCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "teacher"),
    supabase.from("classes").select("*", { count: "exact", head: true }),
    supabase.from("subjects").select("*", { count: "exact", head: true }),
    supabase.from("results").select("*", { count: "exact", head: true }),
    supabase.from("announcements").select("*", { count: "exact", head: true }),
  ])

  // Fetch recent announcements
  const { data: recentAnnouncements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    { title: "Total Students", value: studentsCount || 0, icon: Users, color: "text-blue-600" },
    { title: "Total Teachers", value: teachersCount || 0, icon: UserCog, color: "text-green-600" },
    { title: "Classes", value: classesCount || 0, icon: School, color: "text-purple-600" },
    { title: "Subjects", value: subjectsCount || 0, icon: BookOpen, color: "text-orange-600" },
    { title: "Results Uploaded", value: resultsCount || 0, icon: ClipboardList, color: "text-pink-600" },
    { title: "Announcements", value: announcementsCount || 0, icon: Megaphone, color: "text-cyan-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back, Admin!</h2>
        <p className="text-muted-foreground">
          {"Here's an overview of your school's data."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      {/* Quick Stats and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Stats
            </CardTitle>
            <CardDescription>School performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Student-Teacher Ratio</span>
                <span className="font-semibold">
                  {teachersCount ? Math.round((studentsCount || 0) / teachersCount) : 0}:1
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Class Size</span>
                <span className="font-semibold">
                  {classesCount ? Math.round((studentsCount || 0) / classesCount) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subjects per Class</span>
                <span className="font-semibold">
                  {classesCount ? Math.round((subjectsCount || 0) / classesCount) : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Recent Announcements
            </CardTitle>
            <CardDescription>Latest school announcements</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAnnouncements && recentAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="border-l-2 border-primary pl-4">
                    <p className="font-medium text-sm">{announcement.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No announcements yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
