import { exec } from "child_process"

type BrewPackageOptions = {
    name: string | string[]
    update_homebrew: boolean,
    upgrade_all: boolean
}

export class BrewPackage {
    public opts: BrewPackageOptions
    constructor(opts: BrewPackageOptions) {
        this.opts = opts
    }

    private upgradeAll() {
        console.info("Upgrading all packages")
        exec(`brew upgrade`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error running brew upgrade:
                ${err}
                `)
                return
            }
            if (stderr) {
                console.error(`Running brew upgrade produced stderr:
                ${stderr}
                `)
                return
            }
            console.info(`Successfully upgraded all packages:
            ${stdout}`)
        })
    }

    private updateHomebrew() {
        console.info("Updating homebrew")
        exec(`brew update`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error running brew update: 
                ${err}
                `)
                return
            }
            if (stderr) {
                console.error(`Running brew update produced stderr: 
                ${stderr}
                `)
                return
            }
            console.info(`Successfully updated homebrew:
            ${stdout}`)
        })
    }
    public install() {
        if (this.opts.update_homebrew) {
            this.updateHomebrew()
        }
        if (this.opts.upgrade_all) {
            this.upgradeAll()
        }
        if (Array.isArray(this.opts.name)) {
            this.installMany(this.opts.name)
            return
        }
        this.installOne(this.opts.name)
    }
    private installMany(names: string[]) {
        console.info("Installing many packages")
        for (const name of names) {
            this.installOne(name)
        }
    }

    private installOne(name: string) {
        console.info(`Installing ${name}`)
        exec(`brew install "${name}"`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error running brew install: ${err}`)
                return
            }
            if (stderr) {
                console.error(`Running brew install produced stderr: 
                ${stderr}
                `)
                return
            }
            console.info(`Successfully installed ${name}:
            ${stdout}`)
        })
    }
}
