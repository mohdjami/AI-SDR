import ProspectList from "@/components/ProspectList"
import redis from "@/utils/redis"

export default async function Home() {
  const cachedProspects = await redis.get("atlan_prospects")
  
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
        </div>
        <ProspectList initialProspects={JSON.parse(cachedProspects || '[]')} />
      </div>
    </main>
  )
}

