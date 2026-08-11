const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// This flag lets us deliberately break the app on purpose, later,
// to practice responding to a real incident.
let forceUnhealthy = false;

app.get('/', (req, res) => {
  res.send('<h1>Resilient AWS Infra — it works</h1>');
});

// A REAL health check — not just "am I running", but "am I actually okay"
app.get('/health', (req, res) => {
  const memoryUsedMB = process.memoryUsage().heapUsed / 1024 / 1024;
  const isHealthy = !forceUnhealthy && memoryUsedMB < 200;

  if (isHealthy) {
    res.status(200).json({ status: 'healthy', memoryMB: memoryUsedMB.toFixed(1) });
  } else {
    res.status(503).json({ status: 'unhealthy', memoryMB: memoryUsedMB.toFixed(1), forced: forceUnhealthy });
  }
});

// A deliberate "break glass" switch, for practicing incident response later.
// Not something a real production app would expose publicly like this —
// we'll talk about that when we get to Piece 5.
app.get('/chaos/toggle-unhealthy', (req, res) => {
  forceUnhealthy = !forceUnhealthy;
  res.json({ forceUnhealthy });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});