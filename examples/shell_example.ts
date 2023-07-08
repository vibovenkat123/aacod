import {ShellCommand} from "../src/index"
import {ShellCommandOpts} from "../src/index"

const npm_opts: ShellCommandOpts = {
    silent: true,
    command: "test -f .gitignore",
    chdir: "~/projects/foo",
}

async function main() {
    const pkg = new ShellCommand(npm_opts)
    const res = await pkg.safeRun()
    if (!res.success) {
        console.error("No .gitignore file found")
    }
}

main()
