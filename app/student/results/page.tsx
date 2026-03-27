import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ClipboardList, TrendingUp, Award, AlertCircle } from "lucide-react"

export default async function StudentResultsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get all results for this student
  const { data: results } = await supabase
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
      remarks,
      created_at,
      subject:subject_id (id, name)
    `)
    .eq("student_id", user?.id)
    .order("created_at", { ascending: false })

  // Calculate statistics using total field from database
  const totalResults = results?.length || 0
  const averageScore = totalResults > 0
    ? Math.round((results?.reduce((sum, r) => sum + (r.total || 0), 0) || 0) / totalResults)
    : 0
  const highestScore = totalResults > 0
    ? Math.max(...(results?.map(r => r.total || 0) || [0]))
    : 0
  const passingResults = results?.filter(r => (r.total || 0) >= 50).length || 0

  const stats = [
    { title: "Total Results", value: totalResults, icon: ClipboardList, color: "text-blue-600" },
    { title: "Average Score", value: `${averageScore}%`, icon: TrendingUp, color: "text-green-600" },
    { title: "Highest Score", value: `${highestScore}%`, icon: Award, color: "text-purple-600" },
    { title: "Pass Rate", value: totalResults > 0 ? `${Math.round((passingResults / totalResults) * 100)}%` : "N/A", icon: AlertCircle, color: "text-orange-600" },
  ]

  const getScoreBadge = (total: number) => {
    if (total >= 80) return { variant: "default" as const, label: "Excellent" }
    if (total >= 70) return { variant: "default" as const, label: "Good" }
    if (total >= 60) return { variant: "secondary" as const, label: "Average" }
    if (total >= 50) return { variant: "secondary" as const, label: "Pass" }
    return { variant: "destructive" as const, label: "Needs Improvement" }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Results</h2>
        <p className="text-muted-foreground">
          View all your exam scores and academic performance.
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

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Results</CardTitle>
          <CardDescription>Complete list of your exam results</CardDescription>
        </CardHeader>
        <CardContent>
          {results && results.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Term / Session</TableHead>
                  <TableHead>CA Score</TableHead>
                  <TableHead>Exam Score</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => {
                  const badge = getScoreBadge(result.total || 0)
                  return (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.subject?.name}</TableCell>
                      <TableCell>{result.term} - {result.session}</TableCell>
                      <TableCell>{result.ca_score}</TableCell>
                      <TableCell>{result.exam_score}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${(result.total || 0) >= 50 ? "text-green-600" : "text-red-600"}`}>
                          {result.total}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={badge.variant}>{result.grade || badge.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {result.remarks || "-"}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No Results Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Your exam results will appear here once they are uploaded by your teachers.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
