const contextWindowSize = 6 // số đoạn chat gần nhất gửi đi
const history = session.messages.slice(-contextWindowSize)

// Gửi history + current message
await axios.post(
  `/api/chat/sessions/${session.id}/messages`,
  { messages: [...history, { role: 'user', content }] },
  { headers: { Authorization: `Bearer ${token}` } }
)
