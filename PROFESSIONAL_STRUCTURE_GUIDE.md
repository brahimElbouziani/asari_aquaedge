# Professional Project Structure Guide

## 🎯 Goal
Unify and organize page code and CSS for a maintainable, scalable Vue 3 project.

## 📁 Recommended Structure

```
src/
├── pages/
│   ├── [PageName]/
│   │   ├── index.vue          # Main page component
│   │   ├── [PageName].vue     # Alternative: single file
│   │   ├── components/        # Page-specific components
│   │   │   └── [Component].vue
│   │   ├── composables/       # Page-specific composables
│   │   │   └── use[Feature].js
│   │   ├── styles/            # Page-specific styles
│   │   │   └── [PageName].scss
│   │   └── types/             # TypeScript types (if using TS)
│   │       └── [PageName].ts
│   └── Layout/                # Layout components
│
├── assets/
│   ├── css/
│   │   ├── base/              # Base styles (reset, variables)
│   │   │   ├── _variables.scss
│   │   │   ├── _reset.scss
│   │   │   └── _mixins.scss
│   │   ├── components/         # Component styles
│   │   │   ├── _buttons.scss
│   │   │   ├── _cards.scss
│   │   │   └── _tables.scss
│   │   ├── layouts/           # Layout styles
│   │   │   ├── _header.scss
│   │   │   ├── _sidebar.scss
│   │   │   └── _content.scss
│   │   ├── pages/             # Page-specific styles
│   │   │   ├── _dashboard.scss
│   │   │   ├── _maps.scss
│   │   │   └── _table-list.scss
│   │   └── main.scss          # Main import file
│   └── scss/                  # Existing SCSS (keep for compatibility)
│
├── components/
│   ├── [ComponentName]/
│   │   ├── index.vue
│   │   ├── [ComponentName].vue
│   │   └── [ComponentName].scss
│   └── index.js               # Component exports
│
└── composables/               # Shared composables
    └── use[Feature].js
```

## 🎨 CSS Organization Strategy

### 1. **Base Layer** (`assets/css/base/`)
- Variables, mixins, resets
- Global typography
- Color system

### 2. **Component Layer** (`assets/css/components/`)
- Reusable component styles
- Button variants
- Card styles
- Form elements

### 3. **Layout Layer** (`assets/css/layouts/`)
- Header, sidebar, footer
- Grid systems
- Container styles

### 4. **Page Layer** (`assets/css/pages/`)
- Page-specific styles
- One file per page
- Scoped to page class

## 📝 Page Component Structure Template

```vue
<template>
  <div :class="pageClass">
    <!-- Page Header -->
    <header v-if="showHeader" class="page-header">
      <h1 class="page-title">{{ title }}</h1>
      <div class="page-actions">
        <!-- Action buttons -->
      </div>
    </header>

    <!-- Page Content -->
    <main class="page-content">
      <!-- Page-specific content -->
    </main>

    <!-- Page Footer (optional) -->
    <footer v-if="showFooter" class="page-footer">
      <!-- Footer content -->
    </footer>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
// Import composables
import { usePageMeta } from '@/composables/usePageMeta'
// Import components
import PageHeader from './components/PageHeader.vue'
// Import styles
import './styles/PageName.scss'

export default defineComponent({
  name: 'PageName',
  components: {
    PageHeader
  },
  setup() {
    // Use composables
    const { title, meta } = usePageMeta('Page Name')
    
    return {
      pageClass: 'page-page-name',
      title,
      showHeader: true,
      showFooter: false
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/css/base/variables';
@import '@/assets/css/base/mixins';

.page-page-name {
  // Page-specific styles
}
</style>
```

## 🔧 Migration Steps

### Step 1: Create CSS Structure
1. Create `assets/css/base/` directory
2. Create `assets/css/components/` directory
3. Create `assets/css/layouts/` directory
4. Create `assets/css/pages/` directory

### Step 2: Extract Inline Styles
- Move inline styles to SCSS files
- Use CSS variables for colors/spacing
- Create reusable mixins

### Step 3: Organize Page Components
- Create consistent page structure
- Extract page-specific components
- Use composables for logic

### Step 4: Create Style Guide
- Document CSS naming conventions
- Create component style guide
- Document color/spacing system

## 📋 Naming Conventions

### CSS Classes
- **BEM Methodology**: `block__element--modifier`
- **Page classes**: `.page-[page-name]`
- **Component classes**: `.[component-name]`

### Files
- **Components**: PascalCase (`TableList.vue`)
- **Composables**: camelCase with `use` prefix (`useTableData.js`)
- **Styles**: kebab-case (`table-list.scss`)

## ✅ Best Practices

1. **No Inline Styles**: Move all styles to SCSS files
2. **Scoped Styles**: Use `<style scoped>` for component styles
3. **CSS Variables**: Use CSS custom properties for theming
4. **Composables**: Extract reusable logic to composables
5. **Component Extraction**: Break large pages into smaller components
6. **Consistent Structure**: Follow the same structure for all pages
7. **Documentation**: Document complex components and styles

## 🚀 Next Steps

1. Create base CSS structure
2. Migrate existing pages to new structure
3. Extract common patterns to components
4. Create style guide documentation
5. Set up CSS linting and formatting

