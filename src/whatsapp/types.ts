// WhatsApp message types and interfaces

export interface IncomingMessage {
  from: string; // phone number (e.g., "5511999999999")
  name?: string; // push name from WhatsApp
  messageId: string;
  timestamp: number;
  type: MessageType;
  text?: string;
  image?: MediaContent;
  video?: MediaContent;
  audio?: MediaContent;
  document?: MediaContent;
  location?: LocationContent;
  contact?: ContactContent;
  interactive?: InteractiveResponse;
  buttonReply?: ButtonReplyContent;
  listReply?: ListReplyContent;
  flowReply?: FlowReplyContent;
}

export type MessageType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "document"
  | "location"
  | "contact"
  | "interactive"
  | "button_reply"
  | "list_reply"
  | "flow_reply"
  | "reaction"
  | "sticker";

export interface MediaContent {
  id: string;
  url?: string;
  mimeType: string;
  caption?: string;
  filename?: string;
}

export interface LocationContent {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface ContactContent {
  name: string;
  phone: string;
}

export interface InteractiveResponse {
  type: "button_reply" | "list_reply" | "nfm_reply";
  buttonReply?: ButtonReplyContent;
  listReply?: ListReplyContent;
  nfmReply?: FlowReplyContent;
}

export interface ButtonReplyContent {
  id: string;
  title: string;
}

export interface ListReplyContent {
  id: string;
  title: string;
  description?: string;
}

export interface FlowReplyContent {
  flowId: string;
  screenId: string;
  data: Record<string, unknown>;
}

// Outgoing message types

export interface TextMessage {
  type: "text";
  text: string;
}

export interface ButtonMessage {
  type: "buttons";
  text: string;
  header?: string;
  footer?: string;
  buttons: Array<{
    id: string;
    title: string; // max 20 chars
  }>;
}

export interface ListMessage {
  type: "list";
  text: string;
  buttonText: string;
  header?: string;
  footer?: string;
  sections: Array<{
    title: string;
    rows: Array<{
      id: string;
      title: string; // max 24 chars
      description?: string; // max 72 chars
    }>;
  }>;
}

export interface ImageMessage {
  type: "image";
  url: string;
  caption?: string;
}

export interface DocumentMessage {
  type: "document";
  url: string;
  filename: string;
  caption?: string;
}

export interface LocationMessage {
  type: "location";
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface ContactMessage {
  type: "contact";
  name: string;
  phone: string;
}

export interface CarouselMessage {
  type: "carousel";
  header: string;
  cards: Array<{
    imageUrl?: string;
    body: string;
    buttons: Array<{
      id: string;
      title: string;
    }>;
  }>;
}

export interface FlowMessage {
  type: "flow";
  text: string;
  flowId: string;
  flowAction: "navigate" | "data_exchange";
  screenId?: string;
  data?: Record<string, unknown>;
  buttonText: string;
  header?: string;
  footer?: string;
}

export type OutgoingMessage =
  | TextMessage
  | ButtonMessage
  | ListMessage
  | ImageMessage
  | DocumentMessage
  | LocationMessage
  | ContactMessage
  | CarouselMessage
  | FlowMessage;

// Conversation state

export type ConversationState =
  | "idle"
  | "main_menu"
  | "onboarding"
  | "onboarding_name"
  | "onboarding_roles"
  | "onboarding_sports"
  | "onboarding_city"
  | "tournaments"
  | "tournament_detail"
  | "tournament_create"
  | "betting"
  | "bet_select_match"
  | "bet_place"
  | "challenges"
  | "challenge_create"
  | "challenge_search_opponent"
  | "social"
  | "social_create_post"
  | "gcoins"
  | "gcoins_buy"
  | "gcoins_transfer"
  | "profile"
  | "profile_edit"
  | "leaderboard"
  | "notifications"
  | "settings"
  | "help"
  | "ai_chat";

export interface UserSession {
  phone: string;
  userId?: string; // DB user id once authenticated
  state: ConversationState;
  stateData: Record<string, unknown>; // temp data for multi-step flows
  lastActivity: number;
  menuRetries: number;
  language: "pt" | "en";
}
