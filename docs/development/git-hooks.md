# Git Hooks

This project includes git hooks to maintain code quality and dependency consistency throughout the development lifecycle.

## Available Hooks

### Pre-Push Hook

**Location**: `.githooks/pre-push`

**Purpose**: Validates frozen lockfile consistency before pushing changes to prevent dependency-related issues in CI/CD and production.

**What it validates:**

1. **Lockfile Existence**: Ensures `pnpm-lock.yaml` exists
2. **Frozen Lockfile Consistency**: Runs `pnpm install --frozen-lockfile` to verify that the lockfile is consistent with all `package.json` files
3. **Uncommitted Changes**: Checks for uncommitted changes to `package.json` files
4. **Lockfile Freshness**: Ensures the lockfile is newer than any `package.json` files
5. **Lockfile Format**: Validates that the lockfile format is correct and not corrupted

**When it runs:**

- Before every `git push` operation
- Only performs full validation when pushing to `main` or `master` branches
- Always checks for basic consistency regardless of branch

**Example output:**

```bash
🔒 Validating frozen lockfile...
✓ Current branch: feature/new-feature
✓ No lockfile changes detected
✓ Checking lockfile freshness...
✓ Validating lockfile format...
✓ All frozen lockfile validations passed! 🎉
✓ Push proceeding...
```

## Setup

### Automatic Setup (Recommended)

Run the setup script to configure hooks for your local repository:

```bash
./scripts/setup-hooks.sh
```

This script will:

- Configure git to use the `.githooks` directory
- Make all hooks executable
- Display available hooks and their purposes

### Manual Setup

If you prefer to set up manually:

```bash
# Configure git hooks path
git config core.hooksPath .githooks

# Make hooks executable
chmod +x .githooks/*
```

## Usage

### Normal Operation

Once set up, hooks run automatically:

```bash
git push origin main
# Hook runs automatically and validates lockfile
```

### Skipping Hooks

To temporarily skip hooks (use with caution):

```bash
git push --no-verify origin main
```

### Disabling Hooks

To disable hooks entirely:

```bash
git config core.hooksPath .git/hooks
```

To re-enable:

```bash
git config core.hooksPath .githooks
```

## Common Issues and Solutions

### Issue: "Frozen lockfile validation failed"

**Cause**: The `pnpm-lock.yaml` file is inconsistent with `package.json` files.

**Solution**:

```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "Update lockfile"
```

### Issue: "Package.json files are newer than lockfile"

**Cause**: You've modified `package.json` files but haven't updated the lockfile.

**Solution**:

```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "Update lockfile after package.json changes"
```

### Issue: "Uncommitted changes in package.json files"

**Cause**: You have unstaged changes to `package.json` files.

**Solution**:

```bash
git add package.json
git commit -m "Update package.json"
```

### Issue: "Lockfile appears to be corrupted"

**Cause**: The `pnpm-lock.yaml` file has syntax errors or is malformed.

**Solution**:

```bash
rm pnpm-lock.yaml
pnpm install
git add pnpm-lock.yaml
git commit -m "Regenerate corrupted lockfile"
```

## Benefits

1. **Dependency Consistency**: Prevents deployment failures due to inconsistent dependencies
2. **Team Collaboration**: Ensures all team members have the same dependency versions
3. **CI/CD Reliability**: Reduces build failures in continuous integration
4. **Security**: Prevents unintended dependency changes that could introduce vulnerabilities
5. **Performance**: Maintains optimal dependency resolution and caching

## Troubleshooting

### Debug Mode

To see detailed output from the hook, you can run it manually:

```bash
./.githooks/pre-push origin https://github.com/InovacodeDev/portfolio.git
```

### Check Hook Configuration

Verify that hooks are properly configured:

```bash
git config core.hooksPath
# Should output: .githooks
```

### Verify Hook Permissions

Ensure hooks are executable:

```bash
ls -la .githooks/
# Should show executable permissions (x) for hooks
```

## Contributing

When contributing to this project:

1. Always run `./scripts/setup-hooks.sh` after cloning
2. Keep `pnpm-lock.yaml` in sync with `package.json` changes
3. Test your changes with `pnpm install --frozen-lockfile` before pushing
4. If you encounter hook issues, check this documentation first

## Related Documentation

- [Development Setup](../development/setup.md)
- [CI/CD Pipeline](../ci-cd-pipeline.md)
- [Package Management](../development/package-management.md)
