# @pipeworx/mcp-agify

MCP server for [Agify.io](https://agify.io) — predict a person's age from their first name, with optional country-specific calibration. Free, no auth required.

## Tools

| Tool | Description |
|------|-------------|
| `predict_age` | Predict age based on a first name (global data) |
| `predict_age_country` | Predict age calibrated to a specific country |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "agify": {
      "type": "url",
      "url": "https://gateway.pipeworx.io/agify"
    }
  }
}
```

## CLI Usage

```bash
npx @anthropic-ai/mcp-client https://gateway.pipeworx.io/agify
```

## License

MIT
