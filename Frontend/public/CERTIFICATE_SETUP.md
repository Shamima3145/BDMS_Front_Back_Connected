# Certificate Template Setup

## Required Action

To enable certificate download functionality, you need to add your Canva-designed certificate template image:

1. Export your certificate design from Canva as a PNG or JPG file
2. Save it as `certificate-template.png` in the `Frontend/public/` folder
3. The image should be in landscape orientation (A4 size recommended)

### Current Location
```
Frontend/
  public/
    certificate-template.png  <-- Place your certificate image here
```

### Design Guidelines
- The certificate template should have a placeholder area for the donor's name
- The name will be positioned at approximately 48% from the top, centered
- The name will appear in golden color (similar to the sample certificate)
- Font size: 40px
- Font: Bold

### Testing
Once you place the certificate template image:
1. Go to the User Records page (user/track)
2. Click the download icon button for any donation record
3. The PDF will be generated and downloaded automatically

### Customization
If you need to adjust the name position or styling, edit:
`Frontend/src/components/CertificatePDF.jsx`
