import type { LLMRequest } from '../models/request/LLMRequest'
import type { LLMResponse } from '../models/response/LLMResponse'
import type { BaseLLMConnection } from './BaseLLMConnection'

/**
 * Base class for all LLM implementations
 */
export abstract class BaseLLM {
  /**
   * The name of the LLM model
   */
  public model: string

  /**
   * Constructor for BaseLLM
   */
  public constructor(model: string) {
    this.model = model
  }

  /**
   * Returns a list of supported models in regex for LLMRegistry
   */
  public static supportedModels(): string[] {
    return []
  }

  /**
   * Generates content from the given request
   *
   * @param llmRequest The request to send to the LLM
   * @param stream Whether to do streaming call
   * @returns A generator of LLMResponses
   */
  public abstract generateContentAsync(
    llmRequest: LLMRequest,
    stream?: boolean
  ): AsyncGenerator<LLMResponse, void, unknown>

  /**
   * Creates a streaming connection to the LLM
   */
  public abstract connect(
    llmRequest: LLMRequest,
    stream?: boolean
  ): BaseLLMConnection
}
