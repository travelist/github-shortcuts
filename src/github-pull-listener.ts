import {AbstractGithubListener} from "./abstract-github-listener";
import {GithubCommentListener} from "./github-comment-listener";
import {currentPage, GithubPage} from "./github-page";
import {GithubFileDiffListener} from "./github-file-diff-listener";


export class GithubPullListener extends AbstractGithubListener {

    private cachedCommentListener: GithubCommentListener | null = null

    private cachedFileDiffListener: GithubFileDiffListener | null = null

    constructor() {
        super();
        this.reloadListener()
        this.monitorTab()
    }

    private monitorTab(): void {
        document.querySelector('.tabnav-tabs')
            ?.addEventListener('DOMSubtreeModified', () => {
                setTimeout(() => {
                    this.reloadListener()
                }, 500)
            })
    }

    private reloadListener(): void {
        switch (currentPage()) {
            case GithubPage.Files:
                if (this.cachedFileDiffListener == null) this.cachedFileDiffListener = new GithubFileDiffListener()
                break
            case GithubPage.PullRequest:
                if (this.cachedCommentListener == null) this.cachedCommentListener = new GithubCommentListener()
                break
        }
    }

    handleKeydown(e: KeyboardEvent): void {
        switch (currentPage()) {
            case GithubPage.Files:
                return this.cachedFileDiffListener?.handleKeydown(e)
            case GithubPage.PullRequest:
                return this.cachedCommentListener?.handleKeydown(e)
        }
    }
}
