import type { BaseLLM } from '../BaseLLM'

/**
 * Type for LLM constructor with static methods
 */
interface LLMClass {
  new (model: string): BaseLLM
  supportedModels: () => string[]
}

/**
 * Registry for LLMs
 */
export class LLMRegistry {
  /**
   * Map of model name regex to LLM class
   */
  private static llmRegistry: Map<RegExp, LLMClass> = new Map()

  /**
   * Creates a new LLM instance
   *
   * @param model The model name
   * @returns The LLM instance
   */
  public static newLLM(model: string): BaseLLM {
    const LlmProvider = LLMRegistry.resolve(model)
    if (!LlmProvider) {
      throw new Error(`No LLM found for model: ${model}`)
    }

    return new LlmProvider(model)
  }

  /**
   * Resolves the LLM class from the model name
   *
   * @param model The model name
   * @returns The LLM class
   */
  public static resolve(model: string): LLMClass | null {
    for (const [regex, llmClass] of LLMRegistry.llmRegistry.entries()) {
      if (regex.test(model)) {
        return llmClass
      }
    }

    return null
  }

  /**
   * Registers a new LLM class
   *
   * @param modelNameRegex The regex to match model names
   * @param llmClass The LLM class
   */
  public static register(modelNameRegex: string, llmClass: LLMClass): void {
    LLMRegistry.llmRegistry.set(new RegExp(modelNameRegex), llmClass)
  }

  /**
   * Registers all model patterns from an LLM class
   *
   * @param llmClass The LLM class
   */
  public static registerLLM(llmClass: LLMClass): void {
    const modelPatterns = llmClass.supportedModels()

    for (const pattern of modelPatterns) {
      LLMRegistry.register(pattern, llmClass)
    }
  }

  /**
   * Logs all registered models for debugging
   */
  public static logRegisteredModels(): void {
    console.log('Registered LLM models:')
    for (const [regex, llmClass] of LLMRegistry.llmRegistry.entries()) {
      console.log(`  - Pattern: ${regex.toString()}`)
    }
  }
}
