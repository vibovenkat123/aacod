<h1 align="center">AACOD</h1>
<p align="center">
  Write typescript code to automate your environment setup 
</p>

<p align="center">
  Get started by running <code>npm install @vaibhavvenkat/aacod</code>
</p>

<div align="center">

![example workflow](https://github.com/vibovenkat123/aacod/actions/workflows/publish.yml/badge.svg)
![example workflow](https://github.com/vibovenkat123/aacod/actions/workflows/main.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@vaibhavvenkat%2Faacod.svg?)](https://badge.fury.io/js/@vaibhavvenkat%2Faacod)

</div>
<div align="center">
    <a href="https://aacod-docs.vaibhavvenkat.com" rel="noreferrer noopener" target="_blank">
        Docs
    </a>
    <a href="https://vaibhavvenkat.notion.site/eb306b9c04524f288b614da1c92bf483?v=39102172dbda4101a3b968e7c4c0f492&pvs=4">
        Roadmap
    </a>
</div>

## Table of contents

- <a href="#about">About AACOD</a>
  - <a href="#why">Methodology of AACOD</a>
- <a href="#getting-started">Getting started</a>
- <a href="#usage">Usage</a>

<h2 id="about">A(utomation) A(s) COD(e)</h2>

_AACOD_ is a away Automate having the same environment all within typescript.  
Clone git repos, install packages, run scripts, all within a pragmatic way.
It has:

- A way to install homebrew packages
- A way to clone git repos
- A way to run shell scripts
- A way to install npm packages
- A way to run commands in the terminal

```ts
// index.ts
import { BrewPackage } from "@vaibhavvenkat/aacod";

const git = new BrewPackage({
  name: "git",
  silent: false,
  cask: false,
  upgrade_all: false,
  update_homebrew: false,
});

async function main() {
  const res = await git.safeInstall();
  //  ^?    { success: boolean, error: BrewError | null }
  console.log(res); // { success: true, error: null }
}

main();
```

<h3 id="why">Why would you ever need this?</h3>
Imagine you get a new computer, or set up a new server in the cloud.

You want to have the same environment as your old computer, right?

You could write a huge shell script, but that doesn't ensure safety, and has
some limitations, mainly because bash isn't a fully featured language, and you
can't really do much about it.

`AACOD` is an npm package that has a set of helper classes that allow you to
automate the process of setting up your environment. Since it is written in
typescript, you can use all the features of typescript to make your life easier,
Like arrays, objects, classes, functions, special types, etc.

Keep in mind **this is not as fully featured as [Ansible](https://www.ansible.com)**,
the package expects you write your own typescript code **_along_** with the
package. The package _simply provides classes to run commands_.

**Example**

```ts
import { BrewPackage, BrewPackageOptions } from "@vaibhavvenkat/aacod";
// ❌ This is not how it works

async function bad() {
  // we don't have an  `installNames` function
  BrewPackage.installNamesSilently(["git", "node"]); // bad
  // as nice as it seems, this is not the intended use case
}

// ✅ This is how it works
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

main();
```

<h2 id="getting-started">Getting started</h2>

[Package on npmjs](https://www.npmjs.com/package/@vaibhavvenkat/aacod)

To install the package, use your favourite package manager.

**npm**

```bash
npm install @vaibhavvenkat/aacod
```

**yarn**

```bash
yarn add @vaibhavvenkat/aacod
```

**pnpm**

```bash
pnpm add @vaibhavvenkat/aacod
```

<h2 id="usage">Usage</h2>

<a href="https://aacod-docs.vaibhavvenkat.com" rel="noreferrer noopener" target="_blank">
    Docs
</a>

---

By Vaibhav Venkat
