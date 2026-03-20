import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Target, Eye, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                About Beatitude Model School
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover our story, mission, and commitment to educational excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded in 2023, Beatitude Model School began with a simple yet powerful vision: to provide quality education that nurtures both academic excellence and strong moral character.
                  </p>
                  <p>
                    Over the past 25+ years, we have grown from a small primary school to a comprehensive institution offering education from primary through secondary levels. Our graduates have gone on to excel in various fields, carrying with them the values and knowledge instilled during their time with us.
                  </p>
                  <p>
                    Today, we continue to evolve, embracing modern teaching methods and technology while staying true to our founding principles of excellence, integrity, and holistic development.
                  </p>
                </div>
              </div>
              <div className="bg-primary/5 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary">25+</div>
                    <div className="text-muted-foreground">Years of Excellence</div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  We are proud of our legacy and the thousands of students who have passed through our doors, each one contributing to our rich history of academic achievement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Guiding Principles</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center border-0 shadow-sm">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To provide quality education that develops the intellectual, moral, and social capabilities of every student, preparing them to become responsible citizens and leaders of tomorrow.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-sm">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To be a leading institution recognized for academic excellence, innovative teaching, and the holistic development of students who will positively impact their communities and the world.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-sm">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Our Values</h3>
                  <p className="text-muted-foreground">
                    Integrity, Excellence, Respect, Responsibility, and Compassion guide everything we do. We believe in nurturing not just minds, but hearts and character.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">What We Offer</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              A comprehensive educational experience designed to prepare students for success.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-2 bg-primary rounded-full flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Primary Education</h3>
                    <p className="text-muted-foreground">
                      A strong foundation in literacy, numeracy, and essential life skills for young learners.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 bg-primary rounded-full flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Junior Secondary (JSS 1-3)</h3>
                    <p className="text-muted-foreground">
                      Comprehensive curriculum preparing students for the Basic Education Certificate Examination.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 bg-primary rounded-full flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Senior Secondary (SS 1-3)</h3>
                    <p className="text-muted-foreground">
                      Advanced education with focus on sciences, arts, and commercial subjects for WAEC/NECO success.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-2 bg-primary rounded-full flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Extra-Curricular Activities</h3>
                    <p className="text-muted-foreground">
                      Sports, arts, music, and clubs that develop talents beyond the classroom.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 bg-primary rounded-full flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Modern Facilities</h3>
                    <p className="text-muted-foreground">
                      Well-equipped laboratories, library, computer center, and sports facilities.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 bg-primary rounded-full flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Digital Learning Portal</h3>
                    <p className="text-muted-foreground">
                      Online platform for students, teachers, and parents to track progress and communicate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
