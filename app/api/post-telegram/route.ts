import { NextResponse } from "next/server";
import { postToTelegram } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { message } = (await request.json()) as { message?: string };

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Le champ 'message' est requis." },
        { status: 400 }
      );
    }

    await postToTelegram(message);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message ?? "Erreur inconnue." },
      { status: 500 }
    );
  }
}
