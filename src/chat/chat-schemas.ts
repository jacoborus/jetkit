import { z } from "zod";
import {
  // createInsertSchema,
  createSelectSchema,
} from "drizzle-zod";

import { chat as chatRepo } from "./chat-repo";

export const selectChatSchema = createSelectSchema(chatRepo);

export type Chat = z.infer<typeof chat>;
export const chat = selectChatSchema;

export type MessageFull = z.infer<typeof MessageFull>;
export const MessageFull = z.object({
  message: z.string(),
  id: z.string(),
  createdAt: z.string(),
  sender: z.object({
    name: z.string(),
    image: z.string().optional().nullable(),
  }),
});
