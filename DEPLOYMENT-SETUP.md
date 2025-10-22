# GitHub Pages Deployment Setup Guide

This guide will help you set up automated GitHub Pages deployments for your repository.

## 🎯 What You Get

✅ **Automatic production deployments** when you push to `main`
✅ **PR preview deployments** at unique URLs for every pull request
✅ **Automatic PR comments** with preview links
✅ **Automatic cleanup** when PRs are closed
✅ **Multiple pages support** (index.html and page-2.html)

---

## 📋 Setup Steps

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/themarkness/margy-game
2. Click **Settings** (top navigation)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source:** Select **"Deploy from a branch"**
   - **Branch:** Select **"gh-pages"** and **"/ (root)"**
5. Click **Save**

### Step 2: Configure Workflow Permissions

1. In **Settings** → **Actions** → **General**
2. Scroll to "Workflow permissions"
3. Select **"Read and write permissions"**
4. ✅ Check **"Allow GitHub Actions to create and approve pull requests"**
5. Click **Save**

### Step 3: Trigger First Deployment

**Option A: Push to main** (recommended)
```bash
# Merge your PR to main, or push directly to main
git checkout main
git pull
git push
```

**Option B: Test with current PR**
- The workflows are already configured in your PR
- When you create/update PRs, they'll automatically deploy
- Check the "Actions" tab to see the workflow running

### Step 4: Verify Deployment

1. Go to **Actions** tab in your repository
2. You should see "Deploy Preview" workflow running
3. Wait for it to complete (usually 1-2 minutes)
4. Check the "Pages" section in Settings to see the deployed URL

---

## 🔗 Your URLs

Once deployed, your sites will be available at:

### Production (main branch)
- **Main game:** https://themarkness.github.io/margy-game/
- **Game 2:** https://themarkness.github.io/margy-game/page-2.html

### PR Previews
- **PR #123:** https://themarkness.github.io/margy-game/pr-123/
- **PR #456:** https://themarkness.github.io/margy-game/pr-456/

---

## 🚀 Using PR Previews

### Creating a Preview

1. **Create a new branch**
   ```bash
   git checkout -b feature/my-new-feature
   # Make your changes
   git add .
   git commit -m "Add new feature"
   git push -u origin feature/my-new-feature
   ```

2. **Open a pull request** on GitHub

3. **Wait for deployment** (~1-2 minutes)
   - Check the "Actions" tab to see progress
   - The workflow will comment on your PR with the preview URL

4. **Test your changes** at the preview URL

5. **Update the PR** with new commits
   - Push more commits to your branch
   - The preview will update automatically
   - The PR comment will be updated

### Cleaning Up

- When you close or merge the PR, the preview is automatically removed
- The cleanup workflow runs and removes the `/pr-{number}/` directory

---

## 📁 Workflow Files

The following workflows have been added to `.github/workflows/`:

### `deploy-preview.yml` ✅ ENABLED
- **Triggers:** Push to main, PR opened/updated
- **What it does:**
  - Builds the project with Vite
  - Runs ESLint
  - Deploys to GitHub Pages
  - Comments on PRs with preview URLs
- **Recommendation:** Keep this enabled (it's simpler and works great)

### `cleanup-preview.yml` ✅ ENABLED
- **Triggers:** PR closed
- **What it does:**
  - Removes the PR preview directory
  - Comments on PR confirming cleanup

### `deploy-pages.yml` ⚠️ DISABLED
- **Alternative workflow** using GitHub's native deploy-pages action
- **Status:** Disabled by default (triggers on non-existent branch)
- **When to use:** If you need advanced deployment features
- **How to enable:** See `.github/workflows/README.md`

---

## ⚙️ Configuration

### Vite Base Path

The `vite.config.js` has been configured to support base paths:

```javascript
base: process.env.BASE_PATH || '/'
```

This allows the build to work correctly in subdirectories (PR previews).

### Building Locally with Base Path

Test PR preview builds locally:

```bash
# Build as if it's PR #123
BASE_PATH=/pr-123/ npm run build
npm run preview

# Build for production (root path)
npm run build
npm run preview
```

### Customizing Workflows

Edit the workflow files in `.github/workflows/` to customize:
- Add tests before deployment
- Change build commands
- Modify PR comment format
- Add deployment notifications

See `.github/workflows/README.md` for detailed instructions.

---

## 🐛 Troubleshooting

### Workflows not running?

**Check workflow permissions:**
1. Settings → Actions → General
2. Ensure "Read and write permissions" is selected
3. Enable "Allow GitHub Actions to create and approve pull requests"

**Check workflow files:**
- Workflows should be in `.github/workflows/`
- Files should have `.yml` extension
- Check the "Actions" tab for any error messages

### GitHub Pages not deploying?

**Check Pages settings:**
1. Settings → Pages
2. Source should be "Deploy from a branch"
3. Branch should be "gh-pages" / (root)
4. Wait a few minutes after first push

**Check if gh-pages branch exists:**
```bash
git fetch origin
git branch -r | grep gh-pages
```

If it doesn't exist, the first deployment will create it.

### Preview URLs not working?

**Check base path configuration:**
- Verify `vite.config.js` has `base: process.env.BASE_PATH || '/'`
- Check workflow sets `BASE_PATH` environment variable
- Rebuild and redeploy

**Check directory structure:**
- The gh-pages branch should have `/pr-{number}/` directories
- Each directory should contain a complete build

**Check GitHub Pages URL:**
- Verify the base URL: https://themarkness.github.io/margy-game/
- PR previews append the path: https://themarkness.github.io/margy-game/pr-123/

### Assets not loading in preview?

This usually means the base path is incorrect:
1. Check the HTML source in the browser
2. Look at asset paths (should be `/pr-{number}/assets/...`)
3. Verify `BASE_PATH` is set in the workflow
4. Rebuild with correct base path

---

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
- [Vite Base Path Configuration](https://vitejs.dev/config/shared-options.html#base)
- [Workflow README](.github/workflows/README.md)

---

## ✅ Next Steps

1. ✅ Complete the setup steps above
2. ✅ Merge this PR to main to enable deployments
3. ✅ Create a test PR to verify preview deployments work
4. ✅ Share preview URLs with your team for review
5. ✅ Enjoy automated deployments! 🎉

---

**Need help?** Check the [workflow documentation](.github/workflows/README.md) or open an issue.
