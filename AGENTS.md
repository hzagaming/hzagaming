# Agent Instructions

## Git Commit Identity

All commits in this repository **must** use the following identity:

- **Name:** `Hanazar Ochikawa`
- **Email:** `17358677225@163.com`

The `.git/config` already contains:

```ini
[user]
    name = Hanazar Ochikawa
    email = 17358677225@163.com
```

When creating commits programmatically (e.g., via Ruby/Perl scripts because `git` CLI may be unavailable due to Xcode license), hard-code the same `author` and `committer` fields in the commit object.
