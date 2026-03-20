import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { GraduationCap, BookOpen, Users, Award, ChevronRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <GraduationCap className="h-4 w-4" />
                Excellence in Education Since 1995
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
                Welcome to Beatitude Model School
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty mb-8">
                Nurturing young minds through quality education, character development, and academic excellence. Join us in shaping the leaders of tomorrow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/auth/sign-up">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Beatitude?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We provide a comprehensive educational experience that prepares students for success in all areas of life.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Quality Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Comprehensive curriculum designed to meet national and international standards.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Expert Teachers</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Dedicated and qualified educators committed to student success.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Academic Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Consistent track record of outstanding performance in examinations.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Character Building</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Holistic development focusing on moral values and leadership skills.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Portal Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Modern School Portal for Everyone
                </h2>
                <p className="text-muted-foreground mb-8">
                  Our comprehensive school management system provides dedicated dashboards for students, teachers, and administrators.
                </p>

                <ul className="space-y-4">
                  {[
                    "Students can view results and download report cards",
                    "Teachers can manage classes and upload student results",
                    "Administrators have full control over school operations",
                    "Real-time announcements and notifications",
                    "Secure and easy-to-use interface",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button asChild>
                    <Link href="/auth/login">Access Portal</Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 bg-primary text-primary-foreground">
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-primary-foreground/80">Students Enrolled</div>
                </Card>
                <Card className="p-6">
                  <div className="text-4xl font-bold mb-2 text-primary">50+</div>
                  <div className="text-muted-foreground">Expert Teachers</div>
                </Card>
                <Card className="p-6">
                  <div className="text-4xl font-bold mb-2 text-primary">6+</div>
                  <div className="text-muted-foreground">Years of Excellence</div>
                </Card>
                <Card className="p-6 bg-secondary">
                  <div className="text-4xl font-bold mb-2">98%</div>
                  <div className="text-muted-foreground">Pass Rate</div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Take the first step towards academic excellence. Register today and become part of the Beatitude family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/sign-up">Register Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
