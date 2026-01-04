# WordPress Trac MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with comprehensive access to **all WordPress.org Trac instances**. Built with TypeScript and deployed on Cloudflare Workers.

Based on [trac-mcp](https://github.com/Jameswlepage/trac-mcp) by James LePage.

## Supported Trac Instances

| Instance | URL | Description | Deploy Command |
|----------|-----|-------------|----------------|
| **Core** | https://core.trac.wordpress.org | WordPress core development | `npm run deploy:core` |
| **Meta** | https://meta.trac.wordpress.org | WordPress.org infrastructure | `npm run deploy:meta` |
| **Plugins** | https://plugins.trac.wordpress.org | Plugin directory issues | `npm run deploy:plugins` |
| **Themes** | https://themes.trac.wordpress.org | Theme reviews & directory | `npm run deploy:themes` |
| **bbPress** | https://bbpress.trac.wordpress.org | bbPress forum software | `npm run deploy:bbpress` |
| **BuddyPress** | https://buddypress.trac.wordpress.org | BuddyPress social networking | `npm run deploy:buddypress` |
| **GlotPress** | https://glotpress.trac.wordpress.org | Translation platform | `npm run deploy:glotpress` |

## Live Demo

**Meta Trac**: https://mcp-server-wporg-meta-trac-staging.meta-trac-wordpress.workers.dev

## Features

- **Multi-Instance Support**: Single codebase supports all 7 WordPress.org Trac instances
- Search tickets by keywords, components, or status
- Get detailed ticket information including descriptions and metadata
- Access changeset information with full diff content
- Monitor recent activity via timeline
- Retrieve project metadata (components, milestones, priorities)
- **Intelligent Query Routing**: Automatically detects ticket numbers, revisions, and keywords
- **Dual Interface**: Standard MCP + ChatGPT Deep Research support

## Available Tools

### searchTickets
Search for tickets by keyword or filter expression.

```json
{
  "tool": "searchTickets",
  "args": {
    "query": "accessibility",
    "limit": 10,
    "status": "open"
  }
}
```

### getTicket
Get detailed information about a specific ticket.

```json
{
  "tool": "getTicket",
  "args": {
    "id": 12345,
    "includeComments": true
  }
}
```

### getChangeset
Get information about a code changeset/commit.

```json
{
  "tool": "getChangeset",
  "args": {
    "revision": 58000,
    "includeDiff": true
  }
}
```

### getTimeline
Get recent activity from the Trac timeline.

```json
{
  "tool": "getTimeline",
  "args": {
    "days": 7,
    "limit": 20
  }
}
```

### getTracInfo
Get Trac metadata (milestones, priorities, types, statuses).

```json
{
  "tool": "getTracInfo",
  "args": {
    "type": "milestones"
  }
}
```

## Installation

### Deploy to Cloudflare Workers

```bash
# Clone the repository
git clone https://github.com/courtneyr-dev/meta-trac.git
cd meta-trac

# Install dependencies
npm install

# Login to Cloudflare
npx wrangler login

# Deploy a specific instance
npm run deploy:meta      # Meta Trac
npm run deploy:core      # Core Trac
npm run deploy:plugins   # Plugins Trac
npm run deploy:themes    # Themes Trac
npm run deploy:bbpress   # bbPress Trac
npm run deploy:buddypress # BuddyPress Trac
npm run deploy:glotpress # GlotPress Trac

# Or deploy ALL instances
npm run deploy:all
```

### Environment Variables

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| `TRAC_INSTANCE` | `core`, `meta`, `plugins`, `themes`, `bbpress`, `buddypress`, `glotpress` | `meta` | Which Trac instance |
| `TRAC_BASE_URL` | URL | (auto) | Override the base URL |

## Connect to AI Assistant

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "wordpress-core-trac": {
      "command": "npx",
      "args": ["mcp-remote", "https://your-core-trac-url/mcp"]
    },
    "wordpress-meta-trac": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp-server-wporg-meta-trac-staging.meta-trac-wordpress.workers.dev/mcp"]
    },
    "wordpress-plugins-trac": {
      "command": "npx",
      "args": ["mcp-remote", "https://your-plugins-trac-url/mcp"]
    }
  }
}
```

### ChatGPT Deep Research

1. Open ChatGPT Settings → Connectors tab
2. Add Server → Import remote MCP server:
   ```
   https://your-worker-url/mcp/chatgpt
   ```
3. Enable in Composer → Deep Research tool

## Development

### Local Development

```bash
# Start dev server (uses TRAC_INSTANCE from wrangler.toml)
npm run dev

# Test with MCP Inspector
npx @modelcontextprotocol/inspector http://localhost:8787/mcp
```

### Testing

```bash
# Type check
npm run type-check

# Run unit tests
npm run test:unit

# Health check
curl https://your-worker-url/health
```

### Test Queries

```bash
# Search Meta Trac
curl -X POST 'https://mcp-server-wporg-meta-trac-staging.meta-trac-wordpress.workers.dev/mcp' \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"searchTickets","arguments":{"query":"plugin directory","limit":5}},"id":1}'

# Get specific ticket
curl -X POST 'https://your-worker-url/mcp' \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"getTicket","arguments":{"id":100}},"id":1}'
```

## Architecture

- **Runtime**: Cloudflare Workers (global edge deployment)
- **Language**: TypeScript with Zod validation
- **Protocol**: Model Context Protocol (MCP)
- **APIs**: Public WordPress Trac CSV/RSS endpoints (no auth required)

## Known Limitations

- Comment history not available via CSV API (visit ticket URL for full discussion)
- Components list requires sampling tickets to extract values
- Each Trac instance needs separate deployment (or use `deploy:all`)

## License

GNU General Public License v2 or later - see [GPL License](https://www.gnu.org/licenses/gpl-3.0.en.html).

## Contributing

Contributions welcome! This server demonstrates production-ready MCP servers with multi-instance support.
