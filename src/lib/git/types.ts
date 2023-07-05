type RepoUrl = `git@${string}:${string}/${string}.git`
class Repo {
  private repo: RepoUrl
  constructor(repo: RepoUrl) {
    this.repo = repo
  }
  private pull() {
    // TODO: pull
  }
}
