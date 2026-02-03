const form = document.getElementById('form')
const messages = document.getElementById('messages')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const text = document.getElementById('text').value
  const image = document.getElementById('image').files[0]

  messages.innerHTML += `<div class="msg user">👤 ${text}</div>`

  const formData = new FormData()
  formData.append('message', text)
  if (image) formData.append('image', image)

  const res = await fetch('/chat', {
    method: 'POST',
    body: formData
  })

  const data = await res.json()

  messages.innerHTML += `<div class="msg bot">🤖 ${data.reply}</div>`

  form.reset()
})
