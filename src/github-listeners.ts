/**
 * Utility methods related to AbstractGithubListener
 */
import {AbstractGithubListener} from "./abstract-github-listener"
import {GithubIssuesListener} from "./github-issues-listener"
import {GithubHomeListener} from "./github-home-listener";
import {GithubCommentListener} from "./github-comment-listener";
import {GithubFileDiffListener} from "./github-file-diff-listener";
import {currentPage, GithubPage} from "./github-page";
import {GithubPullListener} from "./github-pull-listener";

/**
 * Instantiate AbstractGithubListener
 *
 * @return new instance of github listener, corresponding with current
 * location. Return null if no Github Listener exists for current location.
 */
export const newGithubListener = (): AbstractGithubListener | null => {
    switch (currentPage()) {
        case GithubPage.Issue:
            return new GithubCommentListener()
        case GithubPage.PullRequest:
        case GithubPage.Files:
            return new GithubPullListener()
        case GithubPage.RepositoryIssueList:
        case GithubPage.UserIssues:
        /**
         * It turned out the structure of the pull request list is essentially the
         * same as the issue list
         */
        case GithubPage.RepositoryPullRequestList:
        case GithubPage.UserPullRequests:
            return new GithubIssuesListener()
        case GithubPage.Home:
            return new GithubHomeListener()
    }

    return null
}

/**
 * @return true if Github listener that supports for the current location
 * exists; otherwise false
 */
export const isSupportedPage = (): boolean => {
    return currentPage() != null
}

