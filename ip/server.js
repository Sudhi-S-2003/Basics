const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const requestIp = require('request-ip')
const { UAParser } = require('ua-parser-js')
const fetch = require('node-fetch') // ✅ Using v2

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(requestIp.mw())
app.set('trust proxy', true)
// Fake database
const users = []
const sessions = []

// 🔐 Create a test user on server start
;(async () => {
  const passwordHash = await bcrypt.hash("password123", 10)
  users.push({
    id: "1",
    email: "user@example.com",
    passwordHash,
  })
})()

// 🌍 Get location from IP
async function getLocationFromIP(ip) {
  // Handle local testing cases
  if (ip === '::1' || ip === '127.0.0.1') {
    return 'Localhost'
  }

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await response.json()

    if (data.error || !data.city || !data.country_name) {
      return "Unknown Location"
    }

    return `${data.city}, ${data.country_name}`
  } catch (error) {
    return "Unknown Location"
  }
}

// 📥 POST /login
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = users.find(u => u.email === email)

  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) return res.status(401).json({ error: 'Invalid credentials' })

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.clientIp ||
    req.ip ||
    'Unknown IP'

  const parser = new UAParser(req.headers['user-agent'])
  const ua = parser.getResult()

  const session = {
    id: Math.random().toString(36).substring(2, 12),
    userId: user.id,
    ipAddress: ip,
    location: await getLocationFromIP(ip),
    browser: ua.browser.name || 'Unknown',
    os: ua.os.name || 'Unknown',
    createdAt: new Date(),
    lastAccess: new Date(),
    isCurrent: true,
  }

  // Invalidate previous sessions for the user
  sessions.forEach((s) => {
    if (s.userId === user.id) s.isCurrent = false
  })

  sessions.push(session)

  res.json({
    message: 'Login successful',
    session,
  })
})

// 🧾 GET /sessions (get all sessions for user id = 1)
app.get('/sessions', (req, res) => {
  const userSessions = sessions.filter((s) => s.userId === '1')
  res.json(userSessions)
})

// ❌ DELETE /sessions/:id
app.delete('/sessions/:id', (req, res) => {
  const sessionIndex = sessions.findIndex((s) => s.id === req.params.id)
  if (sessionIndex === -1)
    return res.status(404).json({ error: 'Session not found' })

  sessions.splice(sessionIndex, 1)
  res.json({ message: 'Session ended' })
})

// 🧪 Anonymous guest session (optional)
app.get('/session', async (req, res) => {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.clientIp ||
    req.ip ||
    'Unknown IP'

  const parser = new UAParser(req.headers['user-agent'])
  const ua = parser.getResult()

  const session = {
    id: Math.random().toString(36).substring(2, 12),
    userType: 'guest',
    ipAddress: ip,
    location: await getLocationFromIP(ip),
    browser: ua.browser.name || 'Unknown',
    os: ua.os.name || 'Unknown',
    createdAt: new Date(),
    lastAccess: new Date(),
    isCurrent: true,
  }

  sessions.push(session)

  res.json({
    message: 'Guest session created',
    session,
  })
})

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`)
})
