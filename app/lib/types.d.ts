export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}


export type SupportedRoute =
  | "/basic-chat"
  | "/audio-scribe"
  | "/doc-chat"
  | "/imagene";
  
export type CredentialKey =
  | "OPENAI_API_KEY"
  | "PINECONE_API_KEY"
  | "PINECONE_INDEX"
  | "HUGGING_FACE_ACCESS_TOKEN";

export interface RouteCredentialConfig {
  requiredKeys: CredentialKey[];
  title: string;
  description: string;
}

export type RouteCredentialMap = {
  [key in SupportedRoute]: RouteCredentialConfig;
};