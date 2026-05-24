// why we actually chunk
// it searches *chunks* of the text, small enough but at the same big enough so that it contains full ide/definition

// TODO:- slice a long piece of text into smaller chunks, and then create a document object for each chunk, and then return an array of document objects

import { Document } from "@langchain/core/documents";

export const CHUNK_SIZE = 1000;
export const CHUNK_OVERLAP = 150;

// text -> markdown, article, policy
// sources -> what is his name ? -> saksham (source #0)
// return array of document objects

// chunksize=10, overlap=3 and text=ABCDEFGHIJNKMKL
// step -> chunksize -  overlap = 7
// start=0 -> slice[0:10] = ABCDEFGHIJ chunk #0
// start=7 -> slice [7:17]= HIJNKMKL... chunk #1

export function chunkText(text: string, source: string): Document[] {
  const clean = (text ?? "").replace(/\r\n/g, "\n");

  const docs: Document[] = [];

  if (!clean.trim()) return docs;
  
  const step = Math.max(1, CHUNK_SIZE - CHUNK_OVERLAP);

  let start = 0;
  let chunkId = 0;

  while (start < clean.length) {
    const end = Math.min(clean.length, start + CHUNK_SIZE);

    // remove leading/trailing blank lines
    const slice = clean.slice(start, end).trim();

    if (slice.length > 0) {
      docs.push(
        new Document({
          pageContent: slice,
          metadata: {
            source,
            chunkId,
          },
        })
      );
      // next chunk will get the next id
      chunkId += 1;
    }

    start += step;
  }

  return docs;
}
