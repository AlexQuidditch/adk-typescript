import type { LLMResponse } from '../models/response/LLMResponse'

/**
 * Base class for LLM connections
 */
export abstract class BaseLLMConnection {
  /**
   * Whether the connection is active
   */
  private _isActive: boolean = true

  /**
   * Gets whether the connection is active
   */
  public get isActive(): boolean {
    return this._isActive
  }

  /**
   * Sends a message to the LLM
   *
   * @param message The message to send
   */
  public abstract send(message: string): void

  /**
   * Handles responses from the LLM
   *
   * @param callback The callback to handle responses
   */
  public abstract onResponse(callback: (response: LLMResponse) => void): void

  /**
   * Handles errors from the LLM
   *
   * @param callback The callback to handle errors
   */
  public abstract onError(callback: (error: Error) => void): void

  /**
   * Handles the end of the connection
   *
   * @param callback The callback to handle the end
   */
  public abstract onEnd(callback: () => void): void

  /**
   * Closes the connection
   */
  public close(): void {
    this._isActive = false
  }
}
