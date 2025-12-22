import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#F5F1E8',
    padding: 30,
  },
  outerBorder: {
    borderWidth: 3,
    borderColor: '#C8B091',
    borderStyle: 'solid',
    padding: 12,
    height: '100%',
  },
  innerBorder: {
    borderWidth: 1,
    borderColor: '#C8B091',
    borderStyle: 'solid',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  certificateTitle: {
    fontSize: 48,
    letterSpacing: 8,
    color: '#4A4A4A',
    fontFamily: 'Times-Roman',
    marginBottom: 8,
    textAlign: 'center',
  },
  ofCompletion: {
    fontSize: 14,
    letterSpacing: 6,
    color: '#666666',
    fontFamily: 'Times-Roman',
    marginBottom: 6,
    textAlign: 'center',
  },
  proudlyPresented: {
    fontSize: 11,
    fontFamily: 'Times-Italic',
    color: '#777777',
    marginBottom: 40,
    textAlign: 'center',
  },
  nameText: {
    fontSize: 42,
    fontFamily: 'Times-Italic',
    color: '#555555',
    marginBottom: 12,
    textAlign: 'center',
  },
  nameLine: {
    width: 400,
    height: 1,
    backgroundColor: '#999999',
    marginBottom: 40,
  },
  completionText: {
    fontSize: 13,
    fontFamily: 'Times-Italic',
    color: '#777777',
    marginTop: 20,
    textAlign: 'center',
  },
})

const CertificatePDF = ({ userName }) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>
            <Text style={styles.certificateTitle}>CERTIFICATE</Text>
            <Text style={styles.ofCompletion}>OF COMPLETION</Text>
            <Text style={styles.proudlyPresented}>proudly presented to</Text>
            
            <Text style={styles.nameText}>{userName || 'Donor Name'}</Text>
            <View style={styles.nameLine} />
            
            <Text style={styles.completionText}>for completing the Blood Donation</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default CertificatePDF
