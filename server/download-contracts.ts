import { exec } from "child_process"
import { 
    readFile, 
    readdir, 
    lstatSync, 
    rmdir, 
    existsSync, 
    mkdir, 
    copyFile
} from "promise-fs"
import { join, extname, normalize, basename } from "path"

// Get slugs from contracts.txt file
async function getSlugs() {
    try {
        const text = await readFile("./contracts.txt", "utf-8")
        return text.split('\n').map(line => line.split(" ")[0])
    } catch(err) {
        throw err
    }
}

// Checks to see if path contains sol files, if not recursively check subdirectories 
async function getSolFiles(path: string) {
    try {
        const fnames = await readdir(path)
        const promise = Promise.all(fnames.map(fname => {
            return new Promise<string[]>(async (resolve, reject) => {
                try {
                    let result: string[] = []
                    const fpath = join(path, fname)
                    const stat = lstatSync(fpath)
                    if (stat.isDirectory()) {
                        result = await getSolFiles(fpath)
                    } else {
                        if (extname(fname) === ".sol") {
                            result = [fpath]
                        }
                    }
                    resolve(result)
                } catch(err) {
                    reject(err)
                }
            })
        }))
        const result = await promise
        return result.flat()
    } catch(err) {
        throw err
    }
}

// Move contract files out of downloaded git repos into a contracts folder
async function migrateSolFiles(slug: string, files: string[]) {
    const formattedSlug = slug.replace('/', '_')
    const dir = join("contracts", formattedSlug)

    if (!existsSync(dir)) {
        await mkdir(dir, {recursive: true})
    }

    try {
        await Promise.all(files.map(fname => copyFile(fname, join(dir, basename(fname)))))
    } catch(err) {
        throw err
    }
}

// This function is not resistant to the temp directory already existing
// TODO: Add check for this
function downloadSolFiles(slugs: string[]) {
    const processes = slugs.map(slug => {
        return new Promise<void>((resolve, reject) => {
            const path = normalize(`temp/${slug}`)
            const child = exec(`git clone https://github.com/${slug}.git ${path}`, (error, stdout, stderr) => {
                if (stderr) {
                    console.log(stderr)
                }
            })
            child.addListener("exit", async () => {
                const solFiles = await getSolFiles(path)
                await migrateSolFiles(slug, solFiles)
                resolve()
            })
            child.addListener("error", reject)
        })
    })

    return Promise.all(processes)
}

// Download popular smart contracts from github
async function downloadContracts() {
    try {
        const slugs = await getSlugs()
        await downloadSolFiles(slugs)
        await rmdir("temp", {recursive: true})
    } catch(err) {
        throw err
    }
}

downloadContracts()