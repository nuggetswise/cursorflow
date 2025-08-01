import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType: "increase" | "decrease"
}

export function MetricCard({ title, value, change, changeType }: MetricCardProps) {
  const ChangeIcon = changeType === "increase" ? ArrowUpRight : ArrowDownRight
  const changeColorClass = changeType === "increase" ? "text-green-500" : "text-red-500"

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <ChangeIcon className={cn("h-4 w-4", changeColorClass)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn("text-xs text-muted-foreground", changeColorClass)}>{change} from last month</p>
      </CardContent>
    </Card>
  )
}
