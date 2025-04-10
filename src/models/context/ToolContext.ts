import type { AuthHandler } from '../auth/AuthHandler'
import type { InvocationContext } from './InvocationContext'

/**
 * Context for tool execution
 */
export class ToolContext {
  /**
   * The parent invocation context
   */
  public invocationContext: InvocationContext

  /**
   * Authentication handler for the tool
   */
  public auth?: AuthHandler

  /**
   * Additional parameters for the tool
   */
  public parameters: Record<string, any>

  /**
   * Constructor for ToolContext
   */
  public constructor(options: {
    invocationContext: InvocationContext
    auth?: AuthHandler
    parameters?: Record<string, any>
  }) {
    this.invocationContext = options.invocationContext
    this.auth = options.auth
    this.parameters = options.parameters || {}
  }

  /**
   * Gets a parameter value
   */
  public getParameter<T>(name: string, defaultValue?: T): T | undefined {
    return (name in this.parameters)
      ? this.parameters[name] as T
      : defaultValue
  }

  /**
   * Sets a parameter value
   */
  public setParameter(name: string, value: any): void {
    this.parameters[name] = value
  }
}
