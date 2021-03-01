// This is actually a modified jaccard distance as 
export function jaccardDistance(first: string[], second: string[]) {
    const s2 = new Set(second)

    const union = new Set([...first, ...second])
    const intersection = new Set(first.filter(e => s2.has(e)))

    return intersection.size / union.size 
} 