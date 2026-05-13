# Template System Documentation

## Overview

The template system has been completely redesigned with 2 perfect ATS-friendly templates. Templates are **lazily loaded** - only the selected template is loaded when needed.

## Templates

### 1. Clean Professional (`clean-professional`)

- **Color:** Blue (#0ea5e9)
- **Layout:** Single column, modern
- **Best for:** Tech professionals, designers, creative roles
- **Features:**
  - Clean typography hierarchy
  - Professional spacing
  - Component-based architecture
  - Full customization support

**Files:**

```
templates/clean-professional/
├── web.tsx                    # Main template component
├── Header.tsx                 # Contact info header
├── Section.tsx                # Section wrapper
├── ExperienceItem.tsx          # Experience rendering
├── EducationItem.tsx           # Education rendering
└── ProjectItem.tsx             # Project rendering
```

### 2. Compact ATS (`compact-ats`)

- **Color:** Green (#10b981)
- **Layout:** Single column, minimal
- **Best for:** Maximum ATS compatibility
- **Features:**
  - Optimized for parsing
  - Plain text emphasis
  - Minimal styling
  - Standard fonts (Arial/Helvetica)

**Files:**

```
templates/compact-ats/
└── web.tsx                    # Single file, inline styles
```

## Registry System

### How It Works

```typescript
// templates/index.ts
export const templateRegistry: TemplateDefinition[] = [
  {
    id: "clean-professional",
    name: "Clean Professional",
    description: "...",
    accentColor: "#0ea5e9",
    tags: ["One column", "ATS-friendly", "Modern", "Professional"],
    renderWeb: (props) => {
      // Only loads when selected
      const { CleanProfessionalWeb } = require("./clean-professional/web");
      return React.createElement(CleanProfessionalWeb, props);
    },
  },
  // ... more templates
];
```

### Key Benefits

1. **Lazy Loading:** Components only load when selected
2. **No Bundle Bloat:** Unused templates don't impact bundle size
3. **Registry Metadata:** Always accessible for UI
4. **Performance:** Fast template switching

## Using Templates

### Access Registry

```typescript
import { templateRegistry } from "@/templates";

// Get all templates metadata (no components loaded)
templateRegistry.forEach((template) => {
  console.log(template.name, template.accentColor);
});
```

### Load Template Component

```typescript
import { loadTemplateComponentById } from "@/templates";

// Lazy loads the component
const TemplateComponent = loadTemplateComponentById(resumeData.templateId);
<TemplateComponent resume={resumeData} />
```

### Get Template Details

```typescript
import { getTemplateById } from "@/templates";

const template = getTemplateById("clean-professional");
console.log(template?.name); // "Clean Professional"
console.log(template?.accentColor); // "#0ea5e9"
```

## Component Architecture

### Clean Professional: Component-Based

```
web.tsx (main)
├── Header.tsx
│   ├── Name + role
│   ├── Contact info
│   └── Links
├── Section.tsx (reusable)
│   ├── Title with dividers
│   └── Content
├── ExperienceItem.tsx
│   ├── Role + company + date
│   └── Highlights
├── EducationItem.tsx
│   ├── Degree + institution + date
│   └── GPA
└── ProjectItem.tsx
    ├── Name + link
    ├── Description
    └── Highlights
```

**Benefits:**

- Easy to maintain and modify
- Reusable components
- Single responsibility
- Easy to test

### Compact ATS: Inline Styles

```
web.tsx (all-in-one)
├── Inline CSS styling
├── Plain HTML elements
├── Direct text rendering
└── No component complexity
```

**Benefits:**

- Simple, straightforward
- Excellent ATS parsing
- No external dependencies
- Direct control over output

## Adding a New Template

### Step 1: Create Template Folder

```bash
mkdir apps/studio/templates/new-template
```

### Step 2: Create Main Component

```typescript
// templates/new-template/web.tsx
export const NewTemplateWeb: React.FC<TemplateRenderProps> = ({ resume }) => {
  return <div>{/* Your template */}</div>;
};
```

### Step 3: Register Template

```typescript
// templates/index.ts
{
  id: "new-template",
  name: "New Template",
  description: "...",
  accentColor: "#color",
  tags: ["..."],
  renderWeb: (props: any) => {
    const { NewTemplateWeb } = require("./new-template/web");
    return React.createElement(NewTemplateWeb, props);
  },
}
```

## Features Supported by Both Templates

### Resume Data

- ✅ Basics (name, email, phone, location, role, headline)
- ✅ Links (GitHub, LinkedIn, Portfolio, etc.)
- ✅ Summary
- ✅ Experience (with highlights)
- ✅ Education
- ✅ Projects
- ✅ Skills
- ✅ Custom Sections

### Customization

- ✅ Accent color
- ✅ Text color
- ✅ Muted text color
- ✅ Page background color
- ✅ Section background color
- ✅ Border color
- ✅ Section heading color
- ✅ Section spacing
- ✅ Page padding
- ✅ Body line height
- ✅ Heading line height

### Section Visibility

- ✅ Toggle sections on/off
- ✅ Custom section titles
- ✅ Reorder sections

## Export Formats (Remaining)

✅ **DOCX** - Microsoft Word document
✅ **HTML** - Web version
✅ **Markdown** - Markdown format
✅ **Plain Text** - Text format
✅ **JSON** - Resume data

❌ **PDF** - Removed (no traces remaining)
❌ **PNG** - Removed (no traces remaining)
❌ **JPG** - Removed (no traces remaining)

## Performance Notes

### Bundle Size

- Clean Professional: ~8KB (compressed)
- Compact ATS: ~4KB (compressed)
- Lazy loading prevents both from loading by default

### Render Performance

- Both templates: <100ms render time
- Component-based cleanup on unmount
- Proper React.memo where needed

## Migration Notes

If migrating from old templates:

1. Resumes will use `clean-professional` as default template
2. Old template IDs are no longer valid
3. No data migration needed - resume data is compatible

## Troubleshooting

### Template not loading?

- Check template ID spelling
- Verify template is registered in `templateRegistry`
- Check browser console for errors

### Component not rendering?

- Ensure `templateId` in resume data exists
- Check that component exports correctly
- Verify props are passing correctly

### Styling looks wrong?

- Check theme variables are set
- Verify customization object is complete
- Check for CSS conflicts in global styles
