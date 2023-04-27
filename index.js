let http = require('http'),
    path = require('path'),
    express = require('express'),
    app = express()

app.use(require('./server/routes/router'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname));


app.listen(5000, () => {
    console.log(`Server running now on http://localhost:5000`)
})