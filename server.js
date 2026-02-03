const express = require('express')
const cors = require('cors')
const multer = require('multer')
const ollama = require('ollama')
const path = require('path')
const fs = require('fs')

const app = express()
const upload = multer({ dest: 'uploads/' })

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.post('/chat', upload.single('image'), async (req, res) => {
  try {
    const { message } = req.body
    const imagePath = req.file ? path.resolve(req.file.path) : null

    const response = await ollama.chat({
      model: 'qwen3-vl:4b',
      messages: [
        {
          role: 'user',
          content: message,
          images: imagePath ? [imagePath] : []
        }
      ],
      stream: false
    })

    // remove imagem após uso
    if (imagePath) fs.unlinkSync(imagePath)

    res.json({ reply: response.message.content })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao conversar com a LLM' })
  }
})

app.listen(3000, () => {
  console.log('🟢 Chat rodando em http://localhost:3000')
})
