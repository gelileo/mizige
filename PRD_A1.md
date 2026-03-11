# PRD Amendment: Stroke Order Guide Feature

## Feature Name

Stroke Order Guide

---

# 1. Overview

This amendment introduces a **Stroke Order Guide** feature to the Chinese Character Practice Sheet Generator.

The feature displays a **visual sequence of strokes** used to construct each Chinese character. The stroke sequence is shown above the handwriting practice row, allowing learners to understand the correct **stroke order and character construction**.

The stroke guide presents **progressively built characters**, where each cell adds the next stroke until the character is complete.

Example conceptual progression:

```
stroke 1
stroke 1 + stroke 2
stroke 1 + stroke 2 + stroke 3
...
final character
```

This visual sequence helps learners understand how the character is written step by step.

---

# 2. Goals

The Stroke Order Guide feature aims to:

- Teach correct Chinese stroke order.
- Help learners understand how characters are constructed.
- Provide a clear visual reference before handwriting practice begins.

---

# 3. User Stories

**User Story 1**

As a learner, I want to see the order of strokes used to write a character so that I can write it correctly.

**User Story 2**

As a teacher, I want stroke order to appear above each practice row so that students can follow the correct writing sequence.

**User Story 3**

As a user, I want the ability to toggle stroke order visibility so that I can simplify worksheets if needed.

---

# 4. Functional Requirements

## 4.1 Stroke Sequence Rendering

The system must generate a stroke sequence for each Chinese character.

Each step in the sequence should display the character with **one additional stroke added**.

Example for a character with strokes:

```
S1, S2, S3, S4
```

The generated sequence will be:

```
Frame 1 = S1
Frame 2 = S1 + S2
Frame 3 = S1 + S2 + S3
Frame 4 = S1 + S2 + S3 + S4
```

Each frame must be rendered as an individual grid cell.

---

## 4.2 Stroke Guide Placement

The stroke order sequence must appear **above the corresponding practice row** for the character.

Layout structure:

```
Stroke order guide
-------------------
Practice cells row
```

Example layout:

```
[Stroke1] [Stroke2] [Stroke3] [Stroke4] [Final]

[Reference] [Trace] [Trace] [Blank] [Blank]
```

---

## 4.3 Stroke Rendering Source

Stroke data must be sourced from a dataset containing **stroke path information and stroke order**.

Recommended dataset:

- Make Me a Hanzi

Each character record should include:

```
character
stroke paths
stroke order
```

---

## 4.4 Maximum Stroke Frames

Some characters contain a large number of strokes. To prevent layout overflow, the system must support limiting the number of displayed frames.

If the number of strokes exceeds the maximum frame limit:

- only the first N strokes are displayed
- the final frame displays the completed character

Example:

```
max frames = 8
```

Sequence example:

```
Stroke1
Stroke2
Stroke3
Stroke4
Stroke5
Stroke6
Stroke7
Final Character
```

---

## 4.5 Configuration Options

The following configuration options must be supported:

### Show Stroke Order

Toggle control:

```
ON / OFF
```

Default value:

```
ON
```

---

### Maximum Stroke Frames

User-configurable range:

```
4 – 12
```

Default value:

```
8
```

---

# 5. UI Requirements

## Stroke Guide Layout

Each stroke frame should appear inside a **small Tianzige grid cell**.

Grid features:

- outer border
- vertical center line
- horizontal center line
- optional diagonal guide lines

Stroke color should be dark for visibility.

Previously drawn strokes must remain visible in subsequent frames.

---

## Visual Hierarchy

Stroke guide cells should be **smaller than practice cells** to visually indicate they are instructional references rather than writing spaces.

Suggested size relationship:

```
stroke guide cell ≈ 50–60% of practice cell size
```

---

# 6. Performance Requirements

The stroke guide must not significantly impact worksheet generation performance.

Performance targets:

- stroke sequence generation for one character: < 50 ms
- full worksheet generation with stroke guides: < 1 second for 50 characters

---

# 7. Future Enhancements

Potential improvements to the Stroke Order Guide feature:

- animated stroke order preview
- stroke number labels
- stroke direction arrows
- interactive stroke playback
- highlighting the next stroke during tracing practice
