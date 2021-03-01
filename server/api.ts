import axios from 'axios'
import { Contract } from './types'

const etherscanAPIKey = "P5J1B9HADZM199WWRBR1X31T72E98PDRCF"
const etherscanBaseURL = "https://api.etherscan.io/api?module=contract&action=getsourcecode"

export async function getContracts(contractID: string) {
    try {
        const url = etherscanBaseURL + "&address=" + contractID + "&apikey=" + etherscanAPIKey
        console.log("URL", url)
        const response = await axios.get(url)
        const brokenSourceCodeJSONString = response.data["result"][0]["SourceCode"]
        const fixedSourceCodeObject = JSON.parse(brokenSourceCodeJSONString.slice(1, brokenSourceCodeJSONString.length - 1))
        return Object.keys(fixedSourceCodeObject["sources"])
            .map(name => ({
                name, 
                lines: (fixedSourceCodeObject["sources"][name]["content"] as string).split('\n')
            } as Contract))
    } catch(err) {
        throw err
    }
}