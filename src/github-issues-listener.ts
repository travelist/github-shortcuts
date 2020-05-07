import {GithubListener} from './github-listener'
import {getQueryParams, setQueryParams} from "./utils";


/**
 * Event listener for Github issue list component
 */
export class GithubIssuesListener extends GithubListener {

    /**
     * HTML Attribute that contains total page number
     */
    private static readonly TOTAL_PAGE_ATTRIBUTE: string = 'data-total-pages'

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
     * index of currently focused issue
     */
    private currentIssue: number

    constructor() {
        super()
        this.currentIssue = 0
        this.totalPage = parseInt(document
            .querySelector(`[${GithubIssuesListener.TOTAL_PAGE_ATTRIBUTE}]`)
            ?.getAttribute(GithubIssuesListener.TOTAL_PAGE_ATTRIBUTE) || '0')
        this.currentPage = parseInt(getQueryParams()
            .get(GithubIssuesListener.PAGE_QUERY_PARAM) || '1')
    }

    handleKeydown(e: KeyboardEvent): void {
        switch (e.key) {
            case 'ArrowRight':
                this.right(e)
                break
            case 'ArrowLeft':
                this.left(e)
                break
        }
    }

    private right(e: Event): void {
        if (!this.isValidAction()) return
        if (!this.hasNextPage()) return
        let param = new Map<string, string>()
        param.set(GithubIssuesListener.PAGE_QUERY_PARAM, (this.currentPage + 1).toString())
        setQueryParams(param)
    }

    private left(e: Event): void {
        if (!this.isValidAction()) return
        if (!this.hasPrevPage()) return
        let param = new Map<string, string>()
        param.set(GithubIssuesListener.PAGE_QUERY_PARAM, (this.currentPage - 1).toString())
        setQueryParams(param)
    }

    private hasNextPage(): boolean {
        return this.currentPage < this.totalPage
    }

    private hasPrevPage(): boolean {
        return this.currentPage > 1
    }

    private isValidAction(): boolean {
        return !this.isInputTagActive()
    }
}
