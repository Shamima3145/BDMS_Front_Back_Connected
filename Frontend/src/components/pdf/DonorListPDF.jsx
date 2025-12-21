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
  col1: { width: '10%' },
  col2: { width: '20%' },
  col3: { width: '15%' },
  col4: { width: '12%' },
  col5: { width: '20%' },
  col6: { width: '10%' },
  col7: { width: '13%' },
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
  },
  statBox: {
    width: '23%',
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statLabel: {
    fontSize: 9,
    color: '#666',
    marginBottom: 3,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
})

const DonorListPDF = ({ donors, totalDonors, eligibleDonors, bloodGroups, filterApplied }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Donor List Report</Text>
          <Text style={styles.subtitle}>Blood Donation Management System</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Report Generated:</Text>
            <Text>{currentDate}</Text>
          </View>
          {filterApplied && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Filter Applied:</Text>
              <Text>{filterApplied}</Text>
            </View>
          )}
        </View>

        {/* Statistics */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Donors</Text>
            <Text style={styles.statValue}>{totalDonors}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Eligible Now</Text>
            <Text style={styles.statValue}>{eligibleDonors}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Blood Groups</Text>
            <Text style={styles.statValue}>{bloodGroups}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>In Report</Text>
            <Text style={styles.statValue}>{donors.length}</Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>ID</Text>
          <Text style={styles.col2}>Name</Text>
          <Text style={styles.col3}>Email</Text>
          <Text style={styles.col4}>Blood Group</Text>
          <Text style={styles.col5}>Contact</Text>
          <Text style={styles.col6}>Gender</Text>
          <Text style={styles.col7}>Location</Text>
        </View>

        {/* Table Rows */}
        {donors.map((donor, index) => (
          <View
            key={donor.id}
            style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
          >
            <Text style={styles.col1}>{donor.id}</Text>
            <Text style={styles.col2}>{`${donor.firstname} ${donor.lastname}`}</Text>
            <Text style={styles.col3}>{donor.email}</Text>
            <Text style={styles.col4}>{donor.bloodgroup}</Text>
            <Text style={styles.col5}>{donor.contactNumber}</Text>
            <Text style={styles.col6}>{donor.gender}</Text>
            <Text style={styles.col7}>{donor.area}</Text>
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

export default DonorListPDF
