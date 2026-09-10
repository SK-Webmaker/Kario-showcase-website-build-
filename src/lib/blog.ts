import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Post = Tables<"blog_posts">;
export type Author = Tables<"authors">;

export async function fetchPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("posts fetch failed", error.message);
    return [];
  }
  return data ?? [];
}

export async function fetchPost(
  slug: string,
): Promise<{ post: Post | null; author: Author | null }> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .limit(1);

  if (error || !data?.[0]) return { post: null, author: null };
  const post = data[0];

  let author: Author | null = null;
  if (post.author_id) {
    const { data: rows } = await supabase
      .from("authors")
      .select("*")
      .eq("id", post.author_id)
      .limit(1);
    author = rows?.[0] ?? null;
  }
  return { post, author };
}

/**
 * A deliberately small markdown reader: headings, lists, and paragraphs.
 * Enough for the posts these pages carry, with no library and no HTML
 * injection — everything is rendered as text nodes by the caller.
 */
export type Block =
  | { kind: "h2" | "h3" | "p"; text: string }
  | { kind: "ul"; items: string[] };

export function parseMarkdown(body: string | null): Block[] {
  if (!body) return [];
  const blocks: Block[] = [];
  let list: string[] = [];

  const flush = () => {
    if (list.length > 0) {
      blocks.push({ kind: "ul", items: list });
      list = [];
    }
  };

  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (line === "") {
      flush();
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      list.push(line.slice(2).trim());
      continue;
    }
    flush();
    if (line.startsWith("### ")) blocks.push({ kind: "h3", text: line.slice(4) });
    else if (line.startsWith("## ")) blocks.push({ kind: "h2", text: line.slice(3) });
    else blocks.push({ kind: "p", text: line.replace(/^#\s+/, "") });
  }
  flush();
  return blocks;
}
