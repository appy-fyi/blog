---
date: 2026-08-24
title: Building appy.fyi
tags: [appy.fyi, google_play]
image: img/intro.jpg
video: out/GooglePlay.mp4
# check my writing, fix and improve
abstract: |
     I wasn't sure what to build, so I started an experiment: appy.fyi.
     It scans the Google Play Store for apps that are stumbling — a price hike, a broken release, a dropped feature — and turns the complaints into a report: what broke, the receipts, and a build-or-skip verdict, sized for a solo builder.

     Now all I have to do is pick one and build it.

     Will it work? What do you think?
---

I build small things to see what happens. This time the thing I built decides what I should build next.

## The idea

Every day, thousands of people leave one-star reviews on Google Play apps because something changed and it made their life worse: a price went up, an update broke a feature they relied on, a beloved app got abandoned. Buried in that noise is a signal — a group of users who want something specific enough that a solo developer could build it in a few weeks and have a real shot at winning them over.

appy.fyi goes looking for that signal on purpose.

## How it works

Every morning it crawls a slice of the Play Store, pulls fresh reviews and rating history, and looks for apps with a visible crack: a rating that's been sliding, a burst of complaints pointing at the same thing. When it finds one, an LLM reads the reviews and turns them into a report — what changed, the verbatim complaints that prove it, how that app compares to its closest competitor, and a rough estimate of how long a rebuild would take and what it might earn. Each report ends with a verdict: build it, or skip it, and the one fact that made the call.

New reports land on [the feed](https://appy.fyi/feed) every day.

## What's next

I didn't build appy.fyi to build apps for me — I built it to stop guessing. Instead of staring at a blank page trying to invent an idea, I can scroll a feed of ideas that are already backed by real, angry (or hopeful) users and just pick one.

Whether that turns out to be a shortcut or a trap, I don't know yet. That's the experiment.

Will it work? [Take a look and tell me what you think →](https://appy.fyi/feed)
