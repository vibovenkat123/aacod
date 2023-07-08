import {BrewPackageOptions} from "../src/index"
import {BrewPackage} from "../src/index"
const pkgs: Pick<BrewPackageOptions, "name">[] = [
  {
    name: "git",
  },
  {
    name: "node",
  },
];
 
async function main() {
  for (const pkg of pkgs) {
    const brewPkg = new BrewPackage({
      name: pkg.name,
      silent: false,
      cask: false,
      update_homebrew: false,
      upgrade_all: false,
    });
    const res = await brewPkg.safeInstall();
    if (!res.success) {
      console.error(res.error);
    }
  }
}

main()
