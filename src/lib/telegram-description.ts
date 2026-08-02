/**
 * Public warehouse API currently has no description field.
 * For used items we recover the post text from the public Telegram embed page.
 */

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function toEmbedUrl(telegramLink: string): string | null {
  try {
    const url = new URL(telegramLink);
    if (!url.hostname.includes("t.me") && !url.hostname.includes("telegram.me")) {
      return null;
    }
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const channel = parts[0];
    const postId = parts[1];
    if (!/^\d+$/.test(postId)) return null;
    return `https://t.me/${channel}/${postId}?embed=1&mode=tme`;
  } catch {
    return null;
  }
}

export async function fetchTelegramDescription(
  telegramLink: string | null | undefined,
): Promise<string | null> {
  if (!telegramLink) return null;
  const embedUrl = toEmbedUrl(telegramLink);
  if (!embedUrl) return null;

  try {
    const response = await fetch(embedUrl, {
      headers: {
        Accept: "text/html",
        "User-Agent": "AppleShopStorefront/1.0",
      },
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;

    const html = await response.text();
    const match = html.match(
      /class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    );
    if (!match?.[1]) return null;

    const text = stripHtml(match[1]);
    if (text.length < 8) return null;
    return text;
  } catch {
    return null;
  }
}
