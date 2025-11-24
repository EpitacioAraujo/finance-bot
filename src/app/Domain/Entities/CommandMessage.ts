export interface CommandMessage {
  id: string;
  from: string;
  contentType: "text" | "audio";
  content: string;
  audioPath: string | null;
  ["meta-data"]: any;
}
