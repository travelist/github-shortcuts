/**
 * Utility methods for GithubListener
 */
import {GithubListener} from "./github-listener"
import {GithubIssuePageListener} from "./github-issue-page-listener"

/**
 * Instantiate GithubListener
 *
 * @return new instance of github listener, corresponding with current
 * location. Return null if no Github Listener exists for current location.
 */
export const newGithubListener = (): GithubListener | null => {
    switch (currentPage()) {
        case GithubPage.RepositoryIssueList:
        case GithubPage.UserIssues:
            return new GithubIssuePageListener()
        // case GithubPage.RepositoryPullRequest:
        //   return new PullRequestPageListener()
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
    UserIssues

    // RepositoryPullRequest
}

const currentPage = (): GithubPage | null => {
    const paths = window.location.pathname.split('/')

    if (paths.length >= 4 && paths[3].endsWith('issues')) return GithubPage.RepositoryIssueList
    if (paths.length >= 2 && paths[1].endsWith('issues')) return GithubPage.UserIssues
    // if (paths.length >= 4 && paths[3].endsWith('pulls')) return GithubPage.RepositoryPullRequest
    return null
}
