import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

// Create styles for PDF
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
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#dc2626',
    color: '#fff',
    padding: 8,
    fontWeight: 'bold',
    marginTop: 15,
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
  col1: { width: '15%' },
  col2: { width: '12%' },
  col3: { width: '10%' },
  col4: { width: '10%' },
  col5: { width: '23%' },
  col6: { width: '15%' },
  col7: { width: '15%' },
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
  summary: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
  },
  summaryText: {
    fontSize: 11,
    marginBottom: 3,
  },
})

const DonationHistoryPDF = ({ donations, userName, userEmail, totalDonations, filterYear }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Donation History Report</Text>
          <Text style={styles.subtitle}>Blood Donation Management System</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Donor Name:</Text>
            <Text>{userName || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text>{userEmail || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Report Generated:</Text>
            <Text>{currentDate}</Text>
          </View>
          {filterYear && filterYear !== 'all' && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Filter Year:</Text>
              <Text>{filterYear}</Text>
            </View>
          )}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Total Donations: {totalDonations}
          </Text>
          <Text style={styles.summaryText}>
            Records in Report: {donations.length}
          </Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Donation ID</Text>
          <Text style={styles.col2}>Blood Group</Text>
          <Text style={styles.col3}>Units</Text>
          <Text style={styles.col4}>Type</Text>
          <Text style={styles.col5}>Center</Text>
          <Text style={styles.col6}>Date</Text>
          <Text style={styles.col7}>Status</Text>
        </View>

        {/* Table Rows */}
        {donations.map((donation, index) => (
          <View
            key={donation.id}
            style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
          >
            <Text style={styles.col1}>{donation.id}</Text>
            <Text style={styles.col2}>{donation.blood_group}</Text>
            <Text style={styles.col3}>{donation.units}</Text>
            <Text style={styles.col4}>{donation.type}</Text>
            <Text style={styles.col5}>{donation.center_name}</Text>
            <Text style={styles.col6}>{formatDate(donation.donated_at)}</Text>
            <Text style={styles.col7}>{donation.status}</Text>
          </View>
        ))}

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

export default DonationHistoryPDF
