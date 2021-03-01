import express from 'express'
import { getContracts } from './api'
import { 
    getContractInterfaces, 
    contractNameFromPath 
} from './interface-parsing'
import { jaccardDistance } from './text-distance'

const app = express()
const PORT = 8000

async function start() {
    const projectInterfaces = await getContractInterfaces()

    app.get('/', (req, res) => res.send("Hello, World!"))

    app.get('/contract/:contractID', async (req, res) => {
        try {
            const contracts = await getContracts(req.params["contractID"])
            const projectInterface = contracts.map(contract => contractNameFromPath(contract.name))

            projectInterfaces.forEach(pi => {
                console.log(pi.projectName, jaccardDistance(pi.contractNames, projectInterface))
            })

            res.json(projectInterface)
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