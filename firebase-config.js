// ONLY EDIT THIS FILE before deployment.
// Firebase Console -> Project settings -> Your apps -> Web app -> SDK setup and configuration.
export const firebaseConfig = {
  apiKey: "PASTE_FIREBASE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  // No Firebase Storage bucket is needed by this version.
  messagingSenderId: "PASTE_MESSAGING_SENDER_ID",
  appId: "PASTE_APP_ID"
};

// LIVE NIN AUTO-FILL: paste the HTTPS URL of your approved secure NIMC/NINAuth backend here.
// The browser sends the member's NIN to that backend and receives only the approved identity fields.
// NEVER place a NINAuth client secret in this file or anywhere on GitHub Pages.
export const NIN_VERIFY_ENDPOINT = "";
