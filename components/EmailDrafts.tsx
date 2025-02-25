"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "sonner"
import { useState } from "react"
import { Prospect } from "./ProspectModal"

type EmailDraft = {
  subject: string
  content: string
}

type EmailDraftModalProps = {
  prospect: Prospect
  emailDraft: EmailDraft | null
  onClose: () => void
}

export default function EmailDraftModal({ prospect, emailDraft, onClose }: EmailDraftModalProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState<EmailDraft | null>(emailDraft)

  const handleSendEmail = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://ai-sdr-production.up.railway.app/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prospect: prospect,
          recipient: prospect.author,
          subject: email?.subject,
          body: email?.content
        })
      })

      if (!response.ok) {
        toast.error('Error sending the mails!')
      }

      toast.success('Email sent successfully!')
      onClose()
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Failed to send email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Email Draft for {prospect.author}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {email ? (
            <>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Subject</h3>
                <p className="text-sm bg-muted p-3 rounded-md">{email.subject}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Content</h3>
                <Textarea
                  value={email.content}
                  onChange={(e) => setEmail({ ...email, content: e.target.value })}
                  rows={10}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button onClick={handleSendEmail} disabled={loading}>
                  {loading ? (
                    <ImSpinner8 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Send Email'
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No email draft available.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

