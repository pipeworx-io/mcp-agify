/**
 * Agify MCP — age prediction from first name (agify.io, free, no auth)
 *
 * Tools:
 * - predict_age: Predict the age of a person based on their first name
 * - predict_age_country: Predict age with country-specific calibration
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://api.agify.io';

type AgifyResponse = {
  count: number;
  age: number | null;
  name: string;
  country_id?: string;
};

const tools: McpToolExport['tools'] = [
  {
    name: 'predict_age',
    description:
      'Predict the most likely age of a person based on their first name, using global data from agify.io.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'First name to predict age for.',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'predict_age_country',
    description:
      'Predict the most likely age of a person based on their first name, calibrated to a specific country.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'First name to predict age for.',
        },
        country_code: {
          type: 'string',
          description:
            'ISO 3166-1 alpha-2 country code (e.g. "US", "GB", "DE") to localize the prediction.',
        },
      },
      required: ['name', 'country_code'],
    },
  },
];

async function predictAge(name: string, countryId?: string): Promise<unknown> {
  const params = new URLSearchParams({ name });
  if (countryId) params.set('country_id', countryId);

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`Agify error: ${res.status}`);

  const data = (await res.json()) as AgifyResponse;

  return {
    name: data.name,
    predicted_age: data.age,
    sample_size: data.count,
    ...(data.country_id ? { country: data.country_id } : {}),
  };
}

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'predict_age':
      return predictAge(args.name as string);
    case 'predict_age_country':
      return predictAge(args.name as string, args.country_code as string);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies McpToolExport;
