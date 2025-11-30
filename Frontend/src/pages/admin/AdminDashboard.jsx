import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Droplet, Users, CheckCircle, Activity, TrendingUp } from 'lucide-react'
import BloodGroupCard from '@/components/BloodGroupCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

const AdminDashboard = () => {
  const inventory = useSelector((state) => state.inventory)

  const bloodGroupData = Object.entries(inventory.bloodGroups).map(([group, units]) => ({
    bloodGroup: group,
    units,
  }))

  const stats = [
    {
      icon: Users,
      title: 'Total Donors',
      value: inventory.totalDonors,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      change: '',
    },
    {
      icon: Droplet,
      title: 'Total Requests',
      value: inventory.totalRequests,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      change: '',
    },
    {
      icon: CheckCircle,
      title: 'Approved Requests',
      value: inventory.approvedRequests,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      change: '',
    },
    {
      icon: Activity,
      title: 'Total Blood Units (in ml)',
      value: inventory.totalBloodUnits,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      change: '',
    },
  ]

  // Calculate pie chart data
  const totalUnits = Object.values(inventory.bloodGroups).reduce((sum, units) => sum + units, 0)
  const pieChartData = bloodGroupData.map((item, index) => {
    const percentage = totalUnits > 0 ? ((item.units / totalUnits) * 100).toFixed(1) : 0
    const colors = [
      { bg: '#EF4444', light: '#FEE2E2' }, // Red
      { bg: '#F59E0B', light: '#FEF3C7' }, // Amber
      { bg: '#10B981', light: '#D1FAE5' }, // Green
      { bg: '#3B82F6', light: '#DBEAFE' }, // Blue
      { bg: '#8B5CF6', light: '#EDE9FE' }, // Purple
      { bg: '#EC4899', light: '#FCE7F3' }, // Pink
      { bg: '#06B6D4', light: '#CFFAFE' }, // Cyan
      { bg: '#F97316', light: '#FFEDD5' }, // Orange
    ]
    return {
      ...item,
      percentage,
      color: colors[index % colors.length],
    }
  })

  return (
    <div className="space-y-6">
      {/* Enhanced Stat Cards */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16`}></div>
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between h-full">
                      <div className="flex-1 flex flex-col justify-between h-full">
                        <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
                        <div>
                          <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value.toLocaleString()}</p>
                          <div className="flex items-center gap-1">
                            <TrendingUp size={14} className="text-green-500" />
                            <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
                            <span className="text-gray-400 text-xs">vs last month</span>
                          </div>
                        </div>
                      </div>
                      <div className={`${stat.bgColor} p-4 rounded-xl flex-shrink-0`}>
                        <Icon className={stat.iconColor} size={28} strokeWidth={2.5} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* Horizontal Pie Chart */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-lg">Blood Group Distribution</CardTitle>
            <CardDescription>Blood group percentages</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Horizontal Pie Chart Layout */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Pie Chart SVG */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <svg viewBox="0 0 200 200">
                  {pieChartData.map((item, index) => {
                    let cumulativePercentage = 0
                    for (let i = 0; i < index; i++) {
                      cumulativePercentage += parseFloat(pieChartData[i].percentage)
                    }
                    const startAngle = (cumulativePercentage / 100) * 360
                    const endAngle = ((cumulativePercentage + parseFloat(item.percentage)) / 100) * 360
                    const largeArcFlag = item.percentage > 50 ? 1 : 0
                    
                    const startX = 100 + 90 * Math.cos((Math.PI * (startAngle - 90)) / 180)
                    const startY = 100 + 90 * Math.sin((Math.PI * (startAngle - 90)) / 180)
                    const endX = 100 + 90 * Math.cos((Math.PI * (endAngle - 90)) / 180)
                    const endY = 100 + 90 * Math.sin((Math.PI * (endAngle - 90)) / 180)

                    return (
                      <motion.path
                        key={item.bloodGroup}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        d={`M 100 100 L ${startX} ${startY} A 90 90 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                        fill={item.color.bg}
                        stroke="white"
                        strokeWidth="2"
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    )
                  })}
                  <circle cx="100" cy="100" r="60" fill="white" />
                  <text x="100" y="95" textAnchor="middle" className="text-2xl font-bold fill-gray-800">
                    {totalUnits}
                  </text>
                  <text x="100" y="110" textAnchor="middle" className="text-xs fill-gray-500">
                    Total Units
                  </text>
                </svg>
              </div>

              {/* Legend */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                {pieChartData.map((item, index) => (
                  <motion.div
                    key={item.bloodGroup}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="flex items-center justify-between text-sm p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color.bg }}
                      ></div>
                      <span className="font-semibold text-gray-700">{item.bloodGroup}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">{item.units} units</span>
                      <span className="text-gray-500 font-medium">{item.percentage}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  )
}

export default AdminDashboard
