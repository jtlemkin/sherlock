import axios from 'axios'

const etherscanAPIKey = "P5J1B9HADZM199WWRBR1X31T72E98PDRCF"
const etherscanBaseURL = "https://api.etherscan.io/api?module=contract&action=getsourcecode"

export async function getContracts(contractID: string) {
    try {
        const url = etherscanBaseURL + "&address=" + contractID + "&apikey=" + etherscanAPIKey
        console.log("URL", url)
        const response = await axios.get(url)
        const brokenSourceCodeJSONString = response.data["result"][0]["SourceCode"]
        const fixedSourceCodeObject = JSON.parse(brokenSourceCodeJSONString.slice(1, brokenSourceCodeJSONString.length - 1))
        const contracts = (Object.values(fixedSourceCodeObject["sources"]) as any[])
            .map(contract => contract["content"])

        return contracts
    } catch(err) {
        throw err
    }
}