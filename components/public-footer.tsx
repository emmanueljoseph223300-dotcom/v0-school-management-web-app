import Link from "next/link"
import { GraduationCap } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8" />
              <span className="font-bold text-xl">Beatitude Model School</span>
            </Link>
            <p className="text-sidebar-foreground/80 max-w-md">
              Nurturing young minds through quality education, character development, and academic excellence since 1995.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sidebar-foreground/80">
              <li>
                <Link href="/" className="hover:text-sidebar-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sidebar-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sidebar-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-sidebar-foreground transition-colors">
                  Portal Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sidebar-foreground/80">
              <li>123 Education Lane</li>
              <li>Lagos, Nigeria</li>
              <li>Phone: +234 800 123 4567</li>
              <li>Email: info@beatitudemodel.edu</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sidebar-border mt-8 pt-8 text-center text-sidebar-foreground/60">
          <p>&copy; {new Date().getFullYear()} Beatitude Model School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
