---
date: 2026-08-24
title: Claude Code Loves appy.fyi
tags: [appy.fyi, claude_code]
image: out/ClaudeCode-191-100.png
video: out/ClaudeCode-4-5.mp4
# check my writing, fix and improve
abstract: |
    appy.fyi has a claude code plugin!
    You can build a full Android app with just a single prompt.
---

appy.fyi finds the app; the [`appy` Claude Code plugin](https://github.com/appy-fyi/appy-plugin) builds it. That's the part I want to talk about here — the plugin, and how much of the gap between "here's a report" and "here's an app on your phone" it actually closes.

## Claim it, build it

Every report on the feed ends with a "Build this" button. Click it and you've claimed that opportunity — appy.fyi hands you a `build-spec.json` and the exact command to run next: `/appy:build <origin_play_id>`. That one command is the "single prompt" — it fetches the spec, drops the project into its own subfolder, and hands off to the `appy` skill to do the actual work. Claim more than one, and it builds them in parallel, one subfolder each.

## What "build" actually means

The skill scaffolds a real Gradle/Compose project, implements every screen and data model in the spec, wires up Google Play's In-App Review and Play Integrity APIs, writes the test plan as real tests, and generates a launcher icon from the spec's design tokens — no placeholder, no AI image call, just deterministic code. `/appy:publish` then walks through the one-time Play Console setup and uses the Play Developer API itself to push the build to internal testing and create the billing products.

## Where it stops on purpose

It doesn't go all the way to "live on the Play Store" by itself, and that's deliberate. Trademark clearance, privacy-claim verification, the Play Console account itself, and the final promotion to production stay human-only gates. The plugin gets you to a working, tested, listable app — you decide whether to actually ship it.

That's close enough to "one prompt" that it changes what a report on the feed means: not just an idea, but a claimed, buildable starting point. [Take a look at today's reports →](https://appy.fyi/feed)
