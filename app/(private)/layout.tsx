import type React from "react"
import type { Metadata } from "next"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Prospect App",
  description: "Generate and manage prospects",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const user = data.user
  if(!user){
    redirect('/login')
  }
  return (
    <main>{children}</main>
  )
}

