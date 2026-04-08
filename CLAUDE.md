# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

No build step. Open `index.html` directly in a browser. There are no dependencies, bundlers, or package managers.

## Architecture

**Slekskapp** is a vanilla JS/HTML/CSS family tree editor. All state lives in global variables; there is no framework.

### Global State
- `window.people` — the `EntryManager` instance, holds all people
- `window.currentPerson` — the currently selected `Entry`

### Key Classes (loaded via `<script>` tags in `index.html`)
- `js/classes/Entry.js` — a person. Fields: `name [first, middle, last]`, `age [birthYear, deathYear]`, `mother`/`father`/`spouse` as **live object references** (not IDs). Empty relationship = `{}`.
- `js/classes/EntryManager.js` — manages the `entries` array. Handles add/delete/search, plus load/save (JSON file) and autosave/autoload (localStorage).

### Tree Rendering (`js/tree/`)
The tree renders into `#rightPanel` using absolutely-positioned `<div>` nodes:
1. `drawTree(ego)` — erases existing nodes, finds the paternal ancestor via `ego.ancestor`, gets the full `familyTree` (array of generations), then calls `drawNode()` recursively.
2. `drawNode()` — creates nodes via `newNode()`, positions them using `lastNode` and `genX[]` globals for layout tracking.
3. `drawLines()` — called after all nodes are placed; draws connector `<div>` lines for marriage (horizontal) and parent-child (vertical + horizontal) relationships.
4. `centreEgo(ego)` — scrolls the ego's node into view and adds the `.ego` CSS class.

### Search (`js/interface/search.js`)
Two search UIs share `people.find()`:
- **Toolbar search** (`#searchBox`) — finds and selects a person, redraws the tree centred on them.
- **Form relationship inputs** (`#fatherInput`, `#motherInput`, `#spouseInput`) — type-ahead dropdowns that store the selected `Entry` object on `field.personObject`. Green border = linked, red = unlinked.

### Data Serialization
Relationships are live object references in memory. On save/autosave, references are serialized to IDs. On load, a two-pass approach reconstructs references: first pass creates all `Entry` objects, second pass replaces ID strings with object references.

### Formatting
Prettier is configured (2-space indent, no tabs — see `.prettierrc`).
