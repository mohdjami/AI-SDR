"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, RefreshCw, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export type EmailAnalysis = {
  email: {
    from: string
    subject: string
    body: string
  }
  analysis: {
    sentiment: string
    intent: string
  }
  suggested_followup?: {
    recipient: string
    subject: string
    body: string
    status: string
  }
}

type FollowUpsProps = {
  initialEmails: EmailAnalysis[]
}

export function FollowUps({ initialEmails }: FollowUpsProps) {
  console.log(initialEmails)
  const [loading, setLoading] = useState(false)
  const [analyzedEmails, setAnalyzedEmails] = useState<EmailAnalysis[]>(initialEmails)
  const [selectedEmail, setSelectedEmail] = useState<EmailAnalysis | null>(null)
  const [editedFollowup, setEditedFollowup] = useState("")

  const fetchReplies = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://ai-sdr-production.up.railway.app/track-replies")
      const data = await response.json()
      setAnalyzedEmails(data.analyzed_emails)
      toast.success(data.message)
    } catch (error) {
      toast.error("Failed to fetch replies")
    } finally {
      setLoading(false)
    }
  }

  const handleSendFollowup = async () => {
    if (!selectedEmail?.suggested_followup) return

    try {
      // Simulate sending email
      toast.success("Follow-up email sent successfully!")
      setSelectedEmail(null)
    } catch (error) {
      toast.error("Failed to send follow-up email")
    }
  }

  const getSentimentColor = (sentiment: string) => {
    if (sentiment.includes("Positive")) return "bg-green-500"
    if (sentiment.includes("Negative")) return "bg-red-500"
    return "bg-yellow-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Email Replies</h2>
        <Button onClick={fetchReplies} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Analyze Replies
        </Button>
      </div>

      <div className="grid gap-4">
        {analyzedEmails.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.email.from}</span>
                    <Badge variant="outline">{item.analysis.intent}</Badge>
                    <div className={`h-2 w-2 rounded-full ${getSentimentColor(item.analysis.sentiment)}`} />
                  </div>
                  <p className="text-sm font-medium">{item.email.subject}</p>
                  <p className="text-sm text-muted-foreground">{item.email.body}</p>
                </div>
                {item.suggested_followup && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedEmail(item)
                      setEditedFollowup(item.suggested_followup?.body || "")
                    }}
                  >
                    View Follow-up
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {analyzedEmails.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No replies analyzed yet. Click &quot;Analyze Replies&quot; to get started.</p>
          </div>
        )}
      </div>

      {selectedEmail && (
        <Dialog open={true} onOpenChange={() => setSelectedEmail(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Follow-up Email</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">To</h3>
                <p className="text-sm">{selectedEmail.suggested_followup?.recipient}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Subject</h3>
                <p className="text-sm">{selectedEmail.suggested_followup?.subject}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Message</h3>
                <Textarea
                  value={editedFollowup}
                  onChange={(e) => setEditedFollowup(e.target.value)}
                  rows={10}
                  className="resize-none"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSendFollowup}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Follow-up
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

