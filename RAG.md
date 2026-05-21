# RAG (Retrieval Augmented Generation)

---

## 1. What is RAG?

**Retrieval Augmented Generation** — a technique that grounds LLM answers in a specific knowledge base rather than relying on the model's training data alone.

**Core idea:** First find relevant text → then answer. This prevents blind guessing.

### Three-Step Flow

| Step | What happens |
|------|-------------|
| **Retrieve** | Fetch the most relevant text chunks from the knowledge base (KB) based on the user query |
| **Augment** | Attach those chunks to the prompt as context for the LLM |
| **Generate** | LLM answers using only that context — not open-ended guessing |

> **Analogy:** Instead of "LLM, tell me anything" → you say "LLM, here are 5 relevant chunks from our docs — answer using only these."

---

## 2. Two Phases of RAG

### Phase 1 — Ingestion (Prepare the Knowledge)

Takes raw source material and makes it searchable.

```
Sources (docs, FAQs, policies, PDFs)
  → Clean
  → Split into chunks
  → Convert chunks to embeddings (vectors)
  → Store in vector DB or in-memory store
```

### Phase 2 — Query (Use the Knowledge to Answer)

```
User types a question
  → Convert question into an embedding
  → Find the most similar chunks in the store
  → Build a prompt with those chunks as context
  → LLM generates a final answer
  → Return answer to user
```

---

## 3. Chunking

Instead of storing a full document as one giant string, split it into smaller pieces.

**Why?** Every LLM has a context window limit — you can't feed 100 pages at once.

**Typical chunk size:** 500–1000 characters (commonly 800–1000)

### Overlap — Why It Matters

When splitting, consecutive chunks share a small overlapping region.

```
Full text:  A B C D E F G H I J K L M N ...
Chunk 1:    A B C D E F G H
Chunk 2:          F G H I J K L M        ← overlap on F G H
Chunk 3:                J K L M N O P Q  ← overlap on J K L M
```

**Why overlap?** Without it, the LLM loses context at chunk boundaries. The overlap ensures the model understands where one chunk ends and the next begins — preventing broken or incomplete answers.

**Typical overlap:** ~150 characters

---

## 4. Embeddings

**Definition:** A vector (list of numbers) that represents the *meaning* of a piece of text.

- All chunks are embedded during **ingestion**
- The user query is also embedded at **query time**
- Similarity between query embedding and chunk embeddings is used to find relevant chunks

> Embeddings capture *semantic meaning*, not just keyword matches. Two sentences that mean the same thing will have similar vectors even if they use different words.

---

## 5. Vector Store

The storage layer that holds all chunk embeddings and enables similarity search.

### What gets stored

| Field | Description |
|-------|-------------|
| `id` | Unique identifier for the chunk |
| `embedding` | The vector (list of numbers) |
| `metadata` | Source, page number, section, tags, etc. |

### Two Types

| Type | Use case |
|------|----------|
| **In-memory** | Simple demos, local tools, small projects |
| **External DB** | Production apps (e.g., Supabase, MongoDB Vector, Pinecone, etc.) |

### Key Mental Model

> **Vector store = a search index for *meaning*, not just text.**

When a user query comes in, its embedding is compared against stored embeddings. The closest matches are retrieved and passed to the LLM as context.

---

## 6. Full RAG Flow (Combined)

```
[Ingestion]
Documents → Chunk → Embed → Store in Vector DB

[Query]
User Query → Embed Query → Similarity Search in Vector DB
           → Top-K Chunks → Build Prompt with Context
           → LLM → Final Answer → User
```

---
