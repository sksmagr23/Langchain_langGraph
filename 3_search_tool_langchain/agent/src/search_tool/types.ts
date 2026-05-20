// 2 paths -> web, direct
// web path -> browse, summarize, source urls/ cite urls
// direct path -> LLM. no browsing

// shared shape -> candidate

export type candidate = {
  answer: string;
  sources: string[]; // []
  mode: "web" | "direct";
};
