import type { AuthScheme } from './AuthScheme'

/**
 * Authentication configuration for tools
 */
export class AuthConfig {
  /**
   * The authentication scheme
   */
  public authScheme: AuthScheme

  /**
   * Additional context properties
   */
  public context?: Record<string, any>

  /**
   * Constructor for AuthConfig
   */
  public constructor(config: {
    authScheme: AuthScheme
    context?: Record<string, any>
  }) {
    this.authScheme = config.authScheme
    this.context = config.context
  }
}
