# LLM Fundamentals — Simplified Notes

---

## 1. Tokens, Cost & Context Window

### What is a Token?
An LLM does not read raw characters the way humans do. Instead, it reads **tokens** — chunks of text, where roughly **1 token ≈ 3–4 English characters**. So the phrase "top ten places to visit" becomes a series of tokens, not individual letters.

### What is a Context Window?
The context window is the **maximum number of tokens an LLM can consider at one time**. Think of it as the model's "working memory" — everything it can see in a single interaction. It includes:

- **System instructions** — the behaviour/role you've assigned to the model
- **User input** — what the user is currently typing
- **Chat history** — all previous messages in the conversation
- **Tool responses** — outputs from any external tools the model called
- **Model's own output** — the response it's generating

> If you exceed the context window limit, older parts of the conversation get **truncated (dropped)** automatically.

### Why Does This Matter in Production?
Two key production concerns arise from token usage:

**Cost:** More tokens in = more to read. More tokens out = more to generate. Both cost money. If you let users send unlimited context, your API bill grows fast.

**Latency:** The more tokens the model processes, the slower it gets. You've probably noticed ChatGPT slowing down after a very long conversation — this is exactly why.

### The Rule to Remember
> **Short, precise, and structured always beats long, random dumping.**

Keep your prompts lean. Control how much context you send. Don't paste entire databases into the prompt.

---

## 2. Sampling Knobs — Temperature, Top_p, and Max Tokens

These three parameters control *how* a model generates its output.

### Temperature — Stability vs. Creativity
Temperature is a value between **0 and 1** that controls how "creative" or "random" the model is.

| Range | Behaviour | Best For |
|---|---|---|
| `0 – 0.3` | Stable, deterministic, predictable | JSON output, tool calls, structured data |
| `0.7 – 1.0` | Creative, varied, exploratory | Brainstorming, research, open-ended writing |

For most production use with JSON or structured outputs, keep temperature at **0 or 0.2**.

### Top_p — Probability Mass Control
`top_p` controls how wide the model casts its net when choosing the next word. A value of `1.0` means it considers all possible words (simple default). A value of `0.9` tells it to ignore low-probability "long-tail" word choices, which is better for stable JSON.

> **Golden Rule:** Tune either `temperature` **or** `top_p` — not both at the same time.

### Max Tokens — The Hard Cap
`max_tokens` is a hard limit on how long the model's response can be. It does not affect quality — it just cuts off the output at that length.

Two reasons to always set this in production:
1. **Protect cost** — prevents runaway long responses from burning through your API budget.
2. **Keep responses concise** — forces focused answers.

For structured JSON outputs like `{ summary, confidence }`, a starting value of **256–1000 tokens** is reasonable.

> **Important:** High temperature **or** a tiny `max_tokens` are the two most common causes of malformed JSON output.

### Provider Naming Differences
The same knobs exist across all major LLM providers, but their names differ slightly:

| Parameter | OpenAI | Google Gemini | Ollama |
|---|---|---|---|
| Temperature | `temperature` | `generationConfig.temperature` | `options.temperature` |
| Top P | `top_p` | `generationConfig.topP` | `options.top_p` |
| Max Tokens | `max_tokens` | `generationConfig.maxOutputTokens` | `options.num_predict` |

---

## 3. Chat Models vs. Tool/JSON Models

Knowing *which type of model to use* is one of the most important decisions when building AI apps.

### Chat Models
Chat models are optimized for natural language conversation. They're great for:
- General Q&A ("What is React.js?")
- Summaries and explanations
- Plain language tasks that don't need external data

The catch: **they don't always give you a strictly formatted answer**. You might ask for JSON and get something almost-JSON, or JSON with extra text around it.

### Tool / JSON-Optimized Models
These models are specifically designed to **follow schemas and produce valid, structured JSON**. They can also **call functions** — like fetching a URL, querying a database, or running a web search — and chain those calls together in a decision loop:

```
Plan → Call Tool → Observe Result → Decide Next Step → Return Answer
```

### The Simple Decision Rule

| Situation | Use |
|---|---|
| Pure language task (explain, summarize, Q&A) | Chat Model |
| You need compact, valid JSON | Tool / JSON Model |
| You need to call external APIs or tools | Tool / JSON Model |
| You're building an agent that chains actions | Tool / JSON Model |

---

## 4. Zod Schemas — Contract for Typed JSON

### What is Zod?
Zod is a TypeScript/JavaScript library that lets you **define the exact shape** of the data you expect from the model. Think of it as a contract between your code and the LLM.

### Why Use Zod Instead of Just Saying "respond in JSON"?

When you just tell an LLM "respond in JSON", it might return valid JSON — but not in the format your application needs. With Zod, you say *exactly* what fields you need and what types they must be:

```typescript
// packages/shared/src/schema.ts
import { z } from 'zod'

export const JsonResponseSchema = z.object({
  summary: z.string(),      // A short, plain-English answer
  confidence: z.number()    // 0.0 to 1.0
})

export type JsonResponse = z.infer<typeof JsonResponseSchema>
```

### Key Benefits
Zod gives you three things at once:

1. **Runtime validation** — it checks the model's output at runtime and throws an error if the shape is wrong, instead of silently passing bad data into your app.
2. **TypeScript types** — the same schema automatically generates TypeScript types, so your IDE knows what shape to expect.
3. **One source of truth** — your schema defines what the model should return *and* what your code expects, eliminating any mismatch.

> To install: `pnpm add zod` (or `npm install zod`)

---

## 5. Structured Outputs

### The Core Idea
Structured output means telling the model to **fill a schema** — not just "respond in JSON" loosely, but to produce output that matches a specific, validated structure.

The flow is simple:
```
Schema Definition → Structured Output Mode → Predictable JSON
```

### Why This Is More Reliable Than "Please Respond in JSON"

If you just prompt a model with *"reply in JSON"*, a smart model *will* give you JSON — but it might add extra fields, use wrong types, or wrap it in markdown code fences. Structured output mode forces the model to only produce valid JSON that matches your defined schema, field by field.

### How to Use It (with LangChain)
In practice, you combine your Zod schema with `.withStructuredOutput()`:

```typescript
const structuredLLM = model.withStructuredOutput(JsonResponseSchema)
const result = await structuredLLM.invoke("Your question here")
// result is now guaranteed to be { summary: string, confidence: number }
```

### Summary of the Combination
- **Zod** defines and validates the shape of data.
- **Structured output mode** forces the model to follow that shape.
- Together, they give you **safe, predictable, type-checked JSON** from every model call.

---

## Quick Reference Cheatsheet

| Concept | One-Line Summary |
|---|---|
| Token | Chunk of ~3–4 characters that LLMs process |
| Context Window | Max tokens the model can see at once |
| Temperature | 0 = stable/JSON-safe, 1 = creative |
| Top_p | Controls word variety; tune one OR temp, not both |
| Max Tokens | Hard cap on response length; always set in production |
| Chat Model | Best for plain language tasks, no strict format |
| Tool/JSON Model | Best for structured output, agents, external API calls |
| Zod | TypeScript library to define and validate JSON shape |
| Structured Output | Forces the model to match your schema exactly |