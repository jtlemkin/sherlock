import { readdir, readFileSync } from 'promise-fs'
import { normalize, join, basename } from 'path'
import { Project } from './types'

export function contractNameFromPath(path: string) {
    return basename(path, ".sol")
}

export async function getProjectInterfaces() {
    try {
        const projects = await readdir(normalize("contracts"))

        const contracts =  await Promise.all(
            projects.map(async dir => {
                const files = await readdir(join("contracts", dir))
                const contractNames = files.map(file => basename(file, ".sol"))
                const projectName = dir.replace("_", "/")
                return {projectName, contractNames} as Project
            })
        )

        return contracts
    } catch(err) {
        throw err
    }
}

export function getContract(slug: string, contractName: string) {
    const path = join("contracts", slug.replace('/', '_'), contractName)
    return readFileSync(path, "utf-8")
}

// This can probably be done better with regex
export function getContractInterface(file: string) {
    try {
        let contractInterface = new Array<string>()
        let functionTokens: string[] = []
        let isReadingInFuncDef = false

        const lines = file.split('\n')
        lines.forEach((line, i) => {
            const tokens = line.trim().split(" ")
            const singleLineStarts = ["import", "event"]
            const multiLineStarts = ["function", "contract"]

            if (singleLineStarts.includes(tokens[0])) {
                const trimmed = line.trim()
                contractInterface.push(trimmed.slice(0, trimmed.length - 1))
            } else if (multiLineStarts.includes(tokens[0])) {
                let k = i
                let currLine = lines[k]
                isReadingInFuncDef = true
                while (isReadingInFuncDef && currLine) {
                    const tokens = currLine.split(" ")
                    for (let j = 0; j < tokens.length; j++) {
                        if (tokens[j] === "{") {
                            isReadingInFuncDef = false
                            break
                        }

                        if (tokens[j] !== '') {
                            functionTokens.push(tokens[j])
                        }
                    }

                    k += 1
                    currLine = lines[k]
                }

                const output = functionTokens
                    .join(' ')
                contractInterface.push(output
                    .trim()
                )
                functionTokens = []
            }
        })

        return contractInterface
    } catch(err) {
        throw err
    }
}