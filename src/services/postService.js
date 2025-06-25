// src/services/postService.js
export function getPosts() {
  return JSON.parse(localStorage.getItem('posts') || '[]')
}

export function savePost(post) {
  const posts = getPosts()
  post.id = Date.now().toString()
  post.createdAt = new Date().toISOString()
  posts.push(post)
  localStorage.setItem('posts', JSON.stringify(posts))
}

export function getPostsByUser(email) {
  return getPosts().filter(p => p.author === email)
}

export function updatePost(id, updatedPost) {
  let posts = getPosts()
  posts = posts.map(p => (p.id === id ? { ...p, ...updatedPost } : p))
  localStorage.setItem('posts', JSON.stringify(posts))
}

export function deletePost(id) {
  let posts = getPosts().filter(p => p.id !== id)
  localStorage.setItem('posts', JSON.stringify(posts))
}

export function addCommentToPost(postId, comment) {
  const posts = getPosts()
  const post = posts.find(p => p.id === postId)
  if (!post) return

  if (!post.comments) {
    post.comments = []
  }

  post.comments.push({
    ...comment,
    createdAt: new Date().toISOString()
  })

  localStorage.setItem('posts', JSON.stringify(posts))
}
