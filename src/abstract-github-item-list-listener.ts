import {AbstractGithubListener} from "./abstract-github-listener";

/**
 * This is a skeletal event handling for item lists that appears
 * relatively often in Github.
 */
export abstract class AbstractGithubItemListListener extends AbstractGithubListener {

    /**
     * HTML Elements of items
     */
    protected abstract items: NodeListOf<HTMLElement>

    /**
     * index of currently focused item
     */
    protected currentItem: number = 0

    /**
     * @return length of the item list
     */
    protected size(): number {
        return this.items.length
    }

    /**
     * @return true when the item list is empty
     */
    protected isEmpty(): boolean {
        return !(this.items instanceof NodeList) || this.items.length == 0
    }

    /**
     * @return true when the current item has previous one
     */
    protected hasPrevItem(): boolean {
        return this.currentItem > 0
    }

    /**
     * @return true when the current item has next one
     */
    protected hasNextItem(): boolean {
        return this.currentItem + 1 < this.items.length
    }

    /**
     * move current focus onto the next item
     */
    protected focusOnNextItem(): void {
        if (!this.hasNextItem()) return
        this.focusOut(this.currentItem)
        this.focusOn(++this.currentItem)
    }

    /**
     * move current focus onto the previous item
     */
    protected focusOnPreviousItem(): void {
        if (!this.hasPrevItem()) return
        this.focusOut(this.currentItem)
        this.focusOn(--this.currentItem)
    }

    /**
     * @param itemIndex item index to be focused
     */
    protected focusOn(itemIndex: number): void {
        if (itemIndex < 0 || itemIndex > this.size()) return
        this.items[itemIndex].classList.add(AbstractGithubListener.ACTIVE_LIST_ITEM_CLASS)
        this.centralizeIfNeeded(this.items[itemIndex])
    }

    /**
     * @param itemIndex item index to be unfocused
     */
    protected focusOut(itemIndex: number): void {
        if (itemIndex < 0 || itemIndex > this.size()) return
        this.items[itemIndex].classList.remove(AbstractGithubListener.ACTIVE_LIST_ITEM_CLASS)
    }
}
