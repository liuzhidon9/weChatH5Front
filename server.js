var express = require('express')
var app = express()
var cors = require('cors')
const port = 4000
// app.use(express.static('./'))
app.use(express.static('./dist'))
app.use(cors())

app.listen(port, () => { console.log(`http://localhost:${port}`); })