import { readdir } from 'promise-fs'
import { normalize, join, basename } from 'path'
import { ProjectInterface } from './types'

export function contractNameFromPath(path: string) {
    return basename(path, ".sol")
}

export async function getContractInterfaces() {
    try {
        const projects = await readdir(normalize("contracts"))

        const contracts =  await Promise.all(
            projects.map(async dir => {
                const files = await readdir(join("contracts", dir))
                const contractNames = files.map(file => basename(file, ".sol"))
                const projectName = dir.replace("_", "/")
                return {projectName, contractNames} as ProjectInterface
            })
        )

        return contracts
    } catch(err) {
        throw err
    }
}