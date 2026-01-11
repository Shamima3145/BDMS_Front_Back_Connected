import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#dc2626',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    width: '23%',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  statLabel: {
    fontSize: 9,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 3,
  },
  statChange: {
    fontSize: 8,
    color: '#10b981',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#111',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#dc2626',
    color: '#fff',
    padding: 8,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 8,
    minHeight: 30,
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 8,
    minHeight: 30,
  },
  col1: { width: '25%' },
  col2: { width: '15%' },
  col3: { width: '15%' },
  col4: { width: '15%' },
  col5: { width: '15%' },
  col6: { width: '15%' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666',
    fontSize: 9,
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  pageNumber: {
    fontSize: 9,
    color: '#666',
  },
  summaryBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fef2f2',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 9,
    color: '#666',
    marginBottom: 4,
  },
  highlightText: {
    fontWeight: 'bold',
    color: '#111',
  },
})

const ReportsAnalyticsPDF = ({ monthlyStats, bloodGroupDistribution, monthlyTrends, selectedMonth, selectedYear }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const selectedMonthName = months[selectedMonth - 1]
  const totalUnits = bloodGroupDistribution.reduce((sum, item) => sum + parseInt(item.units || 0), 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Reports & Analytics</Text>
          <Text style={styles.subtitle}>Blood Donation Management System</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Report Period:</Text>
            <Text>{selectedMonthName} {selectedYear}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Generated On:</Text>
            <Text>{currentDate}</Text>
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Donations</Text>
            <Text style={styles.statValue}>{monthlyStats.totalDonations}</Text>
            <Text style={styles.statChange}>{monthlyStats.donationsGrowth} vs last month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>New Donors</Text>
            <Text style={styles.statValue}>{monthlyStats.newDonors}</Text>
            <Text style={styles.statChange}>{monthlyStats.donorsGrowth} vs last month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Blood Collected</Text>
            <Text style={styles.statValue}>{(monthlyStats.bloodCollected * 0.45).toFixed(1)}L</Text>
            <Text style={styles.statChange}>{monthlyStats.bloodGrowth} vs last month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Requests Fulfilled</Text>
            <Text style={styles.statValue}>{monthlyStats.requestsFulfilled}</Text>
            <Text style={styles.statChange}>{monthlyStats.requestsGrowth} vs last month</Text>
          </View>
        </View>

        {/* Blood Group Distribution */}
        {bloodGroupDistribution.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Blood Group Distribution</Text>
            <Text style={{ fontSize: 9, color: '#666', marginBottom: 10 }}>
              Total Units Collected: {totalUnits}
            </Text>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Blood Group</Text>
              <Text style={styles.col2}>Donations</Text>
              <Text style={styles.col3}>Units</Text>
              <Text style={styles.col4}>Percentage</Text>
            </View>
            {bloodGroupDistribution.map((item, index) => (
              <View
                key={item.group}
                style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
              >
                <Text style={styles.col1}>{item.group}</Text>
                <Text style={styles.col2}>{item.donations}</Text>
                <Text style={styles.col3}>{item.units}</Text>
                <Text style={styles.col4}>{item.percentage}%</Text>
              </View>
            ))}
          </>
        )}

        {/* Monthly Trends */}
        {monthlyTrends && monthlyTrends.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Donation Trends</Text>
            <Text style={{ fontSize: 9, color: '#666', marginBottom: 10 }}>
              Monthly donation statistics for the current year
            </Text>
            <View style={styles.tableHeader}>
              <Text style={{ width: '50%' }}>Month</Text>
              <Text style={{ width: '50%' }}>Donations</Text>
            </View>
            {monthlyTrends.map((item, index) => (
              <View
                key={item.month}
                style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
              >
                <Text style={{ width: '50%' }}>{item.month}</Text>
                <Text style={{ width: '50%' }}>{item.donations}</Text>
              </View>
            ))}
            <View style={{ marginTop: 10, padding: 10, backgroundColor: '#f9fafb', borderRadius: 4 }}>
              <Text style={{ fontSize: 9, color: '#666' }}>
                Total Donations (Year to Date): {monthlyTrends.reduce((sum, item) => sum + item.donations, 0)}
              </Text>
              <Text style={{ fontSize: 9, color: '#666', marginTop: 3 }}>
                Average per Month: {(monthlyTrends.reduce((sum, item) => sum + item.donations, 0) / monthlyTrends.length).toFixed(1)}
              </Text>
            </View>
          </>
        )}

        {/* Summary Section */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Report Summary</Text>
          <Text style={styles.summaryText}>
            During <Text style={styles.highlightText}>{selectedMonthName} {selectedYear}</Text>, the Blood Donation Management System recorded:
          </Text>
          <Text style={styles.summaryText}>
            • <Text style={styles.highlightText}>{monthlyStats.totalDonations}</Text> total donations (
            {monthlyStats.donationsGrowth} compared to the previous month)
          </Text>
          <Text style={styles.summaryText}>
            • <Text style={styles.highlightText}>{monthlyStats.newDonors}</Text> new donors registered (
            {monthlyStats.donorsGrowth} growth)
          </Text>
          <Text style={styles.summaryText}>
            • <Text style={styles.highlightText}>{(monthlyStats.bloodCollected * 0.45).toFixed(1)}L</Text> of blood collected from {monthlyStats.bloodCollected} units (
            {monthlyStats.bloodGrowth} increase)
          </Text>
          <Text style={styles.summaryText}>
            • <Text style={styles.highlightText}>{monthlyStats.requestsFulfilled}</Text> blood requests successfully fulfilled (
            {monthlyStats.requestsGrowth} improvement)
          </Text>
          {bloodGroupDistribution.length > 0 && (
            <Text style={styles.summaryText}>
              • Most common blood group: <Text style={styles.highlightText}>{bloodGroupDistribution[0]?.group}</Text> with {bloodGroupDistribution[0]?.percentage}% of donations
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            This is a computer-generated document. No signature required.
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
            fixed
          />
        </View>
      </Page>
    </Document>
  )
}

export default ReportsAnalyticsPDF
