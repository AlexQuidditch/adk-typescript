// Export agents
// Initialize providers
import './llm/registry/providers'

export { BaseAgent } from './agents/base/BaseAgent'
export { Agent } from './agents/specialized/Agent'
// More specialized agents would be added here

// Export LLM infrastructure
export { BaseLLM } from './llm/BaseLLM'
export { BaseLLMConnection } from './llm/BaseLLMConnection'
export { LLMRegistry } from './llm/registry/LLMRegistry'

// Export memory services
export {
  BaseMemoryService,
  ListSessionOptions,
  MemoryResult,
  SearchMemoryOptions,
  SearchMemoryResponse,
  Session,
  SessionState,
} from './memory'
export {
  InMemoryMemoryService,
  InMemorySessionService,
  PersistentMemoryService,
  SessionService,
} from './memory'

// Export auth
export { AuthConfig } from './models/auth/AuthConfig'
export {
  ApiKeyCredential,
  AuthCredential,
  AuthCredentialType,
  BasicAuthCredential,
  BearerTokenCredential,
  OAuth2Credential,
} from './models/auth/AuthCredential'
export { AuthHandler } from './models/auth/AuthHandler'
export {
  ApiKeyScheme,
  AuthScheme,
  AuthSchemeType,
  HttpScheme,
  OAuth2Scheme,
  OpenIdConnectScheme,
} from './models/auth/AuthScheme'
export { RunConfig, StreamingMode } from './models/config/RunConfig'
export { InvocationContext } from './models/context/InvocationContext'

export { ToolContext } from './models/context/ToolContext'
export { FunctionDeclaration, JSONSchema } from './models/request/FunctionDeclaration'
// Export models
export { LLMRequest, Message, MessageContent, MessageRole } from './models/request/LLMRequest'
export { FunctionCall, LLMResponse, ToolCall } from './models/response/LLMResponse'

export * as tools from './tools'

// Export tools
export { BaseTool } from './tools/base/BaseTool'

// Version
export const version = '0.1.0'
