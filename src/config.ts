/**
 * Trac Instance Configuration
 * Supports all WordPress.org Trac instances
 */

export type TracInstanceType = 'core' | 'meta' | 'plugins' | 'themes' | 'bbpress' | 'buddypress' | 'glotpress';

export interface TracInstanceConfig {
  baseUrl: string;
  instanceName: string;
  instanceType: TracInstanceType;
  displayName: string;
}

export interface Env {
  ENVIRONMENT?: string;
  TRAC_INSTANCE?: TracInstanceType;
  TRAC_BASE_URL?: string;
  CF_VERSION_METADATA?: {
    id: string;
    tag?: string;
    timestamp: string;
  };
}

const INSTANCE_CONFIGS: Record<TracInstanceType, Omit<TracInstanceConfig, 'baseUrl'> & { defaultBaseUrl: string }> = {
  core: {
    defaultBaseUrl: 'https://core.trac.wordpress.org',
    instanceName: 'WordPress Core Trac',
    instanceType: 'core',
    displayName: 'WordPress Core',
  },
  meta: {
    defaultBaseUrl: 'https://meta.trac.wordpress.org',
    instanceName: 'WordPress Meta Trac',
    instanceType: 'meta',
    displayName: 'WordPress.org Infrastructure',
  },
  plugins: {
    defaultBaseUrl: 'https://plugins.trac.wordpress.org',
    instanceName: 'WordPress Plugins Trac',
    instanceType: 'plugins',
    displayName: 'Plugin Directory',
  },
  themes: {
    defaultBaseUrl: 'https://themes.trac.wordpress.org',
    instanceName: 'WordPress Themes Trac',
    instanceType: 'themes',
    displayName: 'Theme Directory',
  },
  bbpress: {
    defaultBaseUrl: 'https://bbpress.trac.wordpress.org',
    instanceName: 'bbPress Trac',
    instanceType: 'bbpress',
    displayName: 'bbPress',
  },
  buddypress: {
    defaultBaseUrl: 'https://buddypress.trac.wordpress.org',
    instanceName: 'BuddyPress Trac',
    instanceType: 'buddypress',
    displayName: 'BuddyPress',
  },
  glotpress: {
    defaultBaseUrl: 'https://glotpress.trac.wordpress.org',
    instanceName: 'GlotPress Trac',
    instanceType: 'glotpress',
    displayName: 'GlotPress',
  },
};

export function getTracConfig(env: Env): TracInstanceConfig {
  const instanceType = env.TRAC_INSTANCE || 'meta';
  const instanceConfig = INSTANCE_CONFIGS[instanceType] || INSTANCE_CONFIGS.meta;

  return {
    baseUrl: env.TRAC_BASE_URL || instanceConfig.defaultBaseUrl,
    instanceName: instanceConfig.instanceName,
    instanceType: instanceConfig.instanceType,
    displayName: instanceConfig.displayName,
  };
}

/**
 * Get all available Trac instances
 */
export function getAllTracInstances(): Array<{ type: TracInstanceType; name: string; url: string }> {
  return Object.entries(INSTANCE_CONFIGS).map(([type, config]) => ({
    type: type as TracInstanceType,
    name: config.instanceName,
    url: config.defaultBaseUrl,
  }));
}

/**
 * Build a full Trac URL from a path and optional query parameters
 */
export function buildTracUrl(config: TracInstanceConfig, path: string, params?: Record<string, string>): string {
  const url = new URL(path, config.baseUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}
