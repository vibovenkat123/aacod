import {GitRepo} from "../src/index"
import {GitOpts} from "../src/index"

const git_repo_opt: GitOpts = {
    silent: false,
    bare: false,
    dest: "~/projects/foo",
    repo: "git@github.com:foo/bar.git",
    branch: "baz",
}

async function main() {
    const git_repo = new GitRepo(git_repo_opt)
    const res = await git_repo.safeClone()
    if (!res.success) {
        console.error(res.error)
    }
}

main()
