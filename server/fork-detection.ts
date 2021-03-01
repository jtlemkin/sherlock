import { Contract, Project } from './types'
import { 
    contractNameFromPath,
    getContractInterface,
    getContract
} from './interface-parsing'

// Computes similarity between two sets of strings
function jaccardDistance(first: string[], second: string[]) {
    const s2 = new Set(second)

    const union = new Set([...first, ...second])
    const intersection = new Set(first.filter(e => s2.has(e)))

    return intersection.size / union.size 
}

// This is being chosen arbitrarily for testing, a better value
// needs to be chosen
const projectInterfaceSimilarityThreshold = 0.04

// Compares uploaded contracts with local projects, first filtering out local
// projects by how many contracts they have in common, and then examining the
// signatures of the remaining contracts in order to determine if there are 
// any matches. If so this function returns the best ones
export function getBestMatchesForContracts(uploadedContracts: Contract[], localProjects: Project[]) {
    const uploadedProjectInterface = uploadedContracts
        .map(contract => contractNameFromPath(contract.name))

    const projectSimilarities = localProjects.map(pi => {
        return jaccardDistance(pi.contractNames, uploadedProjectInterface)
    })

    const bestMatches = new Map<string, [string, number]>()
    const uploadedContractInterfaces = uploadedContracts
        .map(contract => getContractInterface(contract.content))

    uploadedContractInterfaces.forEach((uploadedContractInterface, i) => {
        const uploadedContractName = uploadedContracts[i].name

        localProjects.forEach((localProject, i) => {
            // If the project has no contracts in common, they most likely 
            // aren't forked from one another
            if (projectSimilarities[i] > projectInterfaceSimilarityThreshold) {
                localProject.contractNames.forEach(async localContractName => {
                    const file = getContract(localProject.projectName, localContractName)
                    const localProjectInterface = getContractInterface(file)

                    const similarity = jaccardDistance(uploadedContractInterface, localProjectInterface)

                    if (
                        similarity > 0 && 
                        (
                            !bestMatches.has(uploadedContractName) || 
                            similarity > bestMatches.get(uploadedContractName)![1]
                        )
                    ) {
                        bestMatches.set(
                            uploadedContractName, 
                            [localProject.projectName + "/" + localContractName, similarity]
                        )
                    }
                })
            }
        })
    })

    return bestMatches
}