import type { RunConfig } from '../../models/config/RunConfig'
import type { Message } from '../../models/request/LLMRequest'

export interface RunOptions {
  messages: Message[]
  config?: RunConfig
  sessionId?: string
}

/**
 * Base class for all agents in the Agent Development Kit
 */
export abstract class BaseAgent<R = any, RO = RunOptions> {
  /**
   * The agent's name
   * Agent name must be a unique identifier within the agent tree
   */
  public name: string

  /**
   * Description about the agent's capability
   * The LLM uses this to determine whether to delegate control to the agent
   */
  public description: string

  /**
   * The parent agent of this agent
   * Note that an agent can ONLY be added as sub-agent once
   */
  public parentAgent?: BaseAgent<R, RO>

  /**
   * The sub-agents of this agent
   */
  public subAgents: BaseAgent<R, RO>[]

  /**
   * Constructs a new BaseAgent
   */
  public constructor(config: {
    name: string
    description: string
  }) {
    this.name = config.name
    this.description = config.description
    this.subAgents = []

    // Validate agent name
    if (!/^[a-z_]\w*$/i.test(this.name)) {
      throw new Error(`Invalid agent name: ${this.name}. Agent name must be a valid identifier.`)
    }

    if (this.name === 'user') {
      throw new Error('Agent name cannot be "user", since it\'s reserved for end-user\'s input.')
    }
  }

  /**
   * Gets the root agent of the agent tree
   */
  public get rootAgent(): BaseAgent<R, RO> {
    return this.parentAgent ? this.parentAgent.rootAgent : this
  }

  /**
   * Adds a sub-agent to this agent
   */
  public addSubAgent(agent: BaseAgent<R, RO>): BaseAgent<R, RO> {
    if (agent.parentAgent) {
      throw new Error(
        `Agent ${agent.name} already has a parent agent ${agent.parentAgent.name}. `
        + 'An agent can only be added as a sub-agent once.',
      )
    }

    // Check for duplicate names
    if (this.findSubAgent(agent.name)) {
      throw new Error(`Sub-agent with name ${agent.name} already exists.`)
    }

    this.subAgents.push(agent)
    agent.parentAgent = this

    return this
  }

  /**
   * Finds a sub-agent by name
   */
  public findSubAgent(name: string): BaseAgent<R, RO> | undefined {
    return this.subAgents.find(agent => agent.name === name)
  }

  /**
   * Finds an agent in the agent tree by name
   */
  public findAgent(name: string): BaseAgent<R, RO> | undefined {
    if (this.name === name) {
      return this
    }

    for (const subAgent of this.subAgents) {
      const found = subAgent.findAgent(name)
      if (found) {
        return found
      }
    }

    return undefined
  }

  /**
   * Runs the agent with the given messages and configuration
   */
  public abstract run(options: RO): Promise<R>

  /**
   * Runs the agent with streaming support
   */
  public abstract runStreaming(options: RO): AsyncIterable<R>
}
