"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Mail } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import EmailDraftModal from "./EmailDrafts"

export type Prospect = {
  author: string
  role: string
  company: string
  isProspect: boolean
  alignment_score: number
  industry: string
  pain_points: string[]
  solution_fit: string
  insights: string
}

type ProspectModalProps = { 
  prospect: Prospect
  onClose: () => void
}

export default function ProspectModal({ prospect, onClose }: ProspectModalProps) {
  const [showEmailDraft, setShowEmailDraft] = useState(false)
  const [emailDraft, setEmailDraft] = useState<{ subject: string; content: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerateEmailDraft = async () => {
    setLoading(true)
    try {
      const response = await axios.post("https://ai-sdr-production.up.railway.app/draft-emails", prospect)
      setEmailDraft(response.data.email)
      setShowEmailDraft(true)
    } catch (error) {
      console.error("Error generating email draft:", error)
    } finally {
      setLoading(false)
    }
  }

  const alignmentScore = prospect.alignment_score * 100

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{prospect.author}</span>
              <Badge variant={prospect.isProspect ? "default" : "secondary"}>
                {prospect.isProspect ? "Prospect" : "Lead"}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Role & Company</h4>
                <p className="text-sm">
                  {prospect.role} at {prospect.company}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Industry</h4>
                <p className="text-sm">{prospect.industry}</p>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-muted-foreground">Alignment Score</span>
                  <span className="font-medium">{alignmentScore.toFixed(0)}%</span>
                </div>
                <Progress value={alignmentScore} />
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Pain Points</h4>
                <div className="flex flex-wrap gap-2">
                  {prospect.pain_points.map((point, index) => (
                    <Badge key={index} variant="outline">
                      {point}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Solution Fit</h4>
                <p className="text-sm">{prospect.solution_fit}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Insights</h4>
                <p className="text-sm">{prospect.insights}</p>
              </div>
            </div>

            <Button onClick={handleGenerateEmailDraft} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Generate Email Draft
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showEmailDraft && (
        <EmailDraftModal prospect={prospect} emailDraft={emailDraft} onClose={() => setShowEmailDraft(false)} />
      )}
    </>
  )
}

