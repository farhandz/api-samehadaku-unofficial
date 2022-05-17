const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const router = require('./route/index')
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/api',router)
app.use('/',(req,res)=>{
    res.send({
        message : 'Samehadaku Rest Api',
        createdBy : 'Farhandz ♥️'
    })
})
app.use('/api',(req,res) =>{
    res.send({
        message:'check our github for more info',
        github :'https://github.com/farhandz'
    })
})


app.use('*',(req,res) =>{
    res.json({
        'status':'not found path',
        message: 'read the docs here https://github.com/farhandz'
    })
})
app.listen(port, () => {
    console.log('listening on port', port)
})