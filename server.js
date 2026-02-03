const express = require('express')
const cors = require('cors')
const multer = require('multer')
const { Ollama } = require('ollama')
const path = require('path')
const fs = require('fs')

const app = express()
const upload = multer({ dest: 'uploads/' })

// 👇 aponta para o Ollama rodando no HOST
const ollama = new Ollama({
  host: 'http://host.docker.internal:11434'
})

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.post('/chat', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file ? path.resolve(req.file.path) : null

    const response = await ollama.chat({
      model: 'qwen3-vl:4b',
      messages: [{
        role: 'user',
        content: req.body.message,
        images: imagePath ? [imagePath] : []
      }]
    })

    if (imagePath) fs.unlinkSync(imagePath)

    res.json({ reply: response.message.content })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.listen(3000, () => {
  console.log('Chat rodando na porta 3000')
})
