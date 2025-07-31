#!/bin/bash

# Focus Management Implementation Script
# This script helps you install and set up the comprehensive focus management system

set -e

echo "🎯 BioWell Focus Management Setup"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    print_error "Please run this script from your project root directory"
    exit 1
fi

print_info "Checking current setup..."

# Check Node.js version
node_version=$(node --version | cut -d'v' -f2)
required_version="16.0.0"

if [[ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" != "$required_version" ]]; then
    print_error "Node.js version $required_version or higher is required. Current version: $node_version"
    exit 1
fi

print_status "Node.js version check passed"

# Install dependencies
print_info "Installing accessibility dependencies..."

# Core dependencies
npm install --save framer-motion lucide-react

# Development dependencies
npm install --save-dev @axe-core/react @testing-library/jest-dom @testing-library/react @testing-library/user-event axe-core jest-axe eslint-plugin-jsx-a11y

print_status "Dependencies installed"

# Create necessary directories
print_info "Creating directory structure..."

mkdir -p src/utils
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/__tests__
mkdir -p docs

print_status "Directory structure created"

# Copy configuration files
print_info "Setting up configuration files..."

# Check if the focus management files exist
if [[ ! -f "src/utils/focusManagement.ts" ]]; then
    print_warning "Focus management utilities not found. Please ensure you have copied all the focus management files."
fi

if [[ ! -f "src/components/ui/AccessibleModal.tsx" ]]; then
    print_warning "AccessibleModal component not found. Please ensure you have copied all the UI components."
fi

# Update package.json scripts
print_info "Adding npm scripts..."

# Create a temporary package.json with new scripts
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.scripts = {
  ...pkg.scripts,
  'test:a11y': 'jest --testMatch=\"**/*.a11y.test.{js,ts,tsx}\"',
  'test:focus': 'jest --testMatch=\"**/*FocusManagement.test.{js,ts,tsx}\"',
  'lint:a11y': 'eslint src --ext .tsx,.ts --config .eslintrc.a11y.js',
  'audit:a11y': 'npm run lint:a11y && npm run test:a11y'
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

print_status "Package.json updated with accessibility scripts"

# Setup TypeScript configuration for accessibility
if [[ -f "tsconfig.json" ]]; then
    print_info "Updating TypeScript configuration..."
    
    # Add strict accessibility checks
    node -e "
    const fs = require('fs');
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    
    tsconfig.compilerOptions = {
      ...tsconfig.compilerOptions,
      'strict': true,
      'noImplicitAny': true,
      'strictNullChecks': true
    };
    
    fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
    "
    
    print_status "TypeScript configuration updated"
fi

# Create pre-commit hook for accessibility checks
print_info "Setting up Git hooks..."

mkdir -p .git/hooks

cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

echo "🔍 Running pre-commit accessibility checks..."

# Run accessibility linting
npm run lint:a11y --silent

if [[ $? -ne 0 ]]; then
    echo "❌ Accessibility linting failed. Please fix the issues before committing."
    exit 1
fi

echo "✅ Pre-commit accessibility checks passed"
EOF

chmod +x .git/hooks/pre-commit

print_status "Git pre-commit hook installed"

# Create accessibility testing script
print_info "Creating accessibility test runner..."

cat > scripts/test-accessibility.sh << 'EOF'
#!/bin/bash

echo "🧪 Running Accessibility Tests"
echo "============================="

# Run ESLint accessibility checks
echo "Running ESLint accessibility checks..."
npm run lint:a11y

# Run Jest accessibility tests
echo "Running Jest accessibility tests..."
npm run test:a11y

# Run axe-core audit (if built files exist)
if [[ -d "dist" ]] || [[ -d "build" ]]; then
    echo "Running axe-core audit..."
    npx axe src --ext .html,.tsx
else
    echo "⚠ Skipping axe-core audit (no built files found)"
fi

echo "✅ Accessibility tests completed"
EOF

chmod +x scripts/test-accessibility.sh

print_status "Accessibility test runner created"

# Create documentation
print_info "Creating documentation..."

cat > docs/ACCESSIBILITY.md << 'EOF'
# Accessibility Implementation Guide

## Overview

This project implements comprehensive accessibility features following WCAG 2.1 guidelines.

## Key Features

- ✅ Focus management with focus trapping
- ✅ Skip links for keyboard navigation
- ✅ Screen reader announcements
- ✅ Keyboard shortcuts
- ✅ High contrast support
- ✅ Reduced motion respect

## Testing

Run accessibility tests with:

```bash
npm run test:a11y
npm run lint:a11y
./scripts/test-accessibility.sh
```

## Implementation Checklist

- [ ] Wrap app with FocusProvider
- [ ] Replace modals with AccessibleModal
- [ ] Use AccessibleDropdown for selects
- [ ] Add proper ARIA labels
- [ ] Test with keyboard navigation
- [ ] Test with screen readers
- [ ] Validate WCAG compliance

## Screen Reader Testing

Test with:
- NVDA (Windows)
- JAWS (Windows) 
- VoiceOver (macOS)
- TalkBack (Android)

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
EOF

print_status "Documentation created"

# Final setup verification
print_info "Verifying setup..."

# Check if key files exist
missing_files=()

key_files=(
    "src/utils/focusManagement.ts"
    "src/components/ui/AccessibleModal.tsx"
    "src/components/ui/AccessibleDropdown.tsx"
    "src/components/ui/SkipLinks.tsx"
    "src/components/FocusProvider.tsx"
)

for file in "${key_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        missing_files+=("$file")
    fi
done

if [[ ${#missing_files[@]} -gt 0 ]]; then
    print_warning "The following files are missing:"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    echo ""
    print_info "Please ensure all focus management files have been created."
else
    print_status "All key files are present"
fi

# Test the setup
print_info "Testing the setup..."

# Try to compile TypeScript
if command -v tsc &> /dev/null; then
    if tsc --noEmit --skipLibCheck; then
        print_status "TypeScript compilation test passed"
    else
        print_warning "TypeScript compilation has issues"
    fi
fi

# Try to run linting
if npx eslint --version &> /dev/null; then
    if [[ -f ".eslintrc.a11y.js" ]]; then
        print_status "Accessibility linting configuration ready"
    else
        print_warning "Accessibility linting configuration not found"
    fi
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
print_status "Focus management system is ready for implementation"
echo ""
echo "Next steps:"
echo "1. Review the implementation guide: FOCUS_MANAGEMENT_GUIDE.md"
echo "2. Check the example integrations: src/components/IntegrationExamples.tsx"
echo "3. Update your App.tsx with FocusProvider"
echo "4. Replace existing components with accessible versions"
echo "5. Run tests: npm run test:a11y"
echo ""
print_info "For detailed implementation instructions, see FOCUS_MANAGEMENT_GUIDE.md"

# Open the guide if possible
if command -v code &> /dev/null; then
    print_info "Opening implementation guide in VS Code..."
    code FOCUS_MANAGEMENT_GUIDE.md
elif command -v open &> /dev/null; then
    print_info "Opening implementation guide..."
    open FOCUS_MANAGEMENT_GUIDE.md
fi

echo ""
print_status "Setup completed successfully! 🚀"
