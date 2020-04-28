import {isSupportedPage, newGithubListener} from "./github-listeners"

/**
 * Main
 * 1. get current page information
 * 2. instantiate appropriate event listeners
 * 3. wait for user events
 */
const main = async () => {

    if (!isSupportedPage()) return

    let listener = newGithubListener()

    document.onkeydown = (e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowUp':
                listener?.up(e)
                break
            case 'ArrowRight':
                listener?.right(e)
                break
            case 'ArrowDown':
                listener?.down(e)
                break
            case 'ArrowLeft':
                listener?.left(e)
                break
            case 'Enter':
                listener?.enter(e)
                break
        }
    }
}

main()
