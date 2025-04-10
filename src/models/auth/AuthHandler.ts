import type { AuthConfig } from './AuthConfig'
import type { AuthCredential } from './AuthCredential'

/**
 * Handler for authentication in tools
 */
export class AuthHandler {
  /**
   * The authentication configuration
   */
  public authConfig: AuthConfig

  /**
   * The authentication credential
   */
  public credential?: AuthCredential

  /**
   * Constructor for AuthHandler
   */
  public constructor(config: {
    authConfig: AuthConfig
    credential?: AuthCredential
  }) {
    this.authConfig = config.authConfig
    this.credential = config.credential
  }

  /**
   * Gets the authentication token
   */
  public getToken(): string | undefined {
    return this.credential?.getToken()
  }

  /**
   * Gets headers for HTTP requests
   */
  public getHeaders(): Record<string, string> {
    return this.credential?.getHeaders(this.authConfig) || {}
  }

  /**
   * Refreshes the token if possible
   */
  public async refreshToken(): Promise<void> {
    if (this.credential?.canRefresh()) {
      await this.credential.refresh()
    }
  }
}
