import {AbstractGithubItemListListener} from "./abstract-github-item-list-listener";

export class GithubFileDiffListener extends AbstractGithubItemListListener {

    /**
     * HTML Elements of files
     */
    protected items: NodeListOf<HTMLElement>;

    /**
     * CSS selector for the files container
     */
    private static readonly FILE_SECTION_SELECTOR: string = '#files'

    /**
     * CSS selector for a file header
     */
    private static readonly FILE_HEADER_SELECTOR: string = '.file-header'

    private readonly filesSection: HTMLElement

    constructor() {
        super();
        this.filesSection = document
            .querySelector(GithubFileDiffListener.FILE_SECTION_SELECTOR) as HTMLElement
        this.items = this.filesSection.querySelectorAll(GithubFileDiffListener.FILE_HEADER_SELECTOR)
        if (!this.isEmpty()) this.focusOn(this.currentItem)
    }

    handleKeydown(e: KeyboardEvent): void {
        if (this.isInputTagActive()) return
        switch (e.key) {
            case 'j':
                this.j(e)
                break
            case 'k':
                this.k(e)
                break
            case ' ':
                this.space(e)
                break
        }
    }

    private j(e: Event): void {
        this.focusOnNextItem()
    }

    private k(e: Event): void {
        this.focusOnPreviousItem()
    }

    private space(e: Event): void {
        e.preventDefault()
        this.centralizeIfNeeded(this.items[this.currentItem])
        this.toggleFile()
    }

    private toggleFile(): void {
        let toggleButton = this.items[this.currentItem]
            ?.querySelector('button.js-details-target') as HTMLElement
        toggleButton?.click()
    }
}
