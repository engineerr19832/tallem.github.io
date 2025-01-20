document.getElementById('oauthButton').addEventListener('click', function() {
    // Replace with your actual OAuth flow logic

    // Example OAuth flow steps (simplified for demonstration):

    // Step 1: Redirect users to Google OAuth consent page
    const clientId = '919212619443-27tqsg4njs32krd7itrje57np43gmak6.apps.googleusercontent.com'; // Replace with your Google OAuth client ID
    const redirectUri = 'com.googleusercontent.apps.919212619443-27tqsg4njs32krd7itrje57np43gmak6'; // Replace with your redirect URI
      // Specify the scopes you need, comma-separated
    const scopes = 'https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send https://mail.google.com https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/contacts https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/profile.emails.read https://www.googleapis.com/auth/meetings.space.created https://www.googleapis.com/auth/meetings.space.readonly https://www.googleapis.com/auth/meetings.media.readonly https://www.googleapis.com/auth/meetings https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/devstorage.read_only https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/monitoring.read https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/photospicker.mediaitems.readonly';
    const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent`;
  //const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopes)}`;

    window.location.href = authUrl;

    // After user grants consent and returns to your redirect URI,
    // handle the OAuth code exchange and any further actions here.
});
