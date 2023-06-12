<h1>Contributing Guidelines</h1>

<h2>Table of Contents</h2>

- [Code Styles](#code-styles)
- [Commit Message Guidelines](#commit-message-guidelines)
  - [Commit Message Format](#commit-message-format)
  - [Type](#type)
  - [Scope](#scope)
  - [Subject](#subject)
  - [Body](#body)
  - [Footer](#footer)
  - [Commit Message Example](#commit-message-example)
- [Submitting an Issue](#submitting-an-issue)
- [Submitting a Pull Request](#submitting-a-pull-request)

---

## Code Styles

To ensure consistency throughout the source code, keep these rules in mind as you are working:

- All features or bug fixes must be tested by one or more specs (unit-tests).
- We follow [Google's JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html), but wrap all code at 100 characters. An automated formatter is available (`npm run format`).

## Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more readable messages** that are easy to follow when looking through the **project history**. But also, we use the git commit messages to **generate the project change log**.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer than 100 characters! This allows the message to be easier to read on GitHub as well as in various git tools.

### Type

The commit type must be one of the following:

- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation only changes.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- `refactor`: A code change that neither fixes a bug nor adds a feature. For example, renaming a variable, moving a function, etc.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `build`: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm).
- `ci`: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs).
- `chore`: Other changes that don't modify src or test files. For example, updating build tasks, package manager configs, etc.
- `revert`: Reverts a previous commit.

### Scope

The scope could be anything specifying place of the commit change.

The following is the list of supported scopes:

- `docs`: for changes made on `docs` directory.
- `test`: for changes made on `test` directory.
- `common/[sub-scope]`: for changes made on `src/common` directory. Replace `sub-scope` with available sub-directory in `common`, like 'decorator', 'helper', etc. For example: `common/decorator`.
- `province`: for changes made on `src/province` directory.
- `regency`: for changes made on `src/regency` directory.
- `district`: for changes made on `src/district` directory.
- `village`: for changes made on `src/village` directory.
- `island`: for changes made on `src/island` file.

If your change affect more than one package, separate the scopes with a comma (e.g. `test,province`).

### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes".
- don't capitalize first letter.
- no dot (.) at the end.

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to **reference GitHub issues** that this commit **Closes**.

### Commit Message Example

```
feat(province): add new province endpoint

Add `/provinces/new` endpoint to create new province.

Closes #123
```

## Submitting an Issue

Before you submit an issue, please search the issue tracker, maybe an issue for your problem already exists and the discussion might inform you of workarounds readily available.

You can report the issues by filling out the [new issue form](https://github.com/fityannugroho/idn-area/issues/new/choose). Please select the right form template:
- **Bug Report**: if you found a bug in the source code.
- **Feature Request**: if you want a new feature or enhancement.

## Submitting a Pull Request

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub Pull Requests](https://github.com/fityannugroho/idn-area/pulls) for an open or closed PR that relates to your submission. You don't want to duplicate effort.

1. Fork this repository.

1. Make your changes in a new git branch:

    ```shell
    git checkout -b my-fix-branch master
    ```

1. Follow the [installation guides](docs/installation.md).

1. Create your patch, **including appropriate test cases**.

1. Make sure you follow our [Code Styles](#code-styles) and [Commit Message Guidelines](#commit-message-guidelines).

1. Run the [full test suite](docs/installation.md#run-the-test) and ensure that all tests pass.

1. Commit your changes using a descriptive commit message that follows our [commit message conventions](#commit-message-guidelines). Adherence to these conventions is necessary because release notes are automatically generated from these messages.

1. Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

1. In GitHub, send a pull request to `idn-area:main`.

1. If we suggest changes then:

  - Make the required updates.
  - Re-run the [full test suite](docs/installation.md#run-the-test) to ensure tests are still passing.
  - Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase master -i
    git push -f
    ```

That's it! Thank you for your contribution!
