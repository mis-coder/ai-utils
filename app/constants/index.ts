import { RouteCredentialMap } from "../lib/types";

export const menuItems = [
  {
    id: 0,
    name: "Home",
    url: "/",
  },
  {
    id: 1,
    name: "Basic Chat",
    url: "/basic-chat",
  },
  {
    id: 2,
    name: "Audio Scribe",
    url: "/audio-scribe",
  },
  {
    id: 3,
    name: "Doc Chat",
    url: "/doc-chat",
  },
  {
    id: 4,
    name: "Imagene",
    url: "/imagene",
  },
];

export const supportedAudioMimeTypes = [
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "video/mp4",
  "video/webm",
];

export const supportedAudioFileTypes = [
  ".mp3",
  ".mpga",
  ".mpeg",
  ".m4a",
  ".wav",
  ".mp4",
  ".webm",
];

export const supportedTextFileTypes = [".pdf"];

export const supportedTextMimeTypes = ["application/pdf"];

export const API_KEYS = {
  OPENAI_API_KEY: "OPENAI_API_KEY",
  PINECONE_API_KEY: "PINECONE_API_KEY",
  PINECONE_INDEX: "PINECONE_INDEX",
  HUGGING_FACE_ACCESS_TOKEN: "HUGGING_FACE_ACCESS_TOKEN",
} as const;

export const API_KEY_FIELD_LABELS = {
  [API_KEYS.OPENAI_API_KEY]: "OpenAI API Key",
  [API_KEYS.HUGGING_FACE_ACCESS_TOKEN]: "Hugging Face Token",
  [API_KEYS.PINECONE_API_KEY]: "Pinecone API Key",
  [API_KEYS.PINECONE_INDEX]: "Pinecone Index Name",
};

export const ROUTE_CREDENTIAL_REQUIREMENTS: RouteCredentialMap = {
  "/basic-chat": {
    requiredKeys: [API_KEYS.OPENAI_API_KEY],
    title: "Enter your OpenAI API Key",
    description:
      "You can get your OpenAI API Key from https://platform.openai.com/account/api-keys",
  },
  "/audio-scribe": {
    requiredKeys: [API_KEYS.OPENAI_API_KEY],
    title: "Enter your OpenAI API Key",
    description:
      "You can get your OpenAI API Key from https://platform.openai.com/account/api-keys",
  },
  "/doc-chat": {
    requiredKeys: [
      API_KEYS.OPENAI_API_KEY,
      API_KEYS.PINECONE_API_KEY,
      API_KEYS.PINECONE_INDEX,
    ],
    title: "Enter the required API keys",
    description: `
      • OpenAI Key: https://platform.openai.com/account/api-keys  
      • Pinecone API Key and Index: https://app.pinecone.io
    `,
  },
  "/imagene": {
    requiredKeys: [API_KEYS.HUGGING_FACE_ACCESS_TOKEN],
    title: "Enter your Hugging Face Access Token",
    description:
      "You can get your access token from https://huggingface.co/settings/tokens",
  },
};
