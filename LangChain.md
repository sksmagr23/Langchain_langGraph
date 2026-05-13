# LangChain Fundamentals

---

## 1. Why LangChain? (Raw SDK vs LangChain)

| Feature | Raw SDK | LangChain |
|---|---|---|
| Multiple model providers | ❌ Manual for each | ✅ Built-in abstraction |
| Prompt management | ❌ DIY | ✅ Prompt templates |
| Output parsing | ❌ Manual | ✅ Structured parsers |
| Tools / Retrievers | ❌ Complex wiring | ✅ Ready-made utilities |
| Retries / Logging | ❌ Must build yourself | ✅ Handled out of the box |
| Refactoring / Switching models | ❌ Painful | ✅ Minimum code change |

> **Key takeaway:** Raw SDK = fine for tiny demos. LangChain = production-grade toolkit for real apps.

---

## 2. Core Building Blocks (The Big 3)

### 🔹 1. Prompt — *"What to ask and how"*
- Not just a plain string — it's a **template**
- Contains:
  - **System role** — sets context/persona for the model
  - **Instructions** — what the model should do
  - **Placeholders** — slots for dynamic variables (e.g., `{query}`, `{context}`)
- Goals: **predictable**, **reusable**, **readable**

### 🔹 2. Model — *"Which AI to call"*
- LangChain wraps models as **Chat Model Wrappers**
- Lets you **swap providers** (e.g., OpenAI → Gemini) with **minimal code changes**
- Attach configs easily:
  - `temperature`
  - `top_p`
  - `max_tokens`

### 🔹 3. Output Parser — *"How to turn text into data"*
- Avoids dealing with raw/unpredictable text responses
- Use **Structured Output** for JSON responses
- Use **Zod** to define a schema → pass to the LLM → get back validated structured data

```
User Query → Prompt Template → LLM → Output Parser → Structured Data ✅
```

---

## 3. Runnables & LCEL

### 🔹 What is a Runnable?
> A **generic unit of work** that can be: invoked, batched, streamed, or sequenced.

```
Runnable = takes INPUT → does something → returns OUTPUT
```

Every step in your LLM pipeline is a Runnable:
- Prompt Template → **Runnable**
- Model Call → **Runnable**
- Output Parser → **Runnable**

---

### 🔹 What is LCEL? *(LangChain Expression Language)*
- A **pipeline/chain** that **connects Runnables together cleanly**
- Key methods:
  - `.pipe()` — chains one Runnable's output into the next
  - `.invoke()` — runs the full chain with an input

```js
// Conceptual example
const chain = promptTemplate.pipe(model).pipe(outputParser);
const result = await chain.invoke({ query: "What is AI?" });
```

---

### 🔹 Runnable Sequence
- Runs steps **one after another, in order**
- Output of step A → becomes Input of step B → becomes Input of step C…

```
Step A → Step B → Step C → Step D → Final Output
```

> Think of it like a factory assembly line — each station depends on the previous one.

---

### 🔹 Runnable Map
- Runs **multiple branches in parallel**
- Useful when steps are independent of each other

```
          ┌─── Branch 1 ───┐
Input ────┤                ├──── Combined Output
          └─── Branch 2 ───┘
```

---

## Quick Memory Cheat Sheet

```
LangChain = Toolkit (not just a wrapper)

Big 3:
  Prompt   → Template with role + instructions + placeholders
  Model    → Chat wrapper, swap providers easily
  Output   → Structured via Zod schema

Runnable  → Any single step (input → process → output)
LCEL      → Glue that connects Runnables (.pipe())
  Sequence → A → B → C (output of prev = input of next)
  Map      → A + B run in parallel
```

---
