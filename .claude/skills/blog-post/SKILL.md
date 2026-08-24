---
name: blog-post
description: Turn a blog/*.md file that has only frontmatter into a complete short blog post, polish its abstract into a LinkedIn-ready caption, and make sure its 4:5 video and 1.91:1 image renders exist in out/.
---

# Blog post

Fleshes out a stub post in `blog/` — a file that currently has only YAML
frontmatter and no body — into a short, finished blog post, polishes the
`abstract` field into a caption fit for posting on LinkedIn, and makes sure
the video/image it references have actually been rendered.

## 0. Pick the target file

If the user didn't name a file, list `blog/*.md` and find ones whose only
content is the frontmatter block (nothing meaningful after the closing
`---`). If more than one qualifies, ask the user which one. If the named/only
candidate already has a real body, ask before overwriting it — don't
silently replace existing writing.

## 1. Read the frontmatter

Expected fields (see `blog/intro.md` for a finished example):

- `date`, `title`, `tags`
- `image` — path like `out/<Base>-191-100.png`
- `video` — path like `out/<Base>-4-5.mp4`
- `abstract` — a multi-line YAML block (`|`) that is the thesis/seed for the
  post **and** doubles as its LinkedIn caption — see step 4, which rewrites
  it

Leave the rest of the frontmatter exactly as written, including any stray
comment line inside it (e.g. `# check my writing, fix and improve`) for now
— step 4 is what acts on that comment. Don't touch `date`, `title`, `tags`,
`image`, or `video`.

## 2. Work out what needs to be rendered

This repo's convention (see `src/Root.tsx`): a composition base name has up
to two registered sizes, one per aspect ratio, named `<Base>-<w>-<h>` where
`w-h` is the aspect ratio (not literal pixels):

- `<Base>-4-5` → 1080×1350 (4:5, portrait) → renders the `video`
- `<Base>-191-100` → 1910×1000 (1.91:1, landscape) → renders the `image`

Derive `<Base>` and the two composition ids from the `image`/`video`
filenames. If they don't follow this pattern, stop and ask the user what
composition/aspect ratio each file should come from.

For each of the two output files under `out/`:

1. If the file already exists, skip it.
2. Otherwise check `src/Root.tsx` for a `<Composition id="<Base>-4-5">` /
   `<Composition id="<Base>-191-100">` entry.
   - **Both the component and this size are already registered** → go to
     step 3 (render).
   - **The component exists (`src/compositions/<Base>.tsx`) but this
     particular size isn't registered yet** — this is the common case (e.g.
     a composition was built at 4:5 only). Open the component and check
     whether it derives its layout from `useVideoConfig()`'s `width`/
     `height` proportionally, the way `GooglePlay.tsx` does (`scale = min(width,
     height)/1080`, fractional point coordinates) — or whether it's built
     from fixed pixel/`em` values, the way `ClaudeCode.tsx` and `Outro.tsx`
     are.
     - If it's proportional/adaptive: add the missing `<Composition>` entry
       to `src/Root.tsx` reusing the same component at the new width/height
       (1910×1000 or 1080×1350 per above), matching `durationInFrames`/`fps`
       of its sibling entry.
     - If it's built from fixed values (won't just work at a very different
       aspect ratio without redesigning the layout): **stop and ask the
       user** how they want to handle it — adapt the component to scale
       proportionally, design a distinct layout for that aspect ratio, or
       point the post at a different existing composition. Don't guess at a
       redesign.
   - **Neither the component nor any composition exists** → stop and ask the
     user. Building a new animation from scratch is a separate creative
     task (see the `remotion-create` skill / `todo.txt` workflow), not
     something to improvise as a side effect of writing a post.
3. Render it. `remotion.config.ts` (Rspack bundler, Tailwind) is not read by
   the CLI, so pass equivalent flags explicitly — load the `remotion-render`
   skill for the exact current invocation rather than assuming, but as of
   this writing that's:
   - video: `bunx remotion render <Base>-4-5 out/<Base>-4-5.mp4 --rspack`
   - image (still): `bunx remotion still <Base>-191-100 out/<Base>-191-100.png --rspack`

   Confirm both output files exist and are non-empty afterward. If you're
   not sure a render looks right, load the `remotion-studio` skill and
   preview the composition instead of guessing.

If you edited `src/Root.tsx` or any composition file, run `bun run lint`
before moving on.

## 3. Research the facts

The video content is generated for **https://appy.fyi**, whose project
lives at `~/Work/appy.fyi`. Before writing anything, read enough of it to
back every claim the post makes:

- `~/Work/appy.fyi/CLAUDE.md` and `README.md` for the shape of the product
- `~/Work/appy.fyi/plugin/README.md` for the Claude Code plugin specifically
- `~/Work/appy.fyi/lib/`, `job/`, `web.ts` for how things actually work, if
  the post is making a claim specific enough to need it

Use the post's `tags` to point the research (e.g. `claude_code` →
`plugin/`; `google_play` → the `job/` review/report pipeline). Treat the
frontmatter `abstract` as the thesis, not gospel — if it asserts something
you can't verify in the appy.fyi project (or that looks stale/wrong), don't
silently soften or embellish it: ask the user.

## 4. Fix the abstract and make it LinkedIn-ready

The `abstract` is the seed for the post body (step 5) but it's also what
gets posted to LinkedIn as the caption, so it needs its own pass, separate
from the long-form body.

Rewrite it whether or not the `# check my writing, fix and improve` comment
is present — treat that comment as an explicit ask for a rewrite, not just a
proofread, when it's there. Using what you learned in step 3:

- Fix anything genuinely wrong: grammar, awkward phrasing, and any claim
  that's vague, stale, or unsupported by the appy.fyi project. Don't
  invent new claims the abstract didn't already make — tighten and correct,
  don't pad.
- Shape it for LinkedIn specifically:
  - **Hook first.** LinkedIn truncates behind "…see more" after roughly the
    first 140 characters — the opening line or two must stand alone and
    earn the click.
  - **Plain text only.** LinkedIn doesn't render Markdown — no `##`,
    `**bold**`, or `[text](url)` links. If a URL matters, spell it out
    (e.g. `appy.fyi/feed`) rather than markdown-linking it.
  - **Short lines, blank line between them.** Dense paragraphs read poorly
    in LinkedIn's feed; break it up the way the original abstracts already
    do.
  - **End with a hook for engagement** — a direct question or invite to
    comment, not just a trailing statement.
  - **3-5 relevant hashtags on their own line at the end**, derived from the
    post's `tags` field and general themes (e.g. `#buildinpublic`,
    `#indiehacker`).
  - **Length:** well under LinkedIn's 3,000-character cap — aim for roughly
    600-1,500 characters so it's scannable in the feed.
  - Keep the same first-person, direct voice as the rest of the post.

Replace the `abstract:` block's content in the frontmatter with the revised
text, keeping the same YAML `|` block style and indentation as the
original. Once you've acted on it, remove the
`# check my writing, fix and improve` comment line — it's a resolved
instruction now, not something to leave dangling for next time.

If the original abstract already reads well, is factually solid, and is
already shaped for LinkedIn (short lines, a hook, no markdown), light edits
are fine — don't rewrite for the sake of rewriting.

## 5. Write the body

Match the voice, structure, and length of `blog/intro.md`: first person,
short paragraphs, a small number of `##` sections, no filler, ends with a
link (usually to `https://appy.fyi/feed`, or a more specific page if the
post is about one). This is a **short** post — a few sections is enough, not
an exhaustive writeup.

Append the body directly below the closing `---` of the frontmatter (there
should already be one blank line there). Don't touch the frontmatter beyond
the `abstract` edit already made in step 4.

## 6. Report

Summarize what was rendered (or already existed), confirm the post body was
written, and show how the abstract changed (or note that it was left mostly
as-is and why). If anything was ambiguous enough to ask about along the way,
that question — not a guess — is the point of this skill.
