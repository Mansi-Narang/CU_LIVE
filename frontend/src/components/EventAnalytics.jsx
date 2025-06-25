import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Pie, Bar } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function EventAnalytics({ event }) {
  // Sample data - in a real app, this would come from the backend
  const attendanceData = {
    labels: ["Attended", "No-show"],
    datasets: [
      {
        data: [event.attendedCount || 720, (event.registeredCount || 850) - (event.attendedCount || 720)],
        backgroundColor: ["#8A4FFF", "#CB202D"],
        borderColor: ["#8A4FFF", "#CB202D"],
        borderWidth: 1,
      },
    ],
  }

  const timelineData = {
    labels: ["1 Month Before", "3 Weeks Before", "2 Weeks Before", "1 Week Before", "Day Before", "Event Day"],
    datasets: [
      {
        label: "Registrations",
        data: [150, 280, 450, 650, 780, 850],
        backgroundColor: "#8A4FFF",
        borderRadius: 4,
      },
    ],
  }

  const demographicData = {
    labels: ["18-24", "25-34", "35-44", "45+"],
    datasets: [
      {
        data: [250, 300, 200, 100],
        backgroundColor: ["#8A4FFF", "#CB202D", "#FF8042", "#00C49F"],
        borderColor: ["#8A4FFF", "#CB202D", "#FF8042", "#00C49F"],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#B49FC5",
          font: {
            size: 12,
          },
        },
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
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed !== undefined) {
              label += context.parsed
            }
            return label
          },
        },
      },
    },
  }

  const barChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: {
          color: "#2D1B48",
        },
        ticks: {
          color: "#B49FC5",
        },
      },
      y: {
        grid: {
          color: "#2D1B48",
        },
        ticks: {
          color: "#B49FC5",
        },
      },
    },
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-[#1A0B2E] border border-purple-900/50 hover:border-purple-500/30 transition-all">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="text-lg">Attendance Overview</span>
            <span className="ml-auto text-2xl font-bold text-[#8A4FFF]">{event.attendedCount || 720}</span>
          </CardTitle>
          <CardDescription className="text-purple-300">
            {Math.round(((event.attendedCount || 720) / (event.registeredCount || 850)) * 100)}% attendance rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-[250px] h-[250px]">
              <Pie data={attendanceData} options={chartOptions} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-[#2D1B48] p-3 rounded-lg text-center">
              <div className="text-purple-300 text-sm">Registered</div>
              <div className="text-xl font-bold">{event.registeredCount || 850}</div>
            </div>
            <div className="bg-[#2D1B48] p-3 rounded-lg text-center">
              <div className="text-purple-300 text-sm">No-shows</div>
              <div className="text-xl font-bold">{(event.registeredCount || 850) - (event.attendedCount || 720)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A0B2E] border border-purple-900/50 hover:border-purple-500/30 transition-all">
        <CardHeader>
          <CardTitle>Registration Timeline</CardTitle>
          <CardDescription className="text-purple-300">How registrations progressed over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Bar data={timelineData} options={barChartOptions} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A0B2E] border border-purple-900/50 hover:border-purple-500/30 transition-all md:col-span-2">
        <CardHeader>
          <CardTitle>Attendee Demographics</CardTitle>
          <CardDescription className="text-purple-300">Age distribution of attendees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-[300px] h-[300px]">
              <Pie data={demographicData} options={chartOptions} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
