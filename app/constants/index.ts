export const menuItems = [
  {
    id: 0,
    name: "Home",
    url: "/",
  },
  {
    id: 1,
    name: "Basic Chatbot",
    url: "/chat",
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
    name: "Imagine",
    url: "/imagine",
  },
];

export const supportedAudioFileTypes = {
  "audio/mpeg": [".mp3", ".mpga", ".mpeg"],
  "audio/mp4": [".m4a"],
  "audio/wav": [".wav"],
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
};
