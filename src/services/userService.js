export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'))
}

export function updateCurrentUser(data) {
  const user = getCurrentUser()
  if (!user) return

  const users = JSON.parse(localStorage.getItem('users')) || []
  const index = users.findIndex(u => u.email === user.email)
  if (index !== -1) {
    users[index] = { ...users[index], ...data }
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', JSON.stringify(users[index]))
  }
}
