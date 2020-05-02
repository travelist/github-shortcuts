/**
 * Methods that all event listeners need to implement
 */
export interface GithubListener {
    /**
     * handleKeydown
     */
    handleKeydown(e: KeyboardEvent): void
}
