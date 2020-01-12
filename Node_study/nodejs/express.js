const express = require('express')
const app = express()
// Flask의 라우트 방식이라고 생각하면될듯싶다

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
