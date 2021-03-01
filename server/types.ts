export interface Contract {
    name: string,
    content: string
}

export interface Project {
    projectName: string,
    contractNames: string[]
}