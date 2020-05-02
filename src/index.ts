import {isSupportedPage, newGithubListener} from "./github-listeners"

/**
 * Main
 * 1. get current page information
 * 2. instantiate appropriate event listeners
 * 3. wait for user events
 */
const main = async () => {
    loadExtension()
    window.addEventListener('popstate', loadExtension)
}

const loadExtension = () => {
    if (!isSupportedPage()) return
    let listener = newGithubListener()
    document.onkeydown = (e: KeyboardEvent) => listener?.handleKeydown(e)
}

main()
