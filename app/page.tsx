'use client';

import { useCallback, useMemo, useState } from "react";

interface Article {
  id: string;
  title: string;
  link: string;
  published: string;
  source: string;
  snippet: string;
}

const formatDate = (iso: string) => {
  if (!iso) return "Date inconnue";
  const date = new Date(iso);
  if (Number.isNaN(date.valueOf())) return "Date inconnue";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
};

export default function Home() {
  const [topic, setTopic] = useState("intelligence artificielle");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [postingId, setPostingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const hasResults = useMemo(() => articles.length > 0, [articles]);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/search-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic, limit: 8 })
      });

      const payload = (await response.json()) as {
        articles?: Article[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Impossible de récupérer les news.");
      }

      setArticles(payload.articles ?? []);
    } catch (error) {
      setArticles([]);
      setErrorMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [topic]);

  const sendToTelegram = useCallback(async (article: Article) => {
    setPostingId(article.id);
    setErrorMessage(null);
    setSuccessMessage(null);

    const message = `<b>${article.title}</b>\n${article.source} · ${formatDate(
      article.published
    )}\n${article.snippet}\n\n${article.link}`;

    try {
      const response = await fetch("/api/post-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Envoi Telegram échoué.");
      }

      setSuccessMessage("Article publié sur Telegram.");
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setPostingId(null);
    }
  }, []);

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          padding: "1.5rem",
          borderRadius: "1rem",
          background:
            "linear-gradient(135deg, rgba(37,99,235,0.35), rgba(59,130,246,0.15))",
          border: "1px solid rgba(59,130,246,0.35)",
          boxShadow: "0 18px 50px -25px rgba(59,130,246,0.65)"
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2.2rem" }}>
          Agent News → Telegram
        </h1>
        <p style={{ margin: 0, maxWidth: 600, lineHeight: 1.6 }}>
          Trouvez les dernières actualités pour votre sujet, générez un résumé
          instantané et publiez-le dans votre canal Telegram en un clic.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem"
          }}
        >
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Sujet des news (ex: crypto, IA, politique...)"
            style={{
              flex: "1 1 320px",
              padding: "0.85rem 1rem",
              borderRadius: "0.75rem",
              border: "1px solid rgba(148,163,184,0.35)",
              backgroundColor: "rgba(15,23,42,0.85)",
              color: "inherit"
            }}
          />
          <button
            type="button"
            disabled={loading}
            onClick={handleSearch}
            style={{
              padding: "0.85rem 1.5rem",
              borderRadius: "0.75rem",
              border: "none",
              background:
                "linear-gradient(160deg, rgba(16,185,129,0.9), rgba(34,197,94,0.9))",
              color: "#0f172a",
              fontWeight: 600,
              cursor: loading ? "progress" : "pointer",
              transition: "transform 0.2s ease"
            }}
          >
            {loading ? "Recherche..." : "Rechercher"}
          </button>
        </div>
        {errorMessage && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              backgroundColor: "rgba(248,113,113,0.15)",
              border: "1px solid rgba(248,113,113,0.4)"
            }}
          >
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              backgroundColor: "rgba(74,222,128,0.15)",
              border: "1px solid rgba(74,222,128,0.4)"
            }}
          >
            {successMessage}
          </div>
        )}
      </header>

      <section style={{ display: "grid", gap: "1.25rem" }}>
        {hasResults ? (
          articles.map((article) => (
            <article
              key={article.id}
              style={{
                borderRadius: "1rem",
                padding: "1.25rem",
                backgroundColor: "rgba(15,23,42,0.9)",
                border: "1px solid rgba(148,163,184,0.2)",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem"
                }}
              >
                <h2 style={{ margin: 0, fontSize: "1.35rem" }}>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {article.title}
                  </a>
                </h2>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(148,163,184,0.8)",
                    whiteSpace: "nowrap"
                  }}
                >
                  {article.source}
                </span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.6 }}>{article.snippet}</p>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(148,163,184,0.65)"
                }}
              >
                {formatDate(article.published)}
              </span>
              <button
                type="button"
                onClick={() => sendToTelegram(article)}
                disabled={postingId === article.id}
                style={{
                  alignSelf: "flex-start",
                  marginTop: "0.5rem",
                  padding: "0.7rem 1.2rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.9), rgba(14,165,233,0.9))",
                  color: "#0b1120",
                  fontWeight: 600,
                  cursor: postingId === article.id ? "progress" : "pointer"
                }}
              >
                {postingId === article.id
                  ? "Publication en cours..."
                  : "Publier sur Telegram"}
              </button>
            </article>
          ))
        ) : (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              borderRadius: "1rem",
              border: "1px dashed rgba(148,163,184,0.35)",
              color: "rgba(148,163,184,0.8)"
            }}
          >
            Lancez une recherche pour voir les dernières actualités.
          </div>
        )}
      </section>
    </main>
  );
}
