import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Prospect } from "./ProspectModal"

type ProspectCardProps = {
  prospect: Prospect
  onClick: () => void
}

export default function ProspectCard({ prospect, onClick }: ProspectCardProps) {
  const alignmentScore = prospect.alignment_score * 100

  return (
    <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold leading-none tracking-tight">{prospect.author}</h3>
            <p className="text-sm text-muted-foreground">{prospect.role}</p>
          </div>
          <Badge variant={prospect.isProspect ? "default" : "secondary"}>
            {prospect.isProspect ? "Prospect" : "Lead"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Company</p>
            <p className="text-sm">{prospect.company}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Industry</p>
            <p className="text-sm">{prospect.industry}</p>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-muted-foreground">Alignment Score</span>
              <span className="font-medium">{alignmentScore.toFixed(0)}%</span>
            </div>
            <Progress value={alignmentScore} className="mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

