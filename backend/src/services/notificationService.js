const fetch = require('node-fetch');

// Send Expo push notifications
async function sendExpoPushNotification(tokens, title, body, data = {}) {
  if (!tokens || tokens.length === 0) return;
  const messages = tokens.map(token => ({
    to: token,
    sound: 'default',
    title,
    body,
    data,
  }));

  // Expo allows up to 100 notifications per request
  const chunks = [];
  for (let i = 0; i < messages.length; i += 100) {
    chunks.push(messages.slice(i, i + 100));
  }

  for (const chunk of chunks) {
    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chunk),
      });
    } catch (err) {
      console.error('Expo push notification error:', err);
    }
  }
}

module.exports = { sendExpoPushNotification }; 