# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated building, testing, and deployment.

## Workflows

### 1. `deploy-preview.yml` (RECOMMENDED - ENABLED)

**Simple and reliable workflow for deploying to GitHub Pages**

- ✅ **Enabled by default**
- Uses `peaceiris/actions-gh-pages@v4` action
- Simpler setup and maintenance
- Works out of the box

**Triggers:**
- Push to `main` branch → Deploys to root of GitHub Pages
- Pull requests → Deploys to `/pr-{number}/` subdirectory

**Features:**
- Builds with Vite
- Runs ESLint
- Deploys main branch to `https://[username].github.io/[repo]/`
- Deploys PR previews to `https://[username].github.io/[repo]/pr-[number]/`
- Comments on PRs with preview URLs
- Preserves other deployments (doesn't overwrite main when deploying PR)

---

### 2. `deploy-pages.yml` (ALTERNATIVE - DISABLED)

**Advanced workflow using GitHub's native deploy-pages action**

- ❌ **Disabled by default** (rename to `.deploy-pages.yml.disabled` or delete)
- Uses GitHub's official `actions/deploy-pages@v4`
- More complex but offers advanced features
- Requires GitHub Pages to be configured with "GitHub Actions" source

**Only use this if:**
- You need advanced deployment features
- You prefer GitHub's native actions
- You're comfortable with more complex workflows

**Note:** Don't run both workflows simultaneously - choose one!

---

### 3. `cleanup-preview.yml`

**Cleans up PR preview deployments when PRs are closed**

- ✅ **Always enabled**
- Works with both deploy workflows
- Removes `/pr-{number}/` directories from gh-pages branch
- Comments on PRs when cleanup is complete

---

## Setup Instructions

### Step 1: Enable GitHub Pages

1. Go to your repository **Settings** → **Pages**
2. Under "Build and deployment":
   - **Source:** Select "GitHub Actions" (for deploy-pages.yml) OR "Deploy from a branch" (for deploy-preview.yml)
   - **Branch:** Select `gh-pages` (if using deploy-preview.yml)
3. Click **Save**

### Step 2: First Deployment

**Option A: From main branch** (recommended)
```bash
git checkout main
git push origin main
# Wait for workflow to complete
# Visit https://[username].github.io/[repo]/
```

**Option B: From a PR** (for testing)
1. Create and push a PR
2. Wait for the workflow to complete
3. Check the PR comments for the preview URL

### Step 3: Test PR Previews

1. Create a new branch and make changes
2. Open a pull request
3. The workflow will automatically:
   - Build your changes
   - Deploy to `/pr-{number}/`
   - Comment on the PR with the preview URL
4. When you close/merge the PR, cleanup workflow removes the preview

---

## Configuration

### Changing the Base Path

The base path is set via environment variable in the workflow:

```yaml
- name: Build for PR preview
  run: |
    export BASE_PATH=/pr-${{ github.event.pull_request.number }}/
    npm run build
```

### Customizing the Build

Edit the workflows to add more steps:

```yaml
- name: Run tests
  run: npm test

- name: Run type check
  run: npm run type-check
```

### Disabling Linting

Remove or comment out this step:

```yaml
- name: Run linter
  run: npm run lint
```

---

## Troubleshooting

### GitHub Pages not working?

**Check permissions:**
1. Repository Settings → Actions → General
2. Workflow permissions: Select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"

**Check source:**
- Settings → Pages → Source should be "GitHub Actions" or "gh-pages branch"

### PR preview not deploying?

1. Check the Actions tab for error messages
2. Ensure `gh-pages` branch exists (created automatically on first deployment)
3. Verify the workflow has write permissions for `contents` and `pull-requests`

### Base path issues?

If assets aren't loading in PR previews:
1. Check `vite.config.js` has `base: process.env.BASE_PATH || '/'`
2. Verify the `BASE_PATH` environment variable is set in the workflow
3. Use relative paths in your code, not absolute paths

### Cleanup not working?

1. Ensure `cleanup-preview.yml` workflow has `contents: write` permission
2. Check if `gh-pages` branch has the PR directory
3. Look at the workflow logs in the Actions tab

---

## Workflow Status Badges

Add these badges to your README to show build status:

```markdown
[![Deploy Preview](https://github.com/themarkness/margy-game/actions/workflows/deploy-preview.yml/badge.svg)](https://github.com/themarkness/margy-game/actions/workflows/deploy-preview.yml)
```

---

## Advanced: Choosing a Different Workflow

### To use `deploy-pages.yml` instead:

1. Rename `deploy-preview.yml` to `deploy-preview.yml.disabled`
2. Rename `deploy-pages.yml.disabled` to `deploy-pages.yml` (if renamed)
3. Go to Settings → Pages → Source → Select "GitHub Actions"
4. Push to trigger the workflow

### To disable all deployments:

Rename the workflow files to add `.disabled` extension:
- `deploy-preview.yml` → `deploy-preview.yml.disabled`
- `deploy-pages.yml` → `deploy-pages.yml.disabled`

---

## Local Testing

Test your build locally before pushing:

```bash
# Test production build
npm run build
npm run preview

# Test with base path (simulating PR preview)
BASE_PATH=/pr-123/ npm run build
npm run preview
```

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
- [Vite Base Path Configuration](https://vitejs.dev/config/shared-options.html#base)
