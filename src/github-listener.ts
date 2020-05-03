/**
 * Methods that all event listeners need to implement
 */
export abstract class GithubListener {

    /**
     * Class name for active list item
     * TODO Remove '-legacy' suffix
     */
    protected static readonly ACTIVE_LIST_ITEM_CLASS: string = 'github-shortcuts-active'

    /**
     * Tags that disables this extension when they are active
     */
    protected static readonly INPUT_WAITING_TAGS: string[] = [
        'input', 'select', 'button', 'textarea'
    ]

    /**
     * Margin to detect the necessity of scrolling
     */
    protected static readonly SCROLL_CHECK_MARGIN_PX: number = 50

    /**
     * handleKeydown
     */
    public abstract handleKeydown(e: KeyboardEvent): void

    /**
     * Scroll a browser to centralize the given element if any of the following conditions are met:
     * - the content is out of the current window
     * - the content is located within SCROLL_CHECK_MARGIN_PX of the edge of browser
     */
    protected centralizeIfNeeded(element: Element): boolean {
        let height = window.innerHeight
        let y: number = element.getBoundingClientRect().y

        if (y < GithubListener.SCROLL_CHECK_MARGIN_PX) {
            element.scrollIntoView({block: 'center'})
            return true
        }

        if (y > height - GithubListener.SCROLL_CHECK_MARGIN_PX) {
            element.scrollIntoView({block: 'center'})
            return true
        }

        return false
    }

    /**
     * return true when any of input tags is active state
     */
    protected isInputTagActive(): boolean {
        const a = document.activeElement
        if (a == null) return true
        return GithubListener.INPUT_WAITING_TAGS
            .indexOf(a.tagName.toLowerCase()) !== -1;
    }
}
