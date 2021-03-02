import axios from 'axios'
import { Contract } from './types'

const etherscanAPIKey = "P5J1B9HADZM199WWRBR1X31T72E98PDRCF"
const etherscanBaseURL = "https://api.etherscan.io/api?module=contract&action=getsourcecode"

// Downloads smart contract source from etherscan
export async function getContracts(contractID: string) {
    const url = etherscanBaseURL + "&address=" + contractID + "&apikey=" + etherscanAPIKey

    const response = await axios.get(url)
    const sourceCode = response.data["result"][0]["SourceCode"]
    if (sourceCode[0] == "{") {
        // "Malformed object"
        const fixedSourceCodeResponse = JSON.parse(sourceCode.slice(1, sourceCode.length - 1))
        return Object.keys(fixedSourceCodeResponse["sources"])
            .map(name => ({
                name, 
                content: fixedSourceCodeResponse["sources"][name]["content"]
            } as Contract))
    } else {
        // Source code string
        return [{
            name: "Contract",
            content: sourceCode
        }]
    }
}