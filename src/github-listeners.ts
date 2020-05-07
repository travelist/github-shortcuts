/**
 * Utility methods related to GithubListener
 */
import {GithubListener} from "./github-listener"
import {GithubIssuesListener} from "./github-issues-listener"
import {GithubHomeListener} from "./github-home-listener";
import {GithubCommentListener} from "./github-comment-listener";

/**
 * Instantiate GithubListener
 *
 * @return new instance of github listener, corresponding with current
 * location. Return null if no Github Listener exists for current location.
 */
export const newGithubListener = (): GithubListener | null => {
    switch (currentPage()) {
        case GithubPage.Issue:
        case GithubPage.PullRequest:
            return new GithubCommentListener()
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

enum GithubPage {
    /**
     * https://github.com/:org/:project/issues
     */
    RepositoryIssueList,

    /**
     * https://github.com/issues
     */
    UserIssues,

    /**
     * https://github.com/:org/:project/pulls
     */
    RepositoryPullRequestList,

    /**
     * https://github.com/pulls
     */
    UserPullRequests,

    /**
     * https://github.com/:org/:project/issues/:id
     */
    Issue,
    //
    /**
     * https://github.com/:org/:project/pulls/:id
     */
    PullRequest,

    /**
     * https://github.com/
     */
    Home,
}

const currentPage = (): GithubPage | null => {
    const paths = window.location.pathname.split('/')

    if (paths.length >= 5 && paths[3].endsWith('issues')) return GithubPage.Issue
    if (paths.length >= 5 && paths[3].endsWith('pull')) return GithubPage.PullRequest

    if (paths.length >= 4 && paths[3].endsWith('issues')) return GithubPage.RepositoryIssueList
    if (paths.length >= 2 && paths[1].endsWith('issues')) return GithubPage.UserIssues

    if (paths.length >= 4 && paths[3].endsWith('pulls')) return GithubPage.RepositoryPullRequestList
    if (paths.length >= 2 && paths[1].endsWith('pulls')) return GithubPage.UserPullRequests

    if (paths.length >= 2 && paths[1] == '') return GithubPage.Home

    return null
}
