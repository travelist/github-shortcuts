/**
 * Utils.ts
 *
 * Utility methods to be used in anywhere in this project
 */

/**
 * @return true when query parameter is not empty; otherwise false
 */
export const hasQueryParams = (): boolean => {
    return location.search.length > 0
}

/**
 * @return query parameter object
 */
export const getQueryParams = (): Map<string, string> => {
    if (!hasQueryParams()) return new Map<string, string>()

    const q = location.search.substr(1)

    let params = new Map<string, string>()
    q.split('&').forEach((a) => {
        let kv = a.split('=')
        params.set(kv[0], decodeURIComponent(kv[1]))
    })

    return params
}

/**
 * Set or overwrite query parameter
 * The execution of this method results in page transitions
 *
 * @param kv key-value pair
 */
export const setQueryParams = (kv: Map<string, string>) => {
    if (kv == null || kv.size === 0) return;

    let q = getQueryParams()
    kv.forEach((v, k) => q.set(k, v))

    let search: string = '?'
    q.forEach((v, k) => search += `${k}=${encodeURIComponent(v)}&`)
    location.search = search.substring(0, search.length - 1)
}

/**
 * Overwrite all query parameter
 * The execution of this method results in page transitions
 *
 * @param kv key-value pair
 */
export const overwriteAllQueryParams = (kv: Map<string, string>) => {
    if (kv == null || kv.size === 0) {
        location.search = ''
        return
    }

    let search: string = '?'
    kv.forEach((v, k) => search += `${k}=${encodeURIComponent(v)}&`)
    location.search = search.substring(0, search.length - 1)
}
