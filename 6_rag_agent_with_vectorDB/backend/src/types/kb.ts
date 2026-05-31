export interface KBChunk {
  namespace: string; // logical grouping -> default

  source: string; // policy.pdf

  chunkId: number;

  text: string;

  embedding: number[]; //store in mongodb for vector search (1536)
}

// citation/source
//agentAnaswer
