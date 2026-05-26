# Plugin Registry Website Structure

## Overview
The website has been restructured from a single landing page to a multi-page application with shared layout components.

## Pages

### 1. **Home** (`/`)
- **Purpose**: Introduce ZAL and its features
- **Content**:
  - Hero section with terminal mockup showing tool creation
  - Feature grid (Multi-Provider AI, Plugin System, Tool Profiles, etc.)
  - CTA section with "Install Now" and "Browse Plugins" buttons
- **File**: `client/src/pages/NewHome.tsx`

### 2. **Registry** (`/registry`)
- **Purpose**: Browse and search available plugins
- **Content**:
  - Search bar for filtering plugins
  - Grid of plugin cards with name, author, description, tags, downloads
  - Links to individual plugin detail pages
- **File**: `client/src/pages/Registry.tsx`

### 3. **Contact** (`/contact`)
- **Purpose**: Provide ways to get help and contribute
- **Content**:
  - GitHub Issues card (bug reports, feature requests)
  - Email support card
  - Additional resources (Documentation, Discussions, Source Code, License)
- **File**: `client/src/pages/Contact.tsx`

### 4. **Plugin Detail** (`/plugins/:author/:name`)
- **Purpose**: Show detailed information about a specific plugin
- **Content**:
  - Plugin metadata (author, version, downloads)
  - Description and parameters
  - Installation instructions
  - Source code view
- **File**: `client/src/pages/PluginDetail.tsx`

## Shared Components

### Layout (`client/src/components/Layout.tsx`)
Wraps all pages with:
- **Header**: Logo, navigation (Home, Registry, Contact), GitHub link
- **Main Content**: Page-specific content
- **Footer**: Brand info, quick links, community links, copyright

## Design System

### Theme
- **Background**: `#03030d` (dark space theme)
- **Accent Colors**: Cyan (`#06b6d4`) and Violet (`#8b5cf6`)
- **Effects**: Glass morphism, backdrop blur, gradient text, animated stars

### Typography
- **Headings**: Bold, large, often with gradient text
- **Body**: Slate-400 for secondary text, white for primary
- **Mono**: Used for code and terminal mockups

### Components
- Cards with `bg-[#0d0d24]/60 backdrop-blur-xl`
- Borders with `border-cyan-500/12` (low opacity)
- Hover effects with increased border opacity and shadows

## Navigation Structure

```
/                    → Home (About ZAL)
/registry            → Browse Plugins
/contact             → Get in Touch
/plugins/:author/:name → Plugin Detail
```

## Key Features

### Flexible Content
All descriptions are generic to avoid needing updates when features change:
- "Multiple Themes" instead of "5 Color Themes"
- "Multiple AI providers" instead of listing specific providers
- "Browse community-built plugins" instead of "hundreds of plugins"

### Responsive Design
- Mobile-first approach
- Grid layouts that adapt to screen size
- Hamburger menu for mobile (can be added)

### Accessibility
- Semantic HTML
- Proper heading hierarchy
- Focus states on interactive elements
- Alt text for icons (using SVG with aria-labels)

## Future Enhancements

1. **Authentication**: GitHub OAuth for publishing plugins
2. **Plugin Publishing**: Form to upload new plugins
3. **User Profiles**: Author pages showing all their plugins
4. **Search Filters**: Filter by tags, sort by downloads/date
5. **Dark/Light Mode**: Toggle between themes
6. **Mobile Menu**: Hamburger navigation for small screens
