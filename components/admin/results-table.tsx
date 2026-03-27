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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"
import { Empty } from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Search, ClipboardList, Loader2 } from "lucide-react"

interface Result {
  id: string
  student_id: string
  subject_id: string
  class_id: string
  term: string
  session: string
  ca_score: number | null
  exam_score: number | null
  total: number | null
  grade: string | null
  student: { id: string; first_name: string; last_name: string } | null
  subject: { id: string; name: string } | null
  class: { id: string; name: string } | null
  created_at: string
}

interface Student {
  id: string
  first_name: string | null
  last_name: string | null
  class_id: string | null
}

interface Class {
  id: string
  name: string
}

interface Subject {
  id: string
  name: string
}

export function ResultsTable({ 
  results: initialResults, 
  students,
  classes, 
  subjects 
}: { 
  results: Result[]
  students: Student[]
  classes: Class[]
  subjects: Subject[]
}) {
  const [results, setResults] = useState(initialResults)
  const [search, setSearch] = useState("")
  const [filterClass, setFilterClass] = useState<string>("all")
  const [filterTerm, setFilterTerm] = useState<string>("all")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Form state
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [term, setTerm] = useState("First Term")
  const [session, setSession] = useState("2024/2025")
  const [caScore, setCaScore] = useState("")
  const [examScore, setExamScore] = useState("")

  const filteredResults = results.filter((result) => {
    const matchesSearch = 
      `${result.student?.first_name} ${result.student?.last_name} ${result.subject?.name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    const matchesClass = filterClass === "all" || result.class_id === filterClass
    const matchesTerm = filterTerm === "all" || result.term === filterTerm
    return matchesSearch && matchesClass && matchesTerm
  })

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

  const resetForm = () => {
    setSelectedStudent("")
    setSelectedSubject("")
    setSelectedClass("")
    setTerm("First Term")
    setSession("2024/2025")
    setCaScore("")
    setExamScore("")
  }

  const handleSubmit = async () => {
    if (!selectedStudent || !selectedSubject || !selectedClass) return
    setIsLoading(true)

    const ca = parseFloat(caScore) || 0
    const exam = parseFloat(examScore) || 0
    const total = ca + exam
    const grade = calculateGrade(total)

    const supabase = createClient()
    const { data, error } = await supabase
      .from("results")
      .insert({
        student_id: selectedStudent,
        subject_id: selectedSubject,
        class_id: selectedClass,
        term,
        session,
        ca_score: ca,
        exam_score: exam,
        total: total,
        grade,
      })
      .select(`
        *,
        student:student_id (id, first_name, last_name),
        subject:subject_id (id, name),
        class:class_id (id, name)
      `)
      .single()

    if (!error && data) {
      setResults([data, ...results])
    }

    setIsLoading(false)
    setIsAddOpen(false)
    resetForm()
    router.refresh()
  }

  const handleDelete = async (resultId: string) => {
    if (!confirm("Are you sure you want to delete this result?")) return
    
    const supabase = createClient()
    await supabase.from("results").delete().eq("id", resultId)
    setResults(results.filter((r) => r.id !== resultId))
    router.refresh()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterTerm} onValueChange={setFilterTerm}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Terms</SelectItem>
              <SelectItem value="First Term">First Term</SelectItem>
              <SelectItem value="Second Term">Second Term</SelectItem>
              <SelectItem value="Third Term">Third Term</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Result
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Result</DialogTitle>
                <DialogDescription>
                  Enter the student examination result
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <FieldLabel>Student</FieldLabel>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.first_name} {student.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Class</FieldLabel>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Subject</FieldLabel>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <div className="grid grid-cols-2 gap-4">
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
                    <Input
                      value={session}
                      onChange={(e) => setSession(e.target.value)}
                      placeholder="2024/2025"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>CA Score (40)</FieldLabel>
                    <Input
                      type="number"
                      min="0"
                      max="40"
                      value={caScore}
                      onChange={(e) => setCaScore(e.target.value)}
                      placeholder="0-40"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Exam Score (60)</FieldLabel>
                    <Input
                      type="number"
                      min="0"
                      max="60"
                      value={examScore}
                      onChange={(e) => setExamScore(e.target.value)}
                      placeholder="0-60"
                    />
                  </Field>
                </div>
              </FieldGroup>
              <DialogFooter>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !selectedStudent || !selectedSubject || !selectedClass}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Result
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {filteredResults.length === 0 ? (
          <Empty
            icon={ClipboardList}
            title="No results found"
            description={search || filterClass !== "all" || filterTerm !== "all" 
              ? "Try adjusting your filters" 
              : "Add student results to see them here"}
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
                {filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">
                      {result.student?.first_name} {result.student?.last_name}
                    </TableCell>
                    <TableCell>{result.class?.name}</TableCell>
                    <TableCell>{result.subject?.name}</TableCell>
                    <TableCell>{result.term}</TableCell>
                    <TableCell className="text-center">{result.ca_score}</TableCell>
                    <TableCell className="text-center">{result.exam_score}</TableCell>
                    <TableCell className="text-center font-semibold">{result.total}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={getGradeColor(result.grade)}>{result.grade}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(result.id)}
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
  )
}
