import {GithubListener} from './github-listener'
import {getQueryParams, setQueryParams} from "./utils";


/**
 * Event listener for Github issue list component
 */
export class GithubIssuePageListener implements GithubListener {

    /**
     * HTML Attribute that contains total page number
     */
    private static TOTAL_PAGE_ATTRIBUTE: string = 'data-total-pages'

    /**
     * CSS Selector for retrieving issue items
     */
    private static ISSUE_LIST_SELECTOR: string = 'div[id^=issue_]'

    /**
     * Query parameter that indicates the current page
     */
    private static PAGE_QUERY_PARAM: string = 'page'

    /**
     * Class name for active issue item
     */
    private static ACTIVE_ISSUE_CLASS: string = 'github-shortcuts-active'

    /**
     * Margin to detect the necessity of scrolling
     */
    private static SCROLL_CHECK_MARGIN_PX: number = 50

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
        this.currentIssue = 0
        this.issues = document
            .querySelectorAll(`${GithubIssuePageListener.ISSUE_LIST_SELECTOR}`)
        this.totalIssue = this.issues.length
        this.totalPage = parseInt(document
            .querySelector(`[${GithubIssuePageListener.TOTAL_PAGE_ATTRIBUTE}]`)
            ?.getAttribute(GithubIssuePageListener.TOTAL_PAGE_ATTRIBUTE) || '0')
        this.currentPage = parseInt(getQueryParams()
            .get(GithubIssuePageListener.PAGE_QUERY_PARAM) || '1')
        this.focusOn(this.currentIssue)
    }

    public up(e: Event): void {
        e.preventDefault()
        if (!this.hasPrevIssue()) return
        this.focusOut(this.currentIssue)
        this.focusOn(--this.currentIssue)
    }

    public down(e: Event): void {
        e.preventDefault()
        if (!this.hasNextIssue()) return
        this.focusOut(this.currentIssue)
        this.focusOn(++this.currentIssue)
    }

    public right(e: Event): void {
        if (!this.hasNextPage()) return
        let param = new Map<string, string>()
        param.set(GithubIssuePageListener.PAGE_QUERY_PARAM, (this.currentPage + 1).toString())
        setQueryParams(param)
    }

    public left(e: Event): void {
        if (!this.hasPrevPage()) return
        let param = new Map<string, string>()
        param.set(GithubIssuePageListener.PAGE_QUERY_PARAM, (this.currentPage - 1).toString())
        setQueryParams(param)
    }

    public enter(e: Event): void {
        let issueId = this.issues[this.currentIssue].id.split('_')[1]
        let paths = location.pathname.split('/')
        let pathname: string = ''
        for (let i = 1; i < 3; i++) pathname += `/${paths[i]}`
        pathname += `/issues/${issueId}`
        location.href = pathname
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

    private centralizeIfNeeded(issueIndex: number) {
        if (issueIndex < 0 || issueIndex > this.totalIssue) return
        let height = window.innerHeight
        let y: number = this.issues[issueIndex].getBoundingClientRect().y

        if (y < GithubIssuePageListener.SCROLL_CHECK_MARGIN_PX) {
            this.issues[issueIndex].scrollIntoView({block: 'center'})
            return;
        }

        if (y > height - GithubIssuePageListener.SCROLL_CHECK_MARGIN_PX) {
            this.issues[issueIndex].scrollIntoView({block: 'center'})
            return;
        }
    }

    private focusOn(issueIndex: number) {
        if (issueIndex < 0 || issueIndex > this.totalIssue) return
        this.issues[issueIndex].classList.add(GithubIssuePageListener.ACTIVE_ISSUE_CLASS)

        this.centralizeIfNeeded(issueIndex)
    }

    private focusOut(issueIndex: number) {
        if (issueIndex < 0 || issueIndex > this.totalIssue) return
        this.issues[issueIndex].classList.remove(GithubIssuePageListener.ACTIVE_ISSUE_CLASS)
    }
}
