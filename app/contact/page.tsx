"use client"

import { useState } from "react"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { MapPin, Phone, Mail, Clock, Loader2, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Contact Us
              </h1>
              <p className="text-lg text-muted-foreground">
                {"Have questions? We'd love to hear from you. Get in touch with us."}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Whether you have questions about admissions, programs, or anything else, our team is ready to answer all your questions.
                </p>

                <div className="space-y-6">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="flex items-start gap-4 pt-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Address</h3>
                        <p className="text-muted-foreground">
                          123 Education Lane<br />
                          Victoria Island<br />
                          Lagos, Nigeria
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="flex items-start gap-4 pt-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <p className="text-muted-foreground">
                          +234 800 123 4567<br />
                          +234 800 765 4321
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="flex items-start gap-4 pt-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-muted-foreground">
                          info@beatitudemodel.edu<br />
                          admissions@beatitudemodel.edu
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="flex items-start gap-4 pt-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Office Hours</h3>
                        <p className="text-muted-foreground">
                          Monday - Friday: 8:00 AM - 4:00 PM<br />
                          Saturday: 9:00 AM - 1:00 PM
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we will get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground mb-4">
                          Thank you for contacting us. We will get back to you shortly.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)} variant="outline">
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        <FieldGroup>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <Field>
                              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                              <Input
                                id="firstName"
                                placeholder="John"
                                required
                                disabled={isSubmitting}
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                              <Input
                                id="lastName"
                                placeholder="Doe"
                                required
                                disabled={isSubmitting}
                              />
                            </Field>
                          </div>
                          <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              required
                              disabled={isSubmitting}
                            />
                          </Field>
                          <Field>
                            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+234 800 000 0000"
                              disabled={isSubmitting}
                            />
                          </Field>
                          <Field>
                            <FieldLabel htmlFor="subject">Subject</FieldLabel>
                            <Input
                              id="subject"
                              placeholder="How can we help?"
                              required
                              disabled={isSubmitting}
                            />
                          </Field>
                          <Field>
                            <FieldLabel htmlFor="message">Message</FieldLabel>
                            <Textarea
                              id="message"
                              placeholder="Your message..."
                              rows={5}
                              required
                              disabled={isSubmitting}
                            />
                          </Field>
                          <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              "Send Message"
                            )}
                          </Button>
                        </FieldGroup>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
