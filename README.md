# WordPress Trac MCP Server

Search and explore all WordPress.org Trac issue trackers directly from Claude, ChatGPT, or any AI assistant that supports MCP (Model Context Protocol).

**No coding required to use this** - just add the server URLs to your AI assistant config.

Based on [trac-mcp](https://github.com/Jameswlepage/trac-mcp) by James LePage.

---

## Quick Start (No Coding Required)

### For Claude Desktop Users

1. Open your Claude Desktop config file:
   - **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the WordPress Trac servers to the `mcpServers` section:

```json
{
  "mcpServers": {
    "wordpress-core-trac": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp-server-wporg-core-trac.meta-trac-wordpress.workers.dev/mcp"]
    },
    "wordpress-meta-trac": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp-server-wporg-meta-trac.meta-trac-wordpress.workers.dev/mcp"]
    },
    "wordpress-plugins-trac": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp-server-wporg-plugins-trac.meta-trac-wordpress.workers.dev/mcp"]
    },
    "wordpress-themes-trac": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp-server-wporg-themes-trac.meta-trac-wordpress.workers.dev/mcp"]
    },
    "wordpress-bbpress-trac": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp-server-wporg-bbpress-trac.meta-trac-wordpress.workers.dev/mcp"]
    },
    "wordpress-buddypress-trac": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp-server-wporg-buddypress-trac.meta-trac-wordpress.workers.dev/mcp"]
    },
    "wordpress-glotpress-trac": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp-server-wporg-glotpress-trac.meta-trac-wordpress.workers.dev/mcp"]
    }
  }
}
```

3. **Restart Claude Desktop**

4. You can now ask Claude things like:
   - "Search Core Trac for accessibility issues"
   - "Find recent plugin directory tickets"
   - "Show me ticket #12345 from Meta Trac"
   - "What's the latest activity on BuddyPress Trac?"

### For ChatGPT Users

1. Open ChatGPT Settings → Connectors tab
2. Add Server → Import remote MCP server
3. Use any of these URLs:
   - Core: `https://mcp-server-wporg-core-trac.meta-trac-wordpress.workers.dev/mcp/chatgpt`
   - Meta: `https://mcp-server-wporg-meta-trac.meta-trac-wordpress.workers.dev/mcp/chatgpt`
   - Plugins: `https://mcp-server-wporg-plugins-trac.meta-trac-wordpress.workers.dev/mcp/chatgpt`
   - Themes: `https://mcp-server-wporg-themes-trac.meta-trac-wordpress.workers.dev/mcp/chatgpt`
   - bbPress: `https://mcp-server-wporg-bbpress-trac.meta-trac-wordpress.workers.dev/mcp/chatgpt`
   - BuddyPress: `https://mcp-server-wporg-buddypress-trac.meta-trac-wordpress.workers.dev/mcp/chatgpt`
   - GlotPress: `https://mcp-server-wporg-glotpress-trac.meta-trac-wordpress.workers.dev/mcp/chatgpt`
4. Enable in Composer → Deep Research tool

---

## What You Can Search

| Trac Instance | What It Tracks | Live URL |
|---------------|----------------|----------|
| **Core** | WordPress core bugs, features, enhancements | [core.trac.wordpress.org](https://core.trac.wordpress.org) |
| **Meta** | WordPress.org website and infrastructure | [meta.trac.wordpress.org](https://meta.trac.wordpress.org) |
| **Plugins** | Plugin directory issues and reviews | [plugins.trac.wordpress.org](https://plugins.trac.wordpress.org) |
| **Themes** | Theme reviews and directory | [themes.trac.wordpress.org](https://themes.trac.wordpress.org) |
| **bbPress** | bbPress forum software | [bbpress.trac.wordpress.org](https://bbpress.trac.wordpress.org) |
| **BuddyPress** | BuddyPress social networking plugin | [buddypress.trac.wordpress.org](https://buddypress.trac.wordpress.org) |
| **GlotPress** | Translation platform | [glotpress.trac.wordpress.org](https://glotpress.trac.wordpress.org) |

## Available Commands

Once connected, you can ask your AI assistant to:

- **Search tickets**: "Search for REST API issues" or "Find tickets about block editor"
- **Get ticket details**: "Show me ticket #58000" or "What's the status of ticket 12345?"
- **View changesets**: "Show changeset r58000" or "What changed in revision 55000?"
- **Check timeline**: "What happened on Core Trac this week?"
- **Get project info**: "List the milestones for WordPress 6.7"

---

## For Developers

### Deploy Your Own Instance

```bash
# Clone the repository
git clone https://github.com/courtneyr-dev/meta-trac.git
cd meta-trac

# Install dependencies
npm install

# Login to Cloudflare
npx wrangler login

# Deploy specific instances
npm run deploy:core       # Core Trac
npm run deploy:meta       # Meta Trac
npm run deploy:plugins    # Plugins Trac
npm run deploy:themes     # Themes Trac
npm run deploy:bbpress    # bbPress Trac
npm run deploy:buddypress # BuddyPress Trac
npm run deploy:glotpress  # GlotPress Trac

# Or deploy ALL at once
npm run deploy:all
```

### Environment Variables

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| `TRAC_INSTANCE` | `core`, `meta`, `plugins`, `themes`, `bbpress`, `buddypress`, `glotpress` | `meta` | Which Trac instance |
| `TRAC_BASE_URL` | URL | (auto) | Override the base URL |

### Local Development

```bash
# Start dev server
npm run dev

# Test with MCP Inspector
npx @modelcontextprotocol/inspector http://localhost:8787/mcp

# Run tests
npm run test:unit

# Type check
npm run type-check
```

### API Testing

```bash
# Health check
curl https://mcp-server-wporg-core-trac.meta-trac-wordpress.workers.dev/health

# Search tickets
curl -X POST 'https://mcp-server-wporg-core-trac.meta-trac-wordpress.workers.dev/mcp' \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"searchTickets","arguments":{"query":"accessibility","limit":5}},"id":1}'
```

## Architecture

- **Runtime**: Cloudflare Workers (global edge deployment)
- **Language**: TypeScript with Zod validation
- **Protocol**: Model Context Protocol (MCP)
- **APIs**: Public WordPress Trac CSV/RSS endpoints (no auth required)

## Known Limitations

- Comment history not available via CSV API (visit ticket URL for full discussion)
- Components list requires sampling tickets to extract values
- Each Trac instance is a separate deployment

## License

GNU General Public License v2 or later - see [GPL License](https://www.gnu.org/licenses/gpl-3.0.en.html).

## Contributing

Contributions welcome! This server demonstrates production-ready MCP servers with multi-instance support.
