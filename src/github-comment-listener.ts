import {GithubListener} from "./github-listener";
import {CommentReaction} from "./comment-reaction";

enum ItemType {
    Comment,
    PostForm
}

export class GithubCommentListener extends GithubListener {

    /**
     * CSS selector for comment container
     */
    private static readonly COMMENT_SELECTOR: string = '.timeline-comment.comment'

    /**
     * CSS selector for new comment form
     */
    private static readonly COMMENT_FORM_SELECTOR_ID: string = 'new_comment_field'

    /**
     * CSS selector for timeline container
     */
    private static readonly TIMELINE_CONTAINER_SELECTOR: string = '#discussion_bucket .js-quote-selection-container'

    private items: NodeListOf<HTMLElement> = document
        .querySelectorAll(GithubCommentListener.COMMENT_SELECTOR)

    private currentItem: number = 0

    private focusedItemType: ItemType

    constructor() {
        super();
        this.focusedItemType = ItemType.Comment
        if (this.hasItem()) this.focusOn(this.currentItem)

        document.querySelector(GithubCommentListener.TIMELINE_CONTAINER_SELECTOR)
            ?.addEventListener('DOMNodeInserted', (e) => this.handleDomNodeInserted(e as MutationEvent));
    }

    public handleKeydown(e: KeyboardEvent): void {
        switch (e.key) {
            case 'j':
                this.j(e)
                break
            case 'k':
                this.k(e)
                break
            case 'n':
                this.n(e)
                break
            case 'e':
                this.e(e)
                break
            case '+':
            case '=':
                this.plus(e)
                break
            case '-':
                this.minus(e)
                break
        }
    }

    private j(e: Event): void {
        if (!this.hasNextItem()) return
        this.focusOut(this.currentItem)
        this.focusOn(++this.currentItem)
    }

    private k(e: Event): void {
        if (!this.hasPrevItem()) return
        this.focusOut(this.currentItem)
        this.focusOn(--this.currentItem)
    }

    private n(e: Event): void {
        e.preventDefault()
        this.focusOnNewCommentForm()
    }

    private e(e: Event): void {
        e.preventDefault()
        this.openEditForm()
    }

    private plus(e: Event): void {
        if (this.focusedItemType != ItemType.Comment) return
        this.toggleReaction(CommentReaction.THUMB_UP)
    }

    private minus(e: Event): void {
        if (this.focusedItemType != ItemType.Comment) return
        this.toggleReaction(CommentReaction.THUMB_DOWN)
    }

    private hasNextItem(): boolean {
        return this.currentItem + 1 < this.items.length
    }

    private hasPrevItem(): boolean {
        return this.currentItem > 0
    }

    private focusOn(index: number) {
        if (index < 0 || index >= this.items.length) return
        this.items[index].classList.add(GithubListener.ACTIVE_LIST_ITEM_CLASS)
        this.centralizeIfNeeded(this.items[index])
        this.focusedItemType = ItemType.Comment
    }

    private focusOut(index: number) {
        if (index < 0 || index >= this.items.length) return
        this.items[index].classList.remove(GithubListener.ACTIVE_LIST_ITEM_CLASS)
    }

    private openEditForm(): void {
        if (this.focusedItemType != ItemType.Comment) return
        let editButton = this.items[this.currentItem]
            .querySelector(`button.js-comment-edit-button`) as HTMLElement
        editButton.click()
    }

    private toggleReaction(reaction: CommentReaction): void {
        let reactionBtn = this.items[this.currentItem]
            .querySelector(`button[data-reaction-label="${reaction.label()}"]`) as HTMLElement
        reactionBtn.click()
    }

    private focusOnNewCommentForm(): void {
        document.getElementById(GithubCommentListener.COMMENT_FORM_SELECTOR_ID)?.focus()
        this.focusedItemType = ItemType.PostForm
    }

    private hasItem(): boolean {
        return this.items.length > 0
    }

    private handleDomNodeInserted(e: MutationEvent): void {
        let target = e.target as HTMLElement
        if (!target.classList?.contains('TimelineItem')) return
        this.reloadItem()
        this.focusOn(this.currentItem)
    }

    private reloadItem(): void {
        this.items = document.querySelectorAll(GithubCommentListener.COMMENT_SELECTOR)
    }
}
