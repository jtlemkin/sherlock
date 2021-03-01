import express from 'express'
import { getContracts } from './api'
import { 
    getProjectInterfaces, 
    contractNameFromPath,
} from './interface-parsing'
import { getBestMatchesForContracts } from './fork-detection'

const app = express()
const PORT = 8000

// Start the server
async function start() {
    const localProjects = await getProjectInterfaces()

    app.get('/', (req, res) => res.send("Hello, World!"))

    app.get('/contract/:contractID', async (req, res) => {
        try {
            const uploadedContracts = await getContracts(req.params["contractID"])

            const bestMatches = getBestMatchesForContracts(uploadedContracts, localProjects)

            const response = uploadedContracts.map(uploadedContract => {
                const match = bestMatches.get(uploadedContract.name)
                const uploadedName = contractNameFromPath(uploadedContract.name)

                if (match) {
                    return `<p>${uploadedName}.sol found best similarity score of ${match[1]} from ${match[0]}</p>`
                } else {
                    return `<p>${uploadedName}.sol has no found fork candidates</p>`
                }
            }).join('')

            res.send(response)
        } catch(err) {
            console.log("ERROR", err)
            res.send(err)
        }
    })

    app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
    })
}

start()