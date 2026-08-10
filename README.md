# Comersely

Beginner-friendly guide for cloning this repo, keeping services separate, and using Git without breaking `main`.

---

## Table of contents

1. [Clone the repo](#1-clone-the-repo)
2. [Folder structure (service separation)](#2-folder-structure-service-separation)
3. [Run the project locally](#3-run-the-project-locally)
4. [Git basics (read this once)](#4-git-basics-read-this-once)
5. [How to contribute (step by step)](#5-how-to-contribute-step-by-step)
6. [GitHub Pull Requests (beginner deep dive)](#6-github-pull-requests-beginner-deep-dive)
7. [Branch naming](#7-branch-naming)
8. [Best practices](#8-best-practices)
9. [Common mistakes & fixes](#9-common-mistakes--fixes)

---

## 1. Clone the repo

You only do this once on your computer.

```bash
# Replace with your real GitHub URL
git clone https://github.com/YOUR_USERNAME/comersely.git
cd comersely
```

If the project lives inside a subfolder (for example `my-app`), go there:

```bash
cd my-app
```

Install dependencies:

```bash
pnpm install
```

---

## 2. Folder structure (service separation)

Keep **one folder per service**. Do not mix frontend, backend, and shared code in the same place.

### Target layout

```text
comersely/
├── README.md                 # this file
├── apps/                     # user-facing apps
│   ├── web/                  # Next.js frontend
│   └── admin/                # optional admin app
├── services/                 # backend / APIs (one folder each)
│   ├── auth/                 # login, signup, sessions
│   ├── catalog/              # products, categories
│   ├── orders/               # cart, checkout, orders
│   └── payments/             # payment providers
├── packages/                 # shared code used by many services
│   ├── ui/                   # shared buttons, inputs, etc.
│   ├── types/                # shared TypeScript types
│   └── config/               # shared config / constants
└── docs/                     # notes, API docs, decisions
```

### Rules for separation

| Rule | Why |
|------|-----|
| One service = one folder | Easy to find code; less merge conflict |
| Service owns its own API + logic | Auth bugs stay in `services/auth` |
| Shared code goes in `packages/` | Avoid copy-paste between services |
| Never put secrets in the repo | Use `.env` (and keep it in `.gitignore`) |
| Name folders by job, not person | `orders/`, not `uvesh-stuff/` |

### Current repo note

Right now the Next.js app is in `my-app/`. As we grow, move toward the layout above (for example rename `my-app` → `apps/web`).

When you add a new service, create:

```text
services/my-service/
├── README.md          # what this service does + how to run it
├── package.json       # its own dependencies (if needed)
├── src/
│   ├── index.ts
│   ├── routes/
│   └── lib/
└── .env.example       # example env vars (no real secrets)
```

---

## 3. Run the project locally

From the app folder (currently `my-app`):

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
pnpm dev      # start local server
pnpm build    # production build
pnpm lint     # check code style
```

---

## 4. Git basics (read this once)

Think of Git like Google Docs version history, but for code.

| Word | Meaning |
|------|---------|
| `main` | The safe, shared branch. Treat it as production. |
| branch | Your private workspace for one task |
| commit | A saved snapshot of your changes |
| push | Upload your branch to GitHub |
| pull | Download newest changes from GitHub |
| pull request (PR) | Ask to merge your branch into `main` |

**Golden rule:** never work directly on `main`. Always create a branch.

```text
main  --------------------→ (stays clean)
         \
          feature/add-login → your work → PR → merge into main
```

---

## 5. How to contribute (step by step)

Do this every time you start work.

### Step 1 — Update `main`

```bash
git checkout main
git pull origin main
```

### Step 2 — Create your branch

```bash
# example: feature/add-product-card
git checkout -b feature/short-description
```

`-b` means “create and switch to this branch”.

### Step 3 — Make your changes

Edit files. Stay inside the correct service folder.

### Step 4 — Check what changed

```bash
git status
git diff
```

### Step 5 — Stage and commit

```bash
git add .
git commit -m "Add product card to catalog page"
```

Write a short message that explains **why**, not every file name.

Good:

```text
Fix broken checkout button on mobile
```

Bad:

```text
update
fixed stuff
asdf
```

### Step 6 — Push your branch (not `main`)

```bash
git push -u origin feature/short-description
```

- `origin` = GitHub
- `-u` = remember this branch so next time you can just run `git push`

Later pushes on the same branch:

```bash
git push
```

### Step 7 — Open a Pull Request

See the full beginner guide in [section 6](#6-github-pull-requests-beginner-deep-dive).

Short version:

1. Push your branch
2. Open the repo on GitHub
3. Click **Compare & pull request**
4. Fill title + description
5. Ask your teammate to review
6. Merge only after you both agree

### Step 8 — After merge, clean up

```bash
git checkout main
git pull origin main
git branch -d feature/short-description
```

---

## 6. GitHub Pull Requests (beginner deep dive)

### What is a Pull Request?

A **Pull Request (PR)** is a polite request on GitHub that says:

> “Please pull my branch into `main`.”

You do **not** put your work straight into `main`.  
You put it on a branch → open a PR → someone checks it → then it gets merged.

Think of it like this:

```text
Your branch = draft homework
PR         = “Please check my homework”
Merge      = homework accepted into the shared notebook (main)
```

### Why PRs matter (even for 2 people)

- Catches mistakes before they hit `main`
- Shows exactly which files changed
- Gives a place to discuss the change
- Creates history: later you can see *why* something was added
- Stops you from overwriting each other’s work by accident

---

### Words you will see on GitHub

| Word on GitHub | Meaning in plain English |
|----------------|--------------------------|
| **base** | The branch you want to update (almost always `main`) |
| **compare / head** | Your branch with the new work |
| **diff** | The list of lines added/removed |
| **commits** | Each saved snapshot on your branch |
| **review** | Teammate reads the code and leaves feedback |
| **approve** | Teammate says “looks good” |
| **request changes** | Teammate wants fixes before merge |
| **comment** | A note that is not blocking merge |
| **merge** | Put your branch changes into `main` |
| **conflict** | GitHub cannot auto-combine because both sides changed the same lines |
| **draft PR** | Work in progress; not ready to merge yet |
| **ready for review** | Draft is finished; please review |

Picture:

```text
base:    main                 ← where code should go
compare: feature/add-login    ← your work

PR = ask GitHub to copy compare → into base
```

---

### Before you open a PR (checklist)

Do this on your computer first:

```bash
git status                 # should be clean (nothing left uncommitted)
git branch                 # confirm you are NOT on main
git log --oneline -5       # see your recent commits
git push -u origin your-branch-name
```

Checklist:

- [ ] I am on my feature/fix branch (not `main`)
- [ ] All my changes are committed
- [ ] Branch is pushed to GitHub
- [ ] I can explain what this PR does in 1–2 sentences
- [ ] I know how my teammate can test it

---

### How to open a PR on GitHub (click by click)

1. Push your branch (see above).
2. Open the repo page on GitHub in your browser.
3. You will often see a yellow banner: **Compare & pull request** — click it.  
   If you don’t see it:
   - Click the **Pull requests** tab
   - Click the green **New pull request** button
4. Set the branches carefully:
   - **base:** `main`
   - **compare:** `feature/your-branch-name`
5. Check the file list at the bottom. Confirm only the files you meant to change are there.
6. Write a clear **title**.
7. Write a **description** (template below).
8. (Optional) click **Create draft pull request** if you are not finished.
9. Or click **Create pull request** if it is ready for review.
10. On the right side, under **Reviewers**, add your teammate.
11. Tell them in chat/Discord: “PR ready — please review.”

---

### How to write a good PR title

The title should answer: **what did you change?**

Good:

```text
Add login form to auth page
Fix cart total showing NaN
Update README with PR beginner guide
```

Bad:

```text
update
fix
changes
asdf
final final 2
```

Tip: start with a verb — Add / Fix / Update / Remove / Refactor.

---

### PR description template (copy this)

Paste this into the PR body every time:

```md
## What changed
- ...
- ...

## Why
Explain the problem or goal in 1–3 sentences.

## How to test
1. Pull this branch / open the preview
2. Run `pnpm install` then `pnpm dev`
3. Click/do these steps...
4. Expected result: ...

## Screenshots (if UI changed)
- Before:
- After:

## Notes for reviewer
- Any files that are risky
- Anything you are unsure about
```

### Example filled PR

```md
## What changed
- Added a basic login form on the auth page
- Connected email + password inputs

## Why
We need a starting point for user login before building real auth.

## How to test
1. Checkout this branch
2. Run `pnpm dev`
3. Open /login
4. Type any email/password and click Submit
5. Expected: form submits without page crash

## Screenshots (if UI changed)
- After: login form with email + password fields

## Notes for reviewer
- No real backend yet — this is UI only
```

---

### Draft PR vs ready PR

| Type | When to use | Can we merge? |
|------|-------------|----------------|
| **Draft** | Still coding, want early feedback | No (on purpose) |
| **Ready for review** | Done enough for teammate to check | Yes, after review |

Useful habit: open a **Draft PR early**, even with small progress.  
Then your teammate can see direction before you finish everything.

When ready:

1. Open the PR page
2. Click **Ready for review**

---

### What happens after you open a PR

Typical flow for two beginners:

```text
You open PR
   → teammate reviews
      → leaves comments / asks questions
         → you fix things on the SAME branch
            → push again (PR updates automatically)
               → teammate approves
                  → someone clicks Merge
                     → both pull latest main
```

Important: you usually **do not create a new branch** for review fixes.  
Keep using the same branch. Every new `git push` updates the same PR.

```bash
# still on your feature branch
# edit files based on review comments
git add .
git commit -m "Fix review feedback on login validation"
git push
```

The PR page refreshes with the new commit. No need to open a second PR.

---

### How to review your teammate’s PR (also for beginners)

You do not need to be an expert. Check these things:

1. Open the PR → click **Files changed**
2. Read the green (`+`) and red (`-`) lines
3. Ask yourself:
   - Do I understand what this does?
   - Did they edit the correct service folder?
   - Is anything secret committed (`.env`, keys)?
   - Can I follow their “How to test” steps?
4. Leave comments on specific lines if needed:
   - Click the line → **+** comment bubble → write question/suggestion
5. Choose a review result:
   - **Comment** = feedback, not blocking
   - **Approve** = looks good to merge
   - **Request changes** = please fix before merge

Be kind and specific:

Good comment:

```text
Can we move this helper into services/auth/lib so web stays clean?
Also, does empty password show an error?
```

Less helpful:

```text
This is wrong.
```

---

### How to reply to review comments

1. Read each comment
2. Fix the code locally (same branch)
3. Commit + push
4. Reply on the comment: “Fixed in latest commit” or explain why you kept it
5. Ask for another look

Do not take comments personally. Review is normal teamwork.

---

### Merge button — which option?

When the PR is approved, someone clicks **Merge pull request**.  
GitHub may show options:

| Option | Beginner advice |
|--------|------------------|
| **Create a merge commit** | Safe default. Keeps full history. Use this. |
| **Squash and merge** | Turns many commits into one. Also fine for small teams. |
| **Rebase and merge** | Cleaner history, easier to mess up. Skip until you are comfortable. |

For now: use **Create a merge commit** or **Squash and merge**. Pick one style and stick to it as a team.

After merge:

1. GitHub can offer **Delete branch** — yes, delete the remote branch
2. On your computer:

```bash
git checkout main
git pull origin main
git branch -d feature/your-branch-name
```

Now both of you are back on the newest `main`.

---

### Merge conflicts (what they are + what to do)

A conflict means:

> Both branches changed the same part of a file, and GitHub does not know which version to keep.

Example:

- You edited line 10 on your branch
- Your teammate edited line 10 on `main` (through another merged PR)

GitHub will block merge until conflict is fixed.

#### Safe beginner fix

```bash
git checkout main
git pull origin main
git checkout your-branch-name
git merge main
```

Git will mark conflicted files. Open them and look for:

```text
<<<<<<< HEAD
your version
=======
main version
>>>>>>> main
```

1. Edit the file to the correct final code
2. Delete the `<<<<<<<`, `=======`, `>>>>>>>` markers
3. Save
4. Then:

```bash
git add .
git commit -m "Resolve merge conflict with main"
git push
```

Then the PR can merge.

If this feels scary: stop, call your teammate, and fix it together. That is normal.

---

### PR size tips (very important for beginners)

Small PRs are easier to review and safer to merge.

Good PR size:

- One feature, or one bug fix
- Usually under ~300 lines when possible
- Touches one service/area when possible

Too big:

- Login + payments + homepage redesign in one PR
- “I changed many random things”

If your work is big, split it:

1. PR 1: folder structure / empty service
2. PR 2: UI only
3. PR 3: API connection

---

### Two-person PR rules (simple agreement)

Agree on these once:

1. Nobody pushes straight to `main`
2. Every change goes through a PR
3. Other person should look before merge (even a quick look)
4. Author should not merge their own huge risky PR without a second pair of eyes (for tiny docs fixes, either person can merge if you both agree)
5. After merge, both run `git checkout main && git pull`
6. Talk in chat when a PR is ready: don’t assume the other person saw it

---

### Full PR example timeline

Day 1 — you:

```bash
git checkout main
git pull origin main
git checkout -b feature/add-login-form
# write code
git add .
git commit -m "Add login form UI"
git push -u origin feature/add-login-form
# open Draft PR on GitHub
```

Day 2 — you finish + mark ready:

```bash
git add .
git commit -m "Add basic form validation"
git push
# click Ready for review, request teammate
```

Day 2 — teammate:

- Reviews Files changed
- Leaves 2 comments
- Requests changes

Day 2 — you fix:

```bash
git add .
git commit -m "Address review: validate empty password"
git push
```

Day 2 — teammate approves → you or they click Merge → delete branch

Both of you:

```bash
git checkout main
git pull origin main
```

Done.

---

### PR FAQ

**Q: Can I open a PR if the feature is unfinished?**  
A: Yes — use a **Draft PR**.

**Q: Do I need a new PR after review fixes?**  
A: No. Push to the same branch; the same PR updates.

**Q: Who should merge?**  
A: Either person, after review. Many teams let the reviewer merge, or the author merge after approval. Pick one habit.

**Q: What if I pushed to the wrong branch?**  
A: Stop. Tell your teammate. Do not panic-merge. Fix with help before touching `main`.

**Q: What if I accidentally opened PR into the wrong base branch?**  
A: On the PR page you can edit the base branch (pencil icon near the branch names), or close that PR and open a correct one.

**Q: Should every tiny typo need a PR?**  
A: Yes, still use a branch + PR. It keeps `main` history clean and trains the habit.

**Q: Can both of us work on one PR?**  
A: Possible, but confusing for beginners. Prefer one owner per PR. The other person reviews.

---

## 7. Branch naming

Use this format:

```text
type/short-description
```

| Type | Use for |
|------|---------|
| `feature/` | New thing |
| `fix/` | Bug fix |
| `chore/` | Cleanup, config, docs |
| `refactor/` | Same behavior, cleaner code |

Examples:

```text
feature/add-auth-login
fix/cart-total-wrong
chore/update-readme
refactor/split-orders-service
```

Use lowercase and hyphens. One task = one branch.

---

## 8. Best practices

### Do

- Pull `main` before creating a new branch
- Keep branches small (one feature or one fix)
- Commit often with clear messages
- Push your branch and open a PR early (Draft is fine)
- Review each other’s PRs before merging
- Talk if you will both edit the same files

### Don’t

- Don’t commit directly to `main`
- Don’t force push to `main` (`git push --force`)
- Don’t commit `.env`, passwords, or API keys
- Don’t put unrelated changes in one PR
- Don’t edit another person’s branch unless they ask
- Don’t merge a PR you don’t understand — ask first

### Simple team workflow (2 people)

1. Both start from updated `main`
2. Each person works on their own branch
3. Push branch → open PR → other person reviews
4. Merge PR into `main`
5. Other person runs `git checkout main && git pull`

That is the safest beginner process.

---

## 9. Common mistakes & fixes

### “I edited files on `main` by accident”

```bash
git stash
git checkout -b feature/my-fix
git stash pop
```

Then commit and push as usual.

### “Git says my branch is behind `main`”

```bash
git checkout main
git pull origin main
git checkout your-branch-name
git merge main
```

Fix any conflict files, then:

```bash
git add .
git commit -m "Merge main into my branch"
git push
```

### “I want to see which branch I’m on”

```bash
git branch
```

The branch with `*` is your current branch.

### “I want to undo uncommitted file changes”

```bash
# careful: deletes local edits to that file
git checkout -- path/to/file
```

### “Where do I put my new service?”

Create it under `services/service-name/` (or `apps/` if it is a full app), add a small `README.md` inside that folder, and open a PR for only that service when possible.

---

## Quick cheat sheet

```bash
# start work
git checkout main
git pull origin main
git checkout -b feature/my-task

# save work
git add .
git commit -m "Clear message about the change"
git push -u origin feature/my-task

# finish work
# → open PR on GitHub → merge
git checkout main
git pull origin main
```

Welcome — keep branches small, keep services separate, and never fear asking before you push.
```
