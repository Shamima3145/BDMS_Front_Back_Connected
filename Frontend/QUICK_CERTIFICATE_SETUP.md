# Quick Setup Instructions

## Add Your Certificate Template

You shared a certificate template image. To use it:

1. Save the certificate image you have (the one with "CERTIFICATE OF APPRECIATION" design)
2. Rename it to: `certificate-template.png`
3. Place it in: `Frontend/public/certificate-template.png`

That's it! The download button will now generate PDFs with your certificate template.

## How It Works

When a user clicks the download button:
- ✅ A PDF is generated using @react-pdf/renderer
- ✅ Your certificate template is used as the full-page background
- ✅ The logged-in user's name is automatically placed on the certificate
- ✅ The PDF downloads with filename: `certificate-{ID}-{UserName}.pdf`

## Name Positioning

The name appears centered at 48% from the top. If you need to adjust:
- Edit `Frontend/src/components/CertificatePDF.jsx`
- Change the `top` value in `nameContainer` style (currently `48%`)
- Change `fontSize`, `color`, or other text properties as needed

## No UI Changes

✅ All existing UI remains unchanged
✅ Only the download functionality was enhanced
✅ Modal view feature still works perfectly
✅ Icon buttons remain the same
