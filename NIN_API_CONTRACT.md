# NIN Auto-Fill Integration Contract

The registration page already supports the requested NIN flow:

1. Member enters an 11-digit NIN.
2. Member gives consent.
3. Member clicks **Retrieve NIN Details**.
4. The website sends the NIN to the HTTPS URL configured as `NIN_VERIFY_ENDPOINT` in `firebase-config.js`.
5. The secure backend verifies the NIN with the approved NIMC/NINAuth integration.
6. Returned fields automatically populate Full Name, Date of Birth, Gender, Phone Number and Passport Photograph.
7. Any field the approved service does not return remains editable for manual entry.

## Expected request

POST JSON:

```json
{
  "nin": "12345678901",
  "consent": true
}
```

## Expected successful response

```json
{
  "verified": true,
  "verificationRef": "provider-reference-if-available",
  "fullName": "MEMBER FULL NAME",
  "dateOfBirth": "1990-01-31",
  "gender": "Male",
  "phone": "08000000000",
  "photoDataUrl": "data:image/jpeg;base64,..."
}
```

A field may be omitted or returned as an empty string when it is not available. The browser then leaves that field open for manual entry.

## Expected failure response

```json
{
  "verified": false,
  "message": "NIN could not be verified"
}
```

## Privacy design

The frontend does not save the full NIN in Firestore. On submission it saves only:

- `ninMasked`, for example `123•••••901`
- `ninHash`, a SHA-256 one-way hash used for deduplication/reference
- `ninVerified`
- `ninVerificationRef`, when supplied by the verification service

The full NIN is never placed on the membership card or public QR-verification collection.

## Important

Do not put NIMC/NINAuth client secrets inside GitHub Pages, `firebase-config.js`, or any browser JavaScript. A live NIN lookup requires a secure approved backend endpoint. The website itself can still be deployed and tested with Firebase while that endpoint is blank.
