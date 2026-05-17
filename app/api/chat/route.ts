import { generateAgentReply, type ChatMessage } from "@/lib/agent/respond";
import { NextResponse } from "next/server";

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;

function isValidMessages(value: unknown): value is ChatMessage[] {
  if (!Array.isArray(value)) return false;
  if (value.length === 0 || value.length > MAX_MESSAGES) return false;
  return value.every(
    (m) =>
      m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.length > 0 &&
      m.content.length <= MAX_CONTENT_LENGTH,
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: unknown };
    if (!isValidMessages(body.messages)) {
      return NextResponse.json(
        { error: "Некорректный формат сообщений" },
        { status: 400 },
      );
    }

    const { content, source } = await generateAgentReply(body.messages);

    return NextResponse.json({ content, source });
  } catch (error) {
    console.error("Chat API error", error);
    return NextResponse.json(
      { error: "Не удалось получить ответ. Попробуйте позже." },
      { status: 500 },
    );
  }
}
