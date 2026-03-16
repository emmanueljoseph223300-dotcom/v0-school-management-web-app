"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty } from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Loader2, Save, Trash2 } from "lucide-react"

interface Assignment {
  id: string
  class_id: string
  subject_id: string
  class: { id: string; name: string } | null
  subject: { id: string; name: string } | null
}

interface Student {
  id: string
  first_name: string | null
  last_name: string | null
  class_id: string | null
}

interface ExistingResult {
  id: string
  student_id: string
  subject_id: string
  class_id: string
  term: string
  session: string
  ca_score: number | null
  exam_score: number | null
  total_score: number | null
  grade: string | null
  student: { id: string; first_name: string; last_name: string } | null
  subject: { id: string; name: string } | null
  class: { id: string; name: string } | null
}

export function TeacherResultsForm({ 
  assignments, 
  students,
  existingResults: initialResults
}: { 
  assignments: Assignment[]
  students: Student[]
  existingResults: ExistingResult[]
}) {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [term, setTerm] = useState("First Term")
  const [session, setSession] = useState("2024/2025")
  const [scores, setScores] = useState<Record<string, { ca: string; exam: string }>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [existingResults, setExistingResults] = useState(initialResults)
  const router = useRouter()

  // Get unique classes from assignments
  const uniqueClasses = Array.from(
    new Map(assignments.map(a => [a.class_id, a.class])).values()
  ).filter(Boolean) as { id: string; name: string }[]

  // Get subjects for selected class
  const availableSubjects = assignments
    .filter(a => a.class_id === selectedClass && a.subject)
    .map(a => a.subject) as { id: string; name: string }[]

  // Get students for selected class
  const classStudents = students.filter(s => s.class_id === selectedClass)

  const calculateGrade = (total: number): string => {
    if (total >= 70) return "A"
    if (total >= 60) return "B"
    if (total >= 50) return "C"
    if (total >= 45) return "D"
    if (total >= 40) return "E"
    return "F"
  }

  const getGradeColor = (grade: string | null) => {
    switch (grade) {
      case "A": return "bg-green-100 text-green-800"
      case "B": return "bg-blue-100 text-blue-800"
      case "C": return "bg-yellow-100 text-yellow-800"
      case "D": return "bg-orange-100 text-orange-800"
      case "E": return "bg-red-100 text-red-800"
      case "F": return "bg-red-200 text-red-900"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleScoreChange = (studentId: string, type: "ca" | "exam", value: string) => {
    setScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [type]: value
      }
    }))
  }

  const handleSubmitResults = async () => {
    if (!selectedClass || !selectedSubject) return
    setIsLoading(true)

    const supabase = createClient()
    const resultsToInsert = []

    for (const student of classStudents) {
      const studentScores = scores[student.id]
      if (studentScores && (studentScores.ca || studentScores.exam)) {
        const ca = parseFloat(studentScores.ca) || 0
        const exam = parseFloat(studentScores.exam) || 0
        const total = ca + exam
        const grade = calculateGrade(total)

        resultsToInsert.push({
          student_id: student.id,
          subject_id: selectedSubject,
          class_id: selectedClass,
          term,
          session,
          ca_score: ca,
          exam_score: exam,
          total_score: total,
          grade,
        })
      }
    }

    if (resultsToInsert.length > 0) {
      const { data, error } = await supabase
        .from("results")
        .upsert(resultsToInsert, { 
          onConflict: "student_id,subject_id,class_id,term,session",
          ignoreDuplicates: false 
        })
        .select(`
          *,
          student:student_id (id, first_name, last_name),
          subject:subject_id (id, name),
          class:class_id (id, name)
        `)

      if (!error && data) {
        setExistingResults(prev => {
          const newIds = new Set(data.map(r => r.id))
          return [...data, ...prev.filter(r => !newIds.has(r.id))]
        })
        setScores({})
      }
    }

    setIsLoading(false)
    router.refresh()
  }

  const handleDeleteResult = async (resultId: string) => {
    if (!confirm("Are you sure you want to delete this result?")) return
    
    const supabase = createClient()
    await supabase.from("results").delete().eq("id", resultId)
    setExistingResults(existingResults.filter(r => r.id !== resultId))
    router.refresh()
  }

  // Filter existing results based on selection
  const filteredExistingResults = existingResults.filter(r => 
    (!selectedClass || r.class_id === selectedClass) &&
    (!selectedSubject || r.subject_id === selectedSubject)
  )

  return (
    <div className="space-y-6">
      {/* Selection Form */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Results</CardTitle>
          <CardDescription>Select a class and subject to enter results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Field>
              <FieldLabel>Class</FieldLabel>
              <Select value={selectedClass} onValueChange={(v) => { setSelectedClass(v); setSelectedSubject(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Subject</FieldLabel>
              <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((subj) => (
                    <SelectItem key={subj.id} value={subj.id}>{subj.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Term</FieldLabel>
              <Select value={term} onValueChange={setTerm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="First Term">First Term</SelectItem>
                  <SelectItem value="Second Term">Second Term</SelectItem>
                  <SelectItem value="Third Term">Third Term</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Session</FieldLabel>
              <Input value={session} onChange={(e) => setSession(e.target.value)} placeholder="2024/2025" />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Score Entry Table */}
      {selectedClass && selectedSubject && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Enter Scores</CardTitle>
              <CardDescription>Enter CA (max 40) and Exam (max 60) scores for each student</CardDescription>
            </div>
            <Button onClick={handleSubmitResults} disabled={isLoading || Object.keys(scores).length === 0}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Results
            </Button>
          </CardHeader>
          <CardContent>
            {classStudents.length === 0 ? (
              <Empty
                icon={ClipboardList}
                title="No students in this class"
                description="Students need to be assigned to this class first"
              />
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="w-32">CA Score (40)</TableHead>
                      <TableHead className="w-32">Exam Score (60)</TableHead>
                      <TableHead className="w-24 text-center">Total</TableHead>
                      <TableHead className="w-24 text-center">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classStudents.map((student) => {
                      const ca = parseFloat(scores[student.id]?.ca || "0") || 0
                      const exam = parseFloat(scores[student.id]?.exam || "0") || 0
                      const total = ca + exam
                      const grade = total > 0 ? calculateGrade(total) : "-"
                      
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.first_name} {student.last_name}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="40"
                              placeholder="0"
                              value={scores[student.id]?.ca || ""}
                              onChange={(e) => handleScoreChange(student.id, "ca", e.target.value)}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="60"
                              placeholder="0"
                              value={scores[student.id]?.exam || ""}
                              onChange={(e) => handleScoreChange(student.id, "exam", e.target.value)}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {total > 0 ? total : "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            {grade !== "-" && <Badge className={getGradeColor(grade)}>{grade}</Badge>}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Existing Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Results</CardTitle>
          <CardDescription>Results you have uploaded</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredExistingResults.length === 0 ? (
            <Empty
              icon={ClipboardList}
              title="No results yet"
              description="Results you upload will appear here"
            />
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead className="text-center">CA</TableHead>
                    <TableHead className="text-center">Exam</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExistingResults.slice(0, 20).map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">
                        {result.student?.first_name} {result.student?.last_name}
                      </TableCell>
                      <TableCell>{result.class?.name}</TableCell>
                      <TableCell>{result.subject?.name}</TableCell>
                      <TableCell>{result.term}</TableCell>
                      <TableCell className="text-center">{result.ca_score}</TableCell>
                      <TableCell className="text-center">{result.exam_score}</TableCell>
                      <TableCell className="text-center font-semibold">{result.total_score}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={getGradeColor(result.grade)}>{result.grade}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteResult(result.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
