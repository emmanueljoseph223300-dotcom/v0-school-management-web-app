import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { School, ClipboardList, Megaphone, TrendingUp, BookOpen } from "lucide-react"

export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get student profile with class info
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      class:class_id (id, name)
    `)
    .eq("id", user?.id)
    .single()

  // Get student results
  const { data: results } = await supabase
    .from("results")
    .select(`
      *,
      subject:subject_id (id, name)
    `)
    .eq("student_id", user?.id)
    .order("created_at", { ascending: false })

  // Calculate average score
  const averageScore = results && results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length)
    : 0

  // Get subjects for the student's class
  const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .eq("class_id", profile?.class_id)

  // Get active announcements
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    { title: "My Class", value: profile?.class?.name || "Not Assigned", icon: School, color: "text-blue-600" },
    { title: "Results Available", value: results?.length || 0, icon: ClipboardList, color: "text-green-600" },
    { title: "Average Score", value: `${averageScore}%`, icon: TrendingUp, color: "text-purple-600" },
    { title: "Subjects", value: subjects?.length || 0, icon: BookOpen, color: "text-orange-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome, {user?.user_metadata?.first_name || "Student"}!
        </h2>
        <p className="text-muted-foreground">
          {"Here's an overview of your academic progress."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Recent Results
            </CardTitle>
            <CardDescription>Your latest exam scores</CardDescription>
          </CardHeader>
          <CardContent>
            {results && results.length > 0 ? (
              <div className="space-y-3">
                {results.slice(0, 5).map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{result.subject?.name}</p>
                      <p className="text-sm text-muted-foreground">{result.exam_type}</p>
                    </div>
                    <Badge 
                      variant={result.score >= 70 ? "default" : result.score >= 50 ? "secondary" : "destructive"}
                    >
                      {result.score}%
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No results available yet. Check back after exams.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Announcements */}
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
                    <p className="text-xs text-muted-foreground line-clamp-2">{announcement.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
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
