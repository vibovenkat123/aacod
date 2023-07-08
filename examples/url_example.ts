import {Url} from "../src/index"
import {UrlOpts} from "../src/index"

const url_opts: UrlOpts= {
    silent: true,
    url: "https://foo.bar/baz",
    dest: "~/projects/foo",
}

async function main() {
    const url = new Url(url_opts)
    const res = await url.safeGet()
    if (!res.success) {
        console.error(res.error)
    }
}

main()
