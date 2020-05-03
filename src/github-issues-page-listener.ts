import {GithubListener} from './github-listener'
import {getQueryParams, setQueryParams} from "./utils";


/**
 * Event listener for Github issue list component
 */
export class GithubIssuesPageListener extends GithubListener {

    /**
     * HTML Attribute that contains total page number
     */
    private static readonly TOTAL_PAGE_ATTRIBUTE: string = 'data-total-pages'

    /**
     * CSS Selector for retrieving issue items
     */
    private static readonly ISSUE_LIST_SELECTOR: string = 'div[id^=issue_]'

    /**
     * Query parameter that indicates the current page
     */
    private static readonly PAGE_QUERY_PARAM: string = 'page'

    /**
     * total issue pages
     */
    private readonly totalPage: number

    /**
     * current page
     */
    private readonly currentPage: number

    /**
     * total number of issues in the current page
     */
    private readonly totalIssue: number

    /**
     * index of currently focused issue
     */
    private currentIssue: number

    /**
     * HTML Elements of issue items
     */
    private issues: NodeListOf<HTMLElement>

    constructor() {
        super()
        this.currentIssue = 0
        this.issues = document
            .querySelectorAll(`${GithubIssuesPageListener.ISSUE_LIST_SELECTOR}`)
        this.totalIssue = this.issues.length
        this.totalPage = parseInt(document
            .querySelector(`[${GithubIssuesPageListener.TOTAL_PAGE_ATTRIBUTE}]`)
            ?.getAttribute(GithubIssuesPageListener.TOTAL_PAGE_ATTRIBUTE) || '0')
        this.currentPage = parseInt(getQueryParams()
            .get(GithubIssuesPageListener.PAGE_QUERY_PARAM) || '1')
        if (this.hasIssues()) this.focusOn(this.currentIssue)
    }

    handleKeydown(e: KeyboardEvent): void {
        switch (e.key) {
            case 'ArrowUp':
                this.up(e)
                break
            case 'ArrowRight': // TODO To be removed
                this.right(e)
                break
            case 'ArrowDown': // TODO To be removed
                this.down(e)
                break
            case 'ArrowLeft':
                this.left(e)
                break
            case 'Enter':
                this.enter(e)
                break
        }
    }

    private up(e: Event): void {
        if (!this.isValidAction()) return
        e.preventDefault()
        if (!this.hasPrevIssue()) return
        this.focusOut(this.currentIssue)
        this.focusOn(--this.currentIssue)
    }

    private down(e: Event): void {
        if (!this.isValidAction()) return
        e.preventDefault()
        if (!this.hasNextIssue()) return
        this.focusOut(this.currentIssue)
        this.focusOn(++this.currentIssue)
    }

    private right(e: Event): void {
        if (!this.isValidAction()) return
        if (!this.hasNextPage()) return
        let param = new Map<string, string>()
        param.set(GithubIssuesPageListener.PAGE_QUERY_PARAM, (this.currentPage + 1).toString())
        setQueryParams(param)
    }

    private left(e: Event): void {
        if (!this.isValidAction()) return
        if (!this.hasPrevPage()) return
        let param = new Map<string, string>()
        param.set(GithubIssuesPageListener.PAGE_QUERY_PARAM, (this.currentPage - 1).toString())
        setQueryParams(param)
    }

    private enter(e: Event): void {
        if (!this.isValidAction()) return
        location.href = this.getCurrentIssueLink()
    }

    private hasNextPage(): boolean {
        return this.currentPage < this.totalPage
    }

    private hasPrevPage(): boolean {
        return this.currentPage > 1
    }

    private hasNextIssue(): boolean {
        return this.currentIssue + 1 < this.totalIssue
    }

    private hasPrevIssue(): boolean {
        return this.currentIssue > 0
    }

    private focusOn(issueIndex: number) {
        if (issueIndex < 0 || issueIndex > this.totalIssue) return
        this.issues[issueIndex].classList.add(GithubListener.ACTIVE_LIST_ITEM_CLASS)
        this.centralizeIfNeeded(this.issues[issueIndex])
    }

    private focusOut(issueIndex: number) {
        if (issueIndex < 0 || issueIndex > this.totalIssue) return
        this.issues[issueIndex].classList.remove(GithubListener.ACTIVE_LIST_ITEM_CLASS)
    }

    private getCurrentIssueLink(): string {
        let issueATagId = `a[id=${this.issues[this.currentIssue].id}_link]`
        let aTag = document.querySelector(issueATagId)
        return aTag?.getAttribute('href') || ''
    }

    private hasIssues(): boolean {
        return this.issues instanceof NodeList && this.issues.length > 0
    }

    private isValidAction(): boolean {
        return !this.isInputTagActive()
    }
}
