import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

export function EventRegistrationStats({ event }) {
  // Sample data - in a real app, this would come from the backend
  const registeredCount = event.registeredCount || 450
  const capacity = event.capacity || 1000
  const percentageFilled = Math.round((registeredCount / capacity) * 100)

  // Calculate color based on percentage
  let progressColor = "bg-green-500"
  if (percentageFilled > 80) {
    progressColor = "bg-[#CB202D]"
  } else if (percentageFilled > 50) {
    progressColor = "bg-orange-500"
  }

  // Registration rate data
  const dailyRegistrations = [12, 18, 25, 30, 22, 15, 28]
  const weeklyTotal = dailyRegistrations.reduce((sum, current) => sum + current, 0)
  const dailyAverage = Math.round(weeklyTotal / 7)

  // Chart data
  const registrationData = {
    labels: ["Registered", "Available"],
    datasets: [
      {
        data: [registeredCount, capacity - registeredCount],
        backgroundColor: [percentageFilled > 80 ? "#CB202D" : percentageFilled > 50 ? "#FF8042" : "#8A4FFF", "#2D1B48"],
        borderColor: [percentageFilled > 80 ? "#CB202D" : percentageFilled > 50 ? "#FF8042" : "#8A4FFF", "#2D1B48"],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#2D1B48",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "#6B3CC9",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
      },
    },
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-[#1A0B2E] border border-purple-900/50 hover:border-purple-500/30 transition-all">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span>Registration Status</span>
            <span className="ml-auto text-2xl font-bold text-[#8A4FFF]">{registeredCount}</span>
          </CardTitle>
          <CardDescription className="text-purple-300">{percentageFilled}% of capacity filled</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] flex items-center justify-center">
            <div className="w-[220px] h-[220px] relative">
              <Doughnut data={registrationData} options={chartOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{percentageFilled}%</span>
                <span className="text-sm text-purple-300">Filled</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-300">Capacity</span>
              <span className="font-medium">{capacity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-purple-300">Available</span>
              <span className="font-medium">{capacity - registeredCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A0B2E] border border-purple-900/50 hover:border-purple-500/30 transition-all">
        <CardHeader>
          <CardTitle>Registration Rate</CardTitle>
          <CardDescription className="text-purple-300">Recent registration activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#2D1B48] p-4 rounded-lg">
                <div className="text-purple-300 text-sm">Last 7 days</div>
                <div className="text-2xl font-bold mt-1">{weeklyTotal}</div>
                <div className="text-green-500 text-sm mt-1">+{Math.round(weeklyTotal * 0.15)} from previous</div>
              </div>
              <div className="bg-[#2D1B48] p-4 rounded-lg">
                <div className="text-purple-300 text-sm">Daily average</div>
                <div className="text-2xl font-bold mt-1">{dailyAverage}</div>
                <div className="text-green-500 text-sm mt-1">+{Math.round(dailyAverage * 0.08)} from previous</div>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-sm font-medium mb-3">Daily registrations (last 7 days)</div>
              <div className="flex items-end h-20 gap-1">
                {dailyRegistrations.map((count, index) => {
                  const height = (count / Math.max(...dailyRegistrations)) * 100
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-[#8A4FFF] rounded-t-sm relative group" style={{ height: `${height}%` }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2D1B48] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {count}
                        </div>
                      </div>
                      <div className="text-xs text-purple-300 mt-1">{index + 1}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
