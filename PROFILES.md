# ZAL CLI Profiles System

Complete guide for creating, publishing, and installing plugin profiles.

## 📋 What are Profiles?

Profiles are curated collections of plugins that work together for specific use cases. Users can create profiles containing any approved plugins from the registry, publish them for others to use, and install complete toolsets with a single command.

## 🌐 Website Features

### Browse Profiles

Visit `https://zalcli.com/profiles` to:
- Browse all approved profiles
- See plugin count and downloads
- Filter by tags and use cases
- View detailed profile information

### Create a Profile

1. **Login** with GitHub
2. **Navigate** to "Create Profile"
3. **Fill in details**:
   - Name (unique per author)
   - Description
   - Tags (for discoverability)
4. **Select plugins** from approved plugins
5. **Submit** for admin review

### Manage Your Profiles

- View all your profiles (pending, approved, rejected)
- Edit profile details and plugin list
- Delete profiles
- Track downloads and usage

## 💻 CLI Commands

### Install a Profile

```bash
# Install profile (asks to set as default)
zal /profiles install author-profilename

# Install and automatically set as default
zal /profiles install-default author-profilename
```

### What Happens During Installation

1. **Downloads profile** from registry
2. **Checks existing plugins** - reuses already installed ones
3. **Installs new plugins** - only downloads what's needed
4. **Creates local profile** with all tools
5. **Optionally sets as default** - if you choose "yes" or use `install-default`

### Example

```bash
# Install a web development profile
zal /profiles install ubercodex-webdev

# This might include plugins like:
# - http-request (make HTTP calls)
# - json-formatter (format JSON)
# - html-validator (validate HTML)
# - css-minifier (minify CSS)
```

## 🎯 Use Cases

### Data Science Profile
```
Plugins: csv-parser, data-visualizer, statistics-calculator
Use case: Analyze datasets and generate reports
```

### DevOps Profile
```
Plugins: docker-manager, kubernetes-helper, log-analyzer
Use case: Manage infrastructure and deployments
```

### Content Creation Profile
```
Plugins: markdown-formatter, image-optimizer, seo-analyzer
Use case: Create and optimize web content
```

## 🔧 Profile Behavior

### Default Profile

- When you install a profile with `/profiles install-default`, it becomes your active profile
- All tools in the profile are immediately available to the AI
- You can switch profiles anytime in `/plugins` menu

### Non-Default Installation

- Profile is added to your collection
- All tools are installed and enabled
- Active profile remains unchanged
- You can manually switch to it later

### Smart Plugin Management

- **Reuses existing plugins** - if you already have a plugin, it won't be downloaded again
- **Shared plugins** - plugins can be in multiple profiles
- **No duplicates** - each plugin is only stored once

## 📊 Admin Features

### Review Profiles

Admins can:
- View all pending profiles
- See included plugins
- Approve or reject profiles
- Delete inappropriate profiles
- Track profile statistics

### Profile Approval Criteria

- ✅ Clear, descriptive name
- ✅ Helpful description
- ✅ Relevant tags
- ✅ Only approved plugins
- ✅ Logical plugin grouping
- ✅ Useful for specific use case

## 🔒 Security

- **Only approved plugins** can be added to profiles
- **Admin review required** before profiles are public
- **User authentication** required to create profiles
- **Author verification** via GitHub OAuth

## 📝 API Endpoints

### Public Endpoints

```
GET  /api/profiles                    - List all approved profiles
GET  /api/profiles/:author/:name      - Get profile details with plugins
```

### Authenticated Endpoints

```
POST /api/profiles                    - Create new profile
GET  /api/profiles/my                 - Get user's profiles
PUT  /api/profiles/:id                - Update profile
DELETE /api/profiles/:id              - Delete profile
```

### Admin Endpoints

```
GET  /api/admin/profiles              - Get all profiles (with status filter)
POST /api/admin/profiles/:id/approve  - Approve profile
POST /api/admin/profiles/:id/reject   - Reject profile
DELETE /api/admin/profiles/:id        - Delete profile
GET  /api/admin/stats                 - Get stats (includes profiles)
```

## 🎨 Example Profile JSON

```json
{
  "name": "webdev",
  "description": "Complete web development toolkit",
  "tags": ["web", "development", "frontend"],
  "plugins": [
    {
      "id": "abc123",
      "name": "http-request",
      "description": "Make HTTP requests",
      "parameters": [...],
      "code": "..."
    },
    {
      "id": "def456",
      "name": "json-formatter",
      "description": "Format and validate JSON",
      "parameters": [...],
      "code": "..."
    }
  ]
}
```

## 🚀 Quick Start

### For Users

1. Browse profiles at `https://zalcli.com/profiles`
2. Find a profile that fits your needs
3. Run `zal /profiles install author-profilename`
4. Choose whether to set as default
5. Start using all the tools immediately!

### For Creators

1. Login to `https://zalcli.com`
2. Create a new profile
3. Select relevant plugins
4. Submit for review
5. Share with the community once approved!

## 💡 Tips

- **Name profiles clearly** - "webdev" is better than "mytools"
- **Write good descriptions** - explain the use case
- **Use relevant tags** - helps users find your profile
- **Group related plugins** - profiles should have a theme
- **Test before publishing** - make sure plugins work well together
- **Keep it focused** - 5-10 plugins is ideal, not 50

## 🔄 Updates

When you update a profile:
- Existing installations are NOT automatically updated
- Users need to reinstall to get changes
- Consider versioning in the description
- Notify users of major changes

## 📞 Support

- Issues: https://github.com/ubercodex/zalcli/issues
- Docs: https://zalcli.com/docs
- Community: https://zalcli.com/community
