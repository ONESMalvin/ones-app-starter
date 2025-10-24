# Publishing Guide

## Publishing to npm

### 1. Preparation

1. Ensure all template variables are properly configured
2. Update version number: `npm version patch|minor|major`
3. Test template functionality

### 2. Publishing Steps

```bash
# Login to npm
npm login

# Publish package
npm publish

# Or publish to test environment
npm publish --tag beta
```

### 3. Using the Template

Users can use the template in the following ways:

```bash
# Create project using npx
npx create-ones-app@latest my-app

# Or install globally and use
npm install -g create-ones-app
create-ones-app my-app
```

### 4. Version Management

- Use semantic versioning
- Breaking changes: major version
- New features: minor version  
- Bug fixes: patch version

### 5. Updating Template

1. Modify template files
2. Update version number
3. Update CHANGELOG.md
4. Publish new version

## Template Variables

The template supports the following variable replacements:

- `{{APP_ID}}` - ONES app ID
- `{{APP_NAME}}` - App name
- `{{APP_DESCRIPTION}}` - App description
- `{{APP_VERSION}}` - App version
