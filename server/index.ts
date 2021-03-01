import express from 'express'
import { getContracts } from './api'

const app = express()
const PORT = 8000

app.get('/', (req, res) => res.send("Hello, World!"))

app.get('/contract/:contractID', async (req, res) => {
    try {
        const result = await getContracts(req.params["contractID"])
        res.json(result)
    } catch(err) {
        console.log("ERROR", err)
        res.send(err)
    }
})

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})