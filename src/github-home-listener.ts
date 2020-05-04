import {GithubListener} from "./github-listener"

/**
 * Event listener for Github activity list component
 */
export class GithubHomeListener extends GithubListener {

    /**
     * CSS Selector for retrieving js loading icon box
     * Existence of this HTML element indicates the loading state of contents
     */
    private static readonly LOADING_INDICATOR_SELECTOR: string = '.js-loader'

    /**
     * CSS Selector for retrieving activity items
     */
    private static readonly ACTIVITY_LIST_SELECTOR: string = '.js-recent-activity-container li'

    /**
     * CSS Selector for hidden activity items
     */
    private static readonly ACTIVITY_LIST_HIDDEN_ITEM_SELECTOR: string = '.js-recent-activity-container ul.list-style-none li'

    /**
     * CSS Selector for retrieving show more button
     */
    private static readonly ACTIVITY_SHOW_MORE_SELECTOR: string = 'button.js-show-more-recent-items'

    /**
     * Check the completion of activity loading
     */
    private static isLoadingCompleted(): boolean {
        return document
            .querySelectorAll(`${GithubHomeListener.LOADING_INDICATOR_SELECTOR}`)
            ?.length === 0
    }

    /**
     * index of currently focused item
     */
    private currentItem: number = 0

    /**
     * total number of issues in the current page
     */
    private totalItem: number = 0

    /**
     * HTML Elements of issue items
     */
    private items: NodeListOf<HTMLElement> = document
        .querySelectorAll(GithubHomeListener.ACTIVITY_LIST_SELECTOR)

    private hiddenItems: NodeListOf<HTMLElement> = document
        .querySelectorAll(GithubHomeListener.ACTIVITY_LIST_HIDDEN_ITEM_SELECTOR)

    /**
     * HTML Element of shoe more button
     */
    private showMoreButton: NodeListOf<HTMLElement> = document
        .querySelectorAll(`${GithubHomeListener.ACTIVITY_SHOW_MORE_SELECTOR}`)

    /**
     * Show more button has been clicked
     */
    private isDetailExpanded: boolean = false

    /**
     * true when the current focus is on the show more button
     */
    private isFocusingOnShowMoreButton: boolean = false

    constructor() {
        super();
        this.setupOnceReady()
    }

    handleKeydown(e: KeyboardEvent): void {
        switch (e.key) {
            case 'j':
                this.j(e)
                break
            case 'k':
                this.k(e)
                break
            case 'Enter':
                this.enter(e)
                break
        }
    }

    private j(e: Event): void {
        if (this.isInputTagActive()) return
        if (this.isNextShowMoreButton()) {
            this.focusOnShowMoreButton()
            return;
        }
        if (this.isFocusingOnShowMoreButton) return;
        if (!this.hasNextItem()) return
        this.focusOut(this.currentItem)
        this.focusOn(++this.currentItem)
    }

    private k(e: Event): void {
        if (this.isInputTagActive()) return
        if (this.isFocusingOnShowMoreButton) {
            this.focusOutShowMoreButton()
            return;
        }

        if (!this.hasPrevItem()) return
        this.focusOut(this.currentItem)
        this.focusOn(--this.currentItem)
    }

    private enter(e: Event): void {
        if (this.isInputTagActive()) return
        if (this.isFocusingOnShowMoreButton) {
            this.expandShowMoreButton()
        } else {
            location.href = this.getCurrentItemLink()
        }
    }

    private hasItems(): boolean {
        return this.items instanceof NodeList && this.items.length > 0
    }

    private hasNextItem(): boolean {
        return this.currentItem + 1 < this.totalItem || this.isNextShowMoreButton()
    }

    private hasPrevItem(): boolean {
        return this.currentItem > 0
    }

    private isNextShowMoreButton(): boolean {
        return this.hasShowMoreButton()
            && !this.isFocusingOnShowMoreButton
            && !this.isDetailExpanded
            && this.currentItem + 1 == this.totalItem - this.hiddenItems.length
    }

    private expandShowMoreButton(): void {
        if (!this.hasShowMoreButton() || this.isDetailExpanded) return
        this.showMoreButton[0].click()
        this.isDetailExpanded = true
        this.focusOutShowMoreButton()
        this.focusOn(this.currentItem)
    }

    private focusOn(itemIndex: number): void {
        if (itemIndex < 0 || itemIndex > this.totalItem) return
        this.items[itemIndex].classList.add(GithubListener.ACTIVE_LIST_ITEM_CLASS)
        this.centralizeIfNeeded(this.items[itemIndex])
    }

    private focusOut(itemIndex: number): void {
        if (itemIndex < 0 || itemIndex > this.totalItem) return
        this.items[itemIndex].classList.remove(GithubListener.ACTIVE_LIST_ITEM_CLASS)
    }

    private focusOnShowMoreButton() {
        if (!this.hasShowMoreButton() || this.isFocusingOnShowMoreButton) return
        this.isFocusingOnShowMoreButton = true
        this.showMoreButton[0].classList.add(GithubListener.ACTIVE_LIST_ITEM_CLASS)
        this.focusOut(this.currentItem)
    }

    private focusOutShowMoreButton() {
        if (!this.hasShowMoreButton() || !this.isFocusingOnShowMoreButton) return
        this.isFocusingOnShowMoreButton = false
        this.showMoreButton[0].classList.remove(GithubListener.ACTIVE_LIST_ITEM_CLASS)
        this.focusOn(this.currentItem)
    }

    private hasShowMoreButton(): boolean {
        return this.showMoreButton.length > 0
    }

    private getCurrentItemLink(): string {
        let itemATagSelector = `${GithubHomeListener.ACTIVITY_LIST_SELECTOR}:nth-child(${this.currentItem + 1}) > a`
        if (this.isDetailExpanded && this.currentItem - (this.totalItem - this.hiddenItems.length) >= 0) {
            let index: number = this.currentItem - (this.totalItem - this.hiddenItems.length) + 1
            itemATagSelector = `${GithubHomeListener.ACTIVITY_LIST_HIDDEN_ITEM_SELECTOR}:nth-child(${index}) > a`
        }
        let aTag = document.querySelector(itemATagSelector)
        return aTag?.getAttribute('href') || ''
    }

    private loadContents(): void {
        this.items = document
            .querySelectorAll(GithubHomeListener.ACTIVITY_LIST_SELECTOR)
        this.hiddenItems = document
            .querySelectorAll(GithubHomeListener.ACTIVITY_LIST_HIDDEN_ITEM_SELECTOR)
        this.totalItem = this.items.length
        this.showMoreButton = document
            .querySelectorAll(GithubHomeListener.ACTIVITY_SHOW_MORE_SELECTOR)
    }

    private setupOnceReady(): void {
        if (GithubHomeListener.isLoadingCompleted()) {
            this.currentItem = 0
            this.loadContents()
            if (this.hasItems()) this.focusOn(this.currentItem)
        } else {
            setTimeout(() => {
                this.setupOnceReady()
            }, 300)
        }
    }
}
