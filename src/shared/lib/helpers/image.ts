export const createSrcSet = (srcset: Array<string> | undefined) => {
    if (!srcset) return undefined

    return srcset.reduce((acc, value, index) => {
        const arr = value.match(/(?!_)\d+w/g)
        if (!arr) return acc
        return `${acc + value} ${arr.pop()}${
            index < srcset.length - 1 ? ', ' : ''
        }`
    }, '')
}
