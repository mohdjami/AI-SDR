import { DashboardTabs } from "@/components/dashboard/DashboardTabs"
import redis from "@/utils/redis"
import { createClient } from "@/utils/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const cachedEmails = await redis.get("analyzed_emails")
  const { data: meetings } = await supabase.from("meetings").select("*")
  const { data: emailSent } = await supabase.from("emails").select("*")
  const { data: prospects } = await supabase.from("meetings").select("*")
  const dashboardData = {
    cachedEmails: JSON.parse(cachedEmails || '[]'),
    emailSent: emailSent || [],
    meetings: meetings || [],
    prospects: prospects || []
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your prospecting activities and follow-ups</p>
        </div>
        <DashboardTabs dashboardData={dashboardData} />
      </div>
    </div>
  )
}

