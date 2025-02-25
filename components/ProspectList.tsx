"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search, SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProspectCard from "./ProspectCard"
import ProspectModal, { Prospect } from "./ProspectModal"

type ProspectListProps = {
  initialProspects: Prospect[]
}

export default function ProspectList({ initialProspects }: ProspectListProps) {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects)
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("alignment")
  const [minScore, setMinScore] = useState("0.5")

  const handleGenerateNewProspects = async () => {
    setLoading(true)
    try {
      const response = await fetch(`https://ai-sdr-production.up.railway.app/prospects?min_alignment_score=${minScore}`);
      const data = await response.json()
      setProspects(data.prospects)
    } catch (error) {
      console.error('Error generating prospects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProspects = prospects
    .filter((prospect) => {
      const query = searchQuery.toLowerCase()
      return (
        prospect.author.toLowerCase().includes(query) ||
        prospect.role.toLowerCase().includes(query) ||
        prospect.company.toLowerCase().includes(query) ||
        prospect.industry.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
      if (sortBy === "alignment") {
        return b.alignment_score - a.alignment_score
      }
      return 0
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search prospects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alignment">Alignment Score</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Min Score (0-1)"
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
            className="w-32"
            min="0"
            max="1"
            step="0.1"
          />
          <Button 
            onClick={handleGenerateNewProspects} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate New Prospects"
            )}
          </Button>
        </div>
      </div>

      {filteredProspects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No prospects found</h3>
          <p className="text-muted-foreground">
            {prospects.length === 0 ? "Generate prospects to get started" : "Try adjusting your search"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProspects.map((prospect, index) => (
            <ProspectCard key={index} prospect={prospect} onClick={() => setSelectedProspect(prospect)} />
          ))}
        </div>
      )}

      {selectedProspect && <ProspectModal prospect={selectedProspect} onClose={() => setSelectedProspect(null)} />}
    </div>
  )
}





  // const fetchProspects = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`https://ai-sdr-production.up.railway.app/prospects?min_alignment_score=${minAlignmentScore}`);
  //     const data = await response.json();
  //     console.log(data)
  //     setProspects(data.prospects || []);
  //   } catch (error) {
  //     console.error("Error fetching prospects:", error);
  //     // TODO: Add error handling UI
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchProspects = async () => {
  //   setLoading(true);
  //   try {
  //     // Dummy data matching the expected response structure
  //     const dummyData = {
  //       prospects: [
  //         {
  //           author: "Mahek Ashok",
  //           role: "Senior Manager Talent Acquisition",
  //           company: "Tiger Analytics",
  //           alignment_score: 0.8,
  //           industry: "Analytics",
  //           isProspect: false,
  //           pain_points: [
  //             "Scaling talent acquisition",
  //             "Improving candidate experience",
  //             "Reducing time-to-hire"
  //           ],
  //           solution_fit: "Recruitment optimization solutions",
  //           insights: "Looking for efficient ways to manage large-scale hiring processes."
  //         },
  //         {
  //           author: "Arijit Chatterjee",
  //           role: "MDM and DG CoE",
  //           company: "AI for Data",
  //           alignment_score: 0.75,
  //           industry: "Data Management",
  //           isProspect: false,
  //           pain_points: [
  //             "Master data management challenges",
  //             "Data governance implementation",
  //             "Ensuring data quality"
  //           ],
  //           solution_fit: "Comprehensive data management platforms",
  //           insights: "Seeking solutions to streamline data governance and quality assurance."
  //         },
  //         {
  //           author: "Apoorvo C.",
  //           role: "Founder",
  //           company: "TheBlueOwls",
  //           alignment_score: 0.7,
  //           industry: "Data and AI Solutions",
  //           isProspect: false,
  //           pain_points: [
  //             "Client acquisition in competitive markets",
  //             "Delivering customized AI solutions",
  //             "Maintaining innovation pace"
  //           ],
  //           solution_fit: "Market expansion strategies and AI development tools",
  //           insights: "Aims to enhance market presence and solution offerings."
  //         },
  //         {
  //           author: "Deevya Naresh Kumar",
  //           role: "Data Governance Manager",
  //           company: "Jetstar Airways",
  //           alignment_score: 0.65,
  //           industry: "Aviation",
  //           isProspect: false,
  //           pain_points: [
  //             "Regulatory compliance",
  //             "Data governance in cloud environments",
  //             "Data privacy concerns"
  //           ],
  //           solution_fit: "Cloud-native data governance frameworks",
  //           insights: "Needs robust solutions for managing data governance in cloud settings."
  //         },
  //         {
  //           author: "Girish Rameshbabu",
  //           role: "Data Security Professional",
  //           company: "Various Sectors",
  //           alignment_score: 0.6,
  //           industry: "Data Security",
  //           isProspect: false,
  //           pain_points: [
  //             "Data discovery and classification",
  //             "Vulnerability management",
  //             "Protecting data across on-prem and cloud"
  //           ],
  //           solution_fit: "Advanced data security and compliance tools",
  //           insights: "Focused on enhancing data protection measures in diverse environments."
  //         }
  //       ]
  //     };
  
  //     // Simulate an API call with the dummy data
  //     setTimeout(() => {
  //       setProspects(dummyData.prospects);
  //       setLoading(false);
  //     }, 1000); // Simulate a 1-second delay for the API call
  //   } 
