/**
 * Methods that all event listeners need to implement
 */
export interface GithubListener {

    /**
     * handler for up keydown event
     */
    up(e: Event): void

    /**
     * handler for down keydown event
     */
    down(e: Event): void

    /**
     * handler for right keydown event
     */
    right(e: Event): void

    /**
     * handler for left keydown event
     */
    left(e: Event): void

    /**
     * handler for enter keydown event
     */
    enter(e: Event): void
}
