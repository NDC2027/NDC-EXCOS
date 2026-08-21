# NDC EXCO Membership Registration System

Professional GitHub Pages + Firebase system for **Ward, Local Government and State EXCO** registration.

## Main improvements
- One portal with EXCO-level selector: Ward / Local Government / State.
- Level-specific position lists in `common.js`.
- Jurisdiction-aware office replacement: Ward positions conflict only inside the same ward; LGA positions only inside the same LGA; State positions only inside the same state.
- Premium landscape membership card (86 mm × 54 mm) with navy/royal/red/gold geometric security-style pattern.
- No printed expiry date. The QR record remains active until an administrator replaces the office holder.
- NIN lookup UI auto-fills approved fields when your secure NIMC/NINAuth endpoint is connected.
- Full NIN is not stored; only masked NIN + SHA-256 hash are stored.
- No Firebase Storage. Compressed passport/signatures are saved as Firestore media documents.

## Before deployment
1. Edit only `firebase-config.js` and paste your Firebase Web App configuration.
2. Enable Firebase Authentication: **Anonymous** and **Email/Password**.
3. Create Firestore and publish `firestore.rules`.
4. Create an Email/Password admin user. Add Firestore document `admins/{ADMIN_UID}` with `active: true`.
5. Test with VS Code Live Server.
6. Push the folder to GitHub and enable GitHub Pages from the `main` branch root.
7. Add your `username.github.io` hostname to Firebase Authentication Authorized Domains if required.

## NIN
For live NIN auto-fill, paste the URL of your approved secure NIMC/NINAuth backend into `NIN_VERIFY_ENDPOINT` in `firebase-config.js`. Never put a NINAuth client secret in GitHub Pages.

## Customizing positions
All Ward, LGA and State positions are centralized in `common.js` under `POSITIONS`. You can add/remove a title without changing the rest of the site.
