import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function loadAndSplitPDF(file: File) {
  const loader = new PDFLoader(file);

  const documents = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocuments = await splitter.splitDocuments(documents);
  return splitDocuments;
}
