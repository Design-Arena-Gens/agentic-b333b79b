import { NextResponse } from "next/server";
import { searchNews } from "@/lib/news";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { topic, limit } = (await request.json()) as {
      topic?: string;
      limit?: number;
    };

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Le champ 'topic' est requis." },
        { status: 400 }
      );
    }

    const articles = await searchNews(topic, limit);

    return NextResponse.json({ articles });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "La récupération des articles a échoué." },
      { status: 500 }
    );
  }
}
