import express from 'express'
import { getContracts } from './api'
import { 
    getProjectInterfaces, 
    contractNameFromPath,
    getContractInterface,
    getContract
} from './interface-parsing'
import { jaccardDistance } from './fork-detection'

const app = express()
const PORT = 8000

const projectInterfaceSimilarityThreshold = 0.04

async function start() {
    const projects = await getProjectInterfaces()

    app.get('/', (req, res) => res.send("Hello, World!"))

    app.get('/contract/:contractID', async (req, res) => {
        try {
            const contracts = await getContracts(req.params["contractID"])
            const projectInterface = contracts.map(contract => contractNameFromPath(contract.name))

            const bestMatches = new Map<string, [string, number]>()
            const contractInterfaces = contracts.map(contract => getContractInterface(contract.content))

            const projectDistances = projects.map(pi => {
                return jaccardDistance(pi.contractNames, projectInterface)
            })

            const candidateProjects = projects
                .filter((p, i) => projectDistances[i] > projectInterfaceSimilarityThreshold)

            contractInterfaces.forEach((contractInterface, i) => {
                const contractName = contracts[i].name

                candidateProjects.forEach(project => {
                    project.contractNames.forEach(async candidateName => {
                        const file = await getContract(project.projectName, candidateName)
                        const candidateInterface = getContractInterface(file)

                        const distance = jaccardDistance(contractInterface, candidateInterface)

                        console.log("CONTRACT", contractInterface, "CANDIDATE", candidateInterface)

                        if (distance > 0) {
                            console.log(contractName, project.projectName + "/" + candidateName, distance)
                        }
                    })
                })
            })

            console.log(bestMatches)

            res.json(bestMatches)
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