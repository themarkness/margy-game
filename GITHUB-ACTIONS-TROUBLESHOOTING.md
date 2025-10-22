# GitHub Actions Deployment Troubleshooting

## Current Error: 403 Permission Denied

### Error Message
```
remote: Permission to themarkness/margy-game.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/themarkness/margy-game/': The requested URL returned error: 403
Error: Process completed with exit code 128.
```

### Root Cause
The `GITHUB_TOKEN` doesn't have permission to push to the repository.

---

## ✅ Required Settings

### 1. Workflow Permissions (CRITICAL)

Go to: **Settings → Actions → General → Workflow permissions**

**Required configuration:**
- ✅ Select **"Read and write permissions"**
- ✅ Check **"Allow GitHub Actions to create and approve pull requests"**

**Current issue:** These might not be set correctly.

### 2. GitHub Pages Settings

Go to: **Settings → Pages**

**Configuration:**
- **Source:** Deploy from a branch
- **Branch:** gh-pages / (root)

**Note:** The gh-pages branch will be created automatically by the workflow.

### 3. Branch Protection Rules

Go to: **Settings → Branches**

**Check if gh-pages is protected:**
- If there are branch protection rules on `gh-pages`, the workflow cannot push
- **Solution:** Either:
  - Remove protection from `gh-pages` branch
  - OR add `github-actions[bot]` to the list of allowed users

---

## 🔍 Verification Steps

### Step 1: Check Workflow Permissions
```bash
# Visit this URL (replace with your repo):
https://github.com/themarkness/margy-game/settings/actions
```

Ensure:
1. Workflow permissions = "Read and write permissions"
2. "Allow GitHub Actions to create and approve pull requests" is checked

### Step 2: Check Branch Protection
```bash
# Visit this URL:
https://github.com/themarkness/margy-game/settings/branches
```

If `gh-pages` is listed:
- Click "Edit" on the protection rule
- Either disable protection OR
- Add `github-actions[bot]` to bypass list

### Step 3: Verify Repository Settings
```bash
# Visit this URL:
https://github.com/themarkness/margy-game/settings
```

Under "General":
- Ensure the repository is not archived
- Ensure Actions are enabled

---

## 🛠️ Alternative Solution: Personal Access Token

If workflow permissions don't work, you can use a Personal Access Token:

### Create PAT
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: `GITHUB_PAGES_DEPLOY`
4. Scopes: Check `repo` (full control)
5. Click "Generate token"
6. Copy the token

### Add Secret
1. Go to: https://github.com/themarkness/margy-game/settings/secrets/actions
2. Click "New repository secret"
3. Name: `GH_PAGES_DEPLOY`
4. Value: Paste your token
5. Click "Add secret"

### Update Workflow
Change the workflow to use the PAT instead of GITHUB_TOKEN:

```yaml
- name: Deploy PR Preview
  uses: peaceiris/actions-gh-pages@v3
  with:
    personal_token: ${{ secrets.GH_PAGES_DEPLOY }}  # Changed from github_token
    publish_dir: ./dist
    destination_dir: pr-${{ github.event.pull_request.number }}
    keep_files: true
```

---

## 📋 Quick Fix Checklist

Try these in order:

1. ✅ **Check workflow permissions**
   - Settings → Actions → General
   - Select "Read and write permissions"
   - Enable "Allow GitHub Actions to create and approve pull requests"

2. ✅ **Remove branch protection on gh-pages**
   - Settings → Branches
   - If `gh-pages` has protection, remove it or bypass for actions

3. ✅ **Retry the workflow**
   - Go to Actions tab
   - Click on failed workflow
   - Click "Re-run all jobs"

4. ✅ **If still failing, use PAT**
   - Follow "Alternative Solution" above

---

## 🎯 Expected Behavior

Once permissions are fixed:

1. Workflow runs
2. Builds the site
3. Creates/updates `gh-pages` branch
4. Pushes to `pr-{number}` subdirectory
5. Comments on PR with preview URL

---

## 📞 Need Help?

If you're still stuck:
1. Check the full workflow log for more details
2. Verify all settings above are correct
3. Try the PAT solution as a fallback
