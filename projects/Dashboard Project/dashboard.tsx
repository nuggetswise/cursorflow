import { MetricCard } from "./components/metric-card"
import { SalesChart } from "./components/sales-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "./components/theme-toggle"

export function Dashboard() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <ThemeToggle />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Revenue" value="$45,231.89" change="+20.1%" changeType="increase" />
        <MetricCard title="Subscriptions" value="+2,350" change="+180.1%" changeType="increase" />
        <MetricCard title="Sales" value="+12,234" change="+19%" changeType="increase" />
        <MetricCard title="Active Now" value="+573" change="-2.5%" changeType="decrease" />
      </div>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Monthly sales data for desktop and mobile.</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesChart />
        </CardContent>
      </Card>
    </div>
  )
}
