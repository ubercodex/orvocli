# Version History Implementation Plan

## Overview
Implement full version history for plugins, allowing multiple versions per plugin with independent approval status.

## Database Schema Changes

### New Structure:
- **plugins** table: Stores plugin metadata (author, name, description, tags)
- **plugin_versions** table: Stores version-specific data (code, parameters, status)

### Migration Steps:
1. Run `npm run migrate:version-history` to migrate existing data
2. Old single-version data will be preserved in new structure

## API Changes

### GET /plugins/:author/:name
**Query Parameters:**
- `version` (optional): Specific version to fetch (e.g., `?version=1.0.5`)
- Default: Returns latest **approved** version

**Response includes:**
- All plugin metadata
- Specific version data (code, parameters, status)
- `availableVersions`: Array of all versions with status

### GET /plugins/:author/:name/versions
**New endpoint** - Returns all versions for a plugin
```json
[
  {
    "version": "1.0.2",
    "status": "approved",
    "createdAt": "2026-05-27T...",
    "approvedAt": "2026-05-28T..."
  },
  {
    "version": "1.0.1",
    "status": "approved",
    ...
  }
]
```

### GET /plugins/:author/:name/versions/:version
**New endpoint** - Get specific version details

### GET /plugins/:author/:name/diff/:version1/:version2
**New endpoint** - Compare two versions (code diff)

### POST /plugins
- Creates plugin metadata
- Creates first version (1.0.0) with status=pending

### PATCH /plugins/:author/:name
- Updates plugin metadata (description, tags) if no code change
- If code changes: Creates new version, increments version number, status=pending

## CLI Changes

### Installation
```bash
# Install latest approved version (default)
/plugins install author-plugin

# Install specific version
/plugins install author-plugin@1.0.5
```

### Version Display
```
› ● plugin-name           v1.0.2 [custom]  Description
```

## Website Changes

### Plugin Detail Page
- Show version selector dropdown
- Display current version info
- "Version History" section with list of all versions
- Each version shows: version number, status badge, date
- Click version to view that version's code

### Version Comparison
- Button: "Compare with previous version"
- Side-by-side diff view
- Highlight added/removed lines

### My Plugins Page
- Show latest version number
- Badge showing status of latest version
- Click to see all versions

## Implementation Order

1. ✅ Database migration script
2. ✅ Update schema.ts
3. ⏳ Update API routes (plugins.ts)
4. ⏳ Update CLI installer
5. ⏳ Update website plugin pages
6. ⏳ Add diff functionality

## Testing Checklist

- [ ] Migrate existing plugins successfully
- [ ] Create new plugin with version 1.0.0
- [ ] Update plugin code → creates new version
- [ ] Update plugin description → doesn't create new version
- [ ] CLI installs latest approved version
- [ ] CLI can install specific version
- [ ] Website shows version history
- [ ] Website diff view works
- [ ] Admin can approve specific versions
