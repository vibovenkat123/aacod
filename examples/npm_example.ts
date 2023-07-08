import {NpmPackage} from "../src/index"
import {NpmPkgOpts} from "../src/index"

const npm_opts: NpmPkgOpts= {
    silent: false,
    name: "left-pad",
    global: false,
    path: "~/projects/foo",
}

async function main() {
    const pkg = new NpmPackage(npm_opts)
    const res = await pkg.safeInstall()
    if (!res.success) {
        console.error(res.error)
        return
    }
    console.log("The most useless package ever installed!")
}

main()
