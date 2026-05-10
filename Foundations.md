# Foundations of LangGraph & LangChain

---

## 1. Modern AI Applications Architecture

Modern AI applications are generally built using **3 major layers**:

```
User → UI → Orchestration Layer → Models & Tools
```

---

## 2. Three Core Layers

### 2.1 UI Layer (User Interface)

The UI layer is anything the user interacts with.

**Examples:**
- Chat applications
- Dashboards
- SaaS buttons
- CLI tools
- Mobile interfaces

> The user never communicates directly with the LLM. The UI acts as the mediator.

---

### 2.2 Orchestration Layer

The orchestration layer is the **brain + wiring** of the AI application.

**Responsibilities:**
- Choosing which model to call
- Selecting tools/APIs
- Deciding whether to search the web, use RAG, or query databases
- Combining multiple steps into workflows

**This is where LangChain, LangGraph, and custom logic usually exist.**

---

### 2.3 Models & Tools Layer

**Models:**
- OpenAI
- Gemini
- Grok
- Local LLMs

**Tools:**
- Web search
- Database queries
- Internal APIs
- Vector databases
- Calculators

---

## 3. Overall Flow of a Modern AI App

```
User
  ↓
UI Layer
  ↓
Orchestration Layer
  ↓
Models + Tools
```

---

## 4. What is an AI Agent?

> An AI agent is an LLM-powered program that can use tools, inspect context, and decide the next action based on rules or goals.

### Agent = `LLM + Memory + Tools + Rules`

**An agent can:**
- Inspect context
- Use tools
- Make decisions
- Repeat steps
- Ask for approvals
- Generate final answers

---

## 5. Agent Workflow

```
User Request
      ↓
     Agent
      ↓
 ┌───────────────┐
 │ Check Context │
 │ Call Tools    │
 │ Draft Answer  │
 │ Ask Approval  │
 │ Repeat Steps  │
 └───────────────┘
      ↓
Final Response
```

---

## 6. Example: Support Agent

### Flow

```
User Message
      ↓
Agent
      ↓
Search Knowledge Base
      ↓
Read Previous Conversation History
      ↓
Draft Reply with Citations
      ↓
Human Approval (Optional)
      ↓
Final Response
```

### Key Concepts Used

| Concept | Details |
|---------|---------|
| **Tools** | Knowledge base search, APIs, Retrieval systems |
| **Context** | Previous chat history, User information, Conversation memory |
| **Rules** | Always provide citations, Ask approval before sending, Retry if rejected |

---

## 7. Chains vs Agents

### Chains

> Chains are **fixed pipelines with predefined steps**. There are no decisions.

**Characteristics:**
- Deterministic flow
- Sequential execution
- Predefined steps
- No reasoning about what to do next

**Example: Basic Chain**
```
User Input
    ↓
Add System Prompt
    ↓
Call Model
    ↓
Return Answer
```

**Example: RAG Chain**
```
Retrieve Documents
       ↓
Build Prompt with Documents
       ↓
Call Model
       ↓
Return Answer
```

> A chain does **NOT** ask: "Should I search?", "Should I use RAG?", "Should I call a tool?" — everything is already predefined.

---

### Agents

> Agents **dynamically decide** the next action.

**Characteristics:**
- Decision-making
- Context-aware
- Tool selection
- Adaptive workflows

**Example Agent Flow:**
```
User Input
     ↓
Agent Decision
     ↓
 ┌─────────────────────┐
 │ Is query simple?    │
 └─────────────────────┘
      ↓ Yes                   ↓ No
Direct Answer         Call Tool / Search / RAG
                              ↓
                    Additional Decisions
                              ↓
                        Final Output
```

---

## 8. Chains vs Agents — Key Difference

| Feature | Chains | Agents |
|--------|--------|--------|
| Steps | Fixed | Dynamic |
| Reasoning | None | Context-aware |
| Flow | Predictable | Adaptive |
| Debugging | Easier | More complex |
| Best for | Deterministic tasks | Complex workflows |

---

## 9. Rule of Thumb

**Use Chains when:**
- The workflow is fixed
- Steps are predictable
- No dynamic decisions needed

**Use Agents when:**
- Tools must be selected dynamically
- Context matters
- Workflows change at runtime
- Multi-step reasoning is required

---

## 10. What is LangChain?

> LangChain is a **toolkit for building LLM-powered workflows**.

**LangChain provides:**
- Prompt management
- Model wrappers
- Tool integrations
- API calling utilities
- RAG utilities
- Vector store integrations
- Workflow chaining

**Major Advantage — Consistent Interface Across Models:**
```
OpenAI ↔ Gemini ↔ Grok ↔ Local Models
```
You can switch providers easily.

**LangChain in Architecture:**
```
UI
 ↓
LangChain Orchestration
 ↓
Models / Tools / Vector DB
```

---

## 11. What is LangGraph?

> LangGraph is a **graph-based orchestration framework** for agent workflows.

**LangGraph helps manage:**
- Multi-step agents
- Stateful workflows
- Loops
- Branching logic
- Approvals
- Retries
- Long-running flows

**LangGraph Position in Stack:**
```
UI
 ↓
LangGraph
 ↓
LangChain
 ↓
Models / APIs / Tools
```

---

## 12. LangChain vs LangGraph

| Feature | LangChain | LangGraph |
|--------|-----------|-----------|
| Primary Role | Builds steps | Controls workflow execution |
| Scope | Tool integrations | Orchestrates agent flow |
| Utilities | Prompt + model utilities | Stateful graph execution |
| Structure | Linear pipelines | Complex branching systems |

---

## 13. Core Concepts in LangGraph

### 13.1 State
A shared object carrying:
- Input
- Intermediate results
- Approvals
- Errors
- Outputs

### 13.2 Nodes
Small functions or execution units. Examples:
- Search node
- Summarization node
- Approval node

### 13.3 Edges
> Edges decide **which node executes next** based on the current state.

### LangGraph Full Flow

```
UI
 ↓
Graph Definition
 ├─ State
 ├─ Nodes
 └─ Control Flow
      ↓
LangChain
      ↓
Models / APIs / Tools
```

---

## 14. JSON-First Approach

### Problem with Raw Text Responses

Beginners often write huge prompts and manually parse paragraphs, creating:
- Difficult testing
- Fragile parsing
- Poor frontend/backend integration

### Correct Mindset

> Treat LLM responses as **DATA**, not paragraphs.

### Why JSON First?

JSON responses are:
- Predictable
- Structured
- Testable
- Easy to validate
- Easy to integrate

### Recommended Practice

Ask models to return:

```json
{
  "answer": "...",
  "sources": [],
  "confidence": 0.92
}
```

instead of plain text.

---

## 15. Schema Validation with Zod

Use **Zod** to validate:
- Inputs
- Outputs
- Response structure

**Benefits of Zod:**
- Strong validation
- Type safety
- Better debugging
- Reliable integrations
- Safer production systems

---

## 16. Final Mental Model

```
User
 ↓
UI
 ↓
LangGraph  (workflow orchestration)
 ↓
LangChain  (LLM toolkit)
 ↓
Models + Tools
```

---
