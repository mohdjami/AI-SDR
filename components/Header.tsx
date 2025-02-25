"use client"

import { User } from "@supabase/supabase-js"
import Link from "next/link"
import { Building2, Menu, X } from 'lucide-react'
import UserAccountNav from "./user-account-nav"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

export default function Header({ user }: { user: User | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <Link href="/" className="text-xl font-bold">
              AI Atlan SDR
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {user ? (
              <>
                <Link
                  href="/prospects"
                  className="text-foreground/60 transition-colors hover:text-foreground"
                >
                  Prospects
                </Link>
                <Link
                  href="/dashboard"
                  className="text-foreground/60 transition-colors hover:text-foreground"
                >
                  Dashboard
                </Link>
                <UserAccountNav user={user} />
              </>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden",
            isMenuOpen ? "block" : "hidden"
          )}
        >
          <div className="space-y-4 px-2 pb-3 pt-2">
            {user ? (
              <>
                <Link
                  href="/prospects"
                  className="block py-2 text-foreground/60 transition-colors hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Prospects
                </Link>
                <Link
                  href="/dashboard"
                  className="block py-2 text-foreground/60 transition-colors hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <Button asChild className="w-full">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
