import { Buffer } from 'node:buffer'

import type { AuthConfig } from './AuthConfig'
import type { ApiKeyScheme } from './AuthScheme'

/**
 * Types of authentication credentials
 */
export enum AuthCredentialType {
  API_KEY = 'api_key',
  BASIC = 'basic',
  BEARER = 'bearer',
  OAUTH2 = 'oauth2',
  CUSTOM = 'custom',
}

/**
 * Base class for authentication credentials
 */
export abstract class AuthCredential {
  /**
   * Type of credential
   */
  public type: AuthCredentialType

  /**
   * Constructor for AuthCredential
   */
  public constructor(type: AuthCredentialType) {
    this.type = type
  }

  /**
   * Gets the authentication token
   */
  public abstract getToken(): string | undefined

  /**
   * Gets headers for HTTP requests
   */
  public abstract getHeaders(config: AuthConfig): Record<string, string>

  /**
   * Whether the token can be refreshed
   */
  public canRefresh(): boolean {
    return false
  }

  /**
   * Refreshes the token
   */
  public async refresh(): Promise<void> {
    throw new Error('Token refresh not supported for this credential type')
  }
}

/**
 * API Key credential
 */
export class ApiKeyCredential extends AuthCredential {
  /**
   * The API key
   */
  public apiKey: string

  /**
   * Constructor for ApiKeyCredential
   */
  public constructor(apiKey: string) {
    super(AuthCredentialType.API_KEY)
    this.apiKey = apiKey
  }

  /**
   * Gets the API key as the token
   */
  public getToken(): string {
    return this.apiKey
  }

  /**
   * Gets headers for HTTP requests
   */
  public getHeaders(config: AuthConfig): Record<string, string> {
    const scheme = config.authScheme as ApiKeyScheme

    if (scheme.in === 'header') {
      return { [scheme.name]: this.apiKey }
    }

    return {}
  }
}

/**
 * Basic authentication credential
 */
export class BasicAuthCredential extends AuthCredential {
  /**
   * The username
   */
  public username: string

  /**
   * The password
   */
  public password: string

  /**
   * Constructor for BasicAuthCredential
   */
  public constructor(username: string, password: string) {
    super(AuthCredentialType.BASIC)
    this.username = username
    this.password = password
  }

  /**
   * Gets the encoded basic auth token
   */
  public getToken(): string {
    return Buffer.from(`${this.username}:${this.password}`).toString('base64')
  }

  /**
   * Gets headers for HTTP requests
   */
  public getHeaders(): Record<string, string> {
    return {
      Authorization: `Basic ${this.getToken()}`,
    }
  }
}

/**
 * Bearer token credential
 */
export class BearerTokenCredential extends AuthCredential {
  /**
   * The bearer token
   */
  public token: string

  /**
   * Constructor for BearerTokenCredential
   */
  public constructor(token: string) {
    super(AuthCredentialType.BEARER)
    this.token = token
  }

  /**
   * Gets the bearer token
   */
  public getToken(): string {
    return this.token
  }

  /**
   * Gets headers for HTTP requests
   */
  public getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
    }
  }
}

/**
 * OAuth2 token credential with refresh capability
 */
export class OAuth2Credential extends AuthCredential {
  /**
   * The access token
   */
  public accessToken: string

  /**
   * The refresh token
   */
  public refreshToken?: string

  /**
   * When the token expires
   */
  public expiresAt?: Date

  /**
   * Function to refresh the token
   */
  private refreshFunction?: (refreshToken: string) => Promise<{ accessToken: string, refreshToken?: string, expiresIn?: number }>

  /**
   * Constructor for OAuth2Credential
   */
  public constructor(config: {
    accessToken: string
    refreshToken?: string
    expiresIn?: number
    refreshFunction?: (refreshToken: string) => Promise<{ accessToken: string, refreshToken?: string, expiresIn?: number }>
  }) {
    super(AuthCredentialType.OAUTH2)
    this.accessToken = config.accessToken
    this.refreshToken = config.refreshToken

    if (config.expiresIn) {
      this.expiresAt = new Date(Date.now() + config.expiresIn * 1000)
    }

    this.refreshFunction = config.refreshFunction
  }

  /**
   * Gets the access token
   */
  public getToken(): string {
    return this.accessToken
  }

  /**
   * Gets headers for HTTP requests
   */
  public getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.accessToken}`,
    }
  }

  /**
   * Whether the token can be refreshed
   */
  public canRefresh(): boolean {
    return !!this.refreshToken && !!this.refreshFunction
  }

  /**
   * Whether the token is expired
   */
  public isExpired(): boolean {
    if (!this.expiresAt) {
      return false
    }

    // Consider it expired if it's less than 30 seconds from expiration
    return this.expiresAt.getTime() - 30000 < Date.now()
  }

  /**
   * Refreshes the token
   */
  public async refresh(): Promise<void> {
    if (!this.canRefresh()) {
      throw new Error('Cannot refresh token: no refresh token or refresh function')
    }

    const result = await this.refreshFunction!(this.refreshToken!)

    this.accessToken = result.accessToken

    if (result.refreshToken) {
      this.refreshToken = result.refreshToken
    }

    if (result.expiresIn) {
      this.expiresAt = new Date(Date.now() + result.expiresIn * 1000)
    }
  }
}
