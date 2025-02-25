"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Bot, X, FileText, BrainCircuit } from "lucide-react"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export type Meeting = {
  id: string
  bot_id: string
  meeting_url: string
  status?: "active" | "completed" 
  date?: string 
  title?: string 
  duration?: string 
  description?: string 
  participants?: string[] 
  transcript? : string
  ai_summary?: string
}

type MeetingData = {
  transcript: string
  summary: string
  actionItems: string[]
  keyInsights: string[]
  sentiment: string
}

export function MeetingNotes({initialMeetings}: { initialMeetings: Meeting[]}) {
  const [meetings, setMeetings] = useState<Meeting[]>([
    ...initialMeetings,
    {
      id: "m1",
      bot_id: "bot_active1",
      title: "Weekly Team Sync",
      meeting_url: "https://meet.google.com/abc-123",
      status: "active",
    },
    {
      id: "m2",
      bot_id: "bot_completed1",
      title: "Client Project Kickoff",
      meeting_url: "https://meet.google.com/xyz-789",
      status: "completed",
    },
    {
      id: "m3",
      bot_id: "bot_completed2",
      title: "Design Review",
      meeting_url: "https://meet.google.com/def-456",
      status: "completed",
    }
  ])
  const [loading, setLoading] = useState(false)
  const [meetingUrl, setMeetingUrl] = useState("")
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [meetingTitle, setMeetingTitle] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const addBot = async () => {
    setLoading(true)
    try {
      const meetingData = {
        meeting_url: meetingUrl,
        title: meetingTitle,
      }
      const response = await fetch('https://ai-sdr-production.up.railway.app/add-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: meetingData.title,
            meeting_url: meetingData.meeting_url
        })
      })
      const data = await response.json()
      console.log(data.meeting.botId)
      const newMeeting: Meeting = {
        id: data.meeting.id,
        bot_id: data.meeting.botId,
        ...meetingData,
        status: "active",
      }
      setMeetings([newMeeting, ...meetings])
      setShowAddDialog(false)
      resetForm()
      toast.success("Bot added successfully!")
      
    } catch (error) {
      console.log(error)
      toast.error("Failed to add bot")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setMeetingUrl("")
    setMeetingTitle("")
  }

  const removeBot = async (meeting: Meeting) => {
    try {
      // Make the API call to delete the bot
      const response = await fetch(`https://ai-sdr-production.up.railway.app/remove-bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-meeting-baas-api-key': process.env.MEETING_BASS_API!,
        },
        body: JSON.stringify(meeting)
      }); 
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to delete bot');
      }

      // Update the state to remove the meeting from the list
      setMeetings(meetings.filter((m) => m.id !== meeting.id));
      toast.success("Bot removed successfully!");
    } catch (error) {
      toast.error("Failed to remove bot");
    }
  }

  const getMeetingData = async (meeting: Meeting) => {
    console.log(meeting)
    setLoading(true)
    try {
      setMeetingData({
        transcript: meeting?.transcript || "Meeting transcript goes here...",
        summary: meeting?.ai_summary || "This meeting covered key aspects of the sales strategy...",
        actionItems: ["Schedule follow-up meeting", "Send proposal by Friday", "Review technical requirements"],
        keyInsights: [
          "Client is interested in AI integration",
          "Budget constraints need consideration",
          "Timeline is flexible",
        ],
        sentiment: "Positive",
      })
      setSelectedMeeting(meeting)
    } catch (error) {
      toast.error("Failed to fetch meeting data")
    } finally {
      setLoading(false)
    }
  }

  const refreshCompletedMeetings = async () => {
    setRefreshing(true)
    try {
      
      // Dummy completed meetings data
      const completedMeetings: Meeting[] = [
        {
          id: "cm1",
          bot_id: "bot_completed1",
          title: "Q1 Planning Meeting",
          meeting_url: "https://meet.google.com/abc",
          status: "completed",
        },
        {
          id: "cm2",
          bot_id: "bot_completed2",
          title: "Product Review",
          meeting_url: "https://meet.google.com/xyz",
          status: "completed",
        }
      ]

      // Update meetings list with new completed meetings
      setMeetings(prevMeetings => {
        const activeMeetings = prevMeetings.filter(m => m.status === "active")
        return [...initialMeetings, ...activeMeetings, ...completedMeetings]
      })
      
      toast.success("Completed meetings refreshed!")
    } catch (error) {
      toast.error("Failed to refresh completed meetings")
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Meeting Notes</h2>
          <p className="text-muted-foreground">Manage your meeting bots and view insights</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Meeting Bot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add Meeting Bot</DialogTitle>
            </DialogHeader>.
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Meeting Title</label>
                <Input
                  placeholder="Enter meeting title"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Meeting URL</label>
                <Input
                  placeholder="Enter meeting URL"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                />
              </div>
            
              <Button 
                onClick={addBot} 
                disabled={loading || !meetingUrl}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                Add Bot
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Meetings</CardTitle>
            <CardDescription>Currently monitored meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {meetings
                .filter((m) => m.status === "active")
                .map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-4 border-b last:border-0">
                    <div className="grid gap-1">
                      <div className="font-medium">{meeting.title}</div>
                      <div className="text-sm text-muted-foreground">Bot ID: {meeting.bot_id}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeBot(meeting)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Completed Meetings</CardTitle>
                <CardDescription>Past meetings with analysis</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshCompletedMeetings}
                disabled={refreshing}
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
                <span className="ml-2">Refresh</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {meetings
                .filter((m) => m.status === "completed")
                .map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-4 border-b last:border-0">
                    <div className="grid gap-1">
                      <div className="font-medium">{meeting.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(meeting.date || "").toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {meeting.participants?.length} participants
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => getMeetingData(meeting)}>
                      View Details
                    </Button>
                  </div>
                ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {selectedMeeting && meetingData && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedMeeting.title}</CardTitle>
                <CardDescription>{new Date(selectedMeeting.date || "").toLocaleDateString()}</CardDescription>
              </div>
              <Badge>{meetingData.sentiment}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="transcript">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Transcript
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">{meetingData.transcript}</ScrollArea>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="summary">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4" />
                    AI Summary
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-sm text-muted-foreground">{meetingData.summary}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Key Insights</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {meetingData.keyInsights.map((insight, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Action Items</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {meetingData.actionItems.map((item, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

