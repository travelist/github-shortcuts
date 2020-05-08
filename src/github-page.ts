/**
 * Github pages
 */
export enum GithubPage {
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
     * https://github.com/:org/:project/pull/:id
     */
    PullRequest,

    /**
     * https://github.com/
     */
    Home,

    /**
     * https://github.com/:org/:project/pulls/:id/files
     */
    Files
}

/**
 * @return current page identifier
 */
export const currentPage = (): GithubPage | null => {
    const paths = window.location.pathname.split('/')

    // This must be located higher than GithubPage.PullRequest check.
    // Otherwise the page is treated as a pull request comment page
    if (paths.length >= 1 && paths[paths.length - 1].endsWith('files')) return GithubPage.Files
    if (paths.length >= 4 && paths[3].endsWith('compare')) return GithubPage.Files

    if (paths.length >= 5 && paths[3].endsWith('issues')) return GithubPage.Issue
    if (paths.length >= 5 && paths[3].endsWith('pull')) return GithubPage.PullRequest

    if (paths.length >= 4 && paths[3].endsWith('issues')) return GithubPage.RepositoryIssueList
    if (paths.length >= 2 && paths[1].endsWith('issues')) return GithubPage.UserIssues

    if (paths.length >= 4 && paths[3].endsWith('pulls')) return GithubPage.RepositoryPullRequestList
    if (paths.length >= 2 && paths[1].endsWith('pulls')) return GithubPage.UserPullRequests

    if (paths.length >= 2 && paths[1] == '') return GithubPage.Home

    return null
}
