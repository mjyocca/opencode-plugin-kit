---
name: update-opencode-docs
description: Use when updating local reference docs to sync with upstream opencode documentation. Fetches latest from opencode.ai/docs/ and GitHub source, compares with local markdown files, and identifies what needs updating.
---

# Update OpenCode Reference Docs

Keep local reference documentation in sync with upstream OpenCode docs and source code.

## When to Use This Skill

- Local docs are out of date with upstream
- New SDK methods, hooks, or APIs are added to OpenCode
- Ecosystem page has new plugins/projects
- Plugin architecture changes upstream
- User explicitly asks to update or sync docs
- Planning a major refactor and need latest API surface

## Files Managed by This Skill

| Local File | Upstream Source |
|------------|-----------------|
| `docs/instructions/opencode-plugin-architecture.md` | https://opencode.ai/docs/plugins/ |
| `docs/instructions/sdk-reference.md` | https://opencode.ai/docs/sdk/ |
| `docs/instructions/ecosystem-reference.md` | https://opencode.ai/docs/ecosystem/ |

## Workflow

### Step 1: Fetch Latest Upstream Docs

Use WebFetch to get the current state of upstream docs:

```bash
# Fetch key pages
WebFetch https://opencode.ai/docs/sdk/
WebFetch https://opencode.ai/docs/plugins/
WebFetch https://opencode.ai/docs/ecosystem/
```

### Step 2: Check SDK Package for New APIs

Check the installed SDK types to see if new methods exist:

```bash
# Read current SDK types
Read node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts

# Check plugin types
Read node_modules/@opencode-ai/plugin/dist/index.d.ts
```

### Step 3: Compare with Local Docs

**For SDK changes:**
- Check if new methods in `client.app.*`, `client.session.*`, etc. are documented
- Check if new hook types exist in the plugin package
- Check if TUI API (`api.*`) has new surfaces

**For plugin architecture changes:**
- Check for new event types
- Check for new hooks
- Check for new config sections

**For ecosystem changes:**
- Check for new plugins in the official list
- Check for new projects
- Check for new agents

### Step 4: Identify What Needs Updating

Create a checklist of changes:

**SDK Reference (`sdk-reference.md`):**
- [ ] New `client.*` methods
- [ ] New hook signatures
- [ ] New TUI API surfaces
- [ ] New event types
- [ ] New structured output features

**Plugin Architecture (`opencode-plugin-architecture.md`):**
- [ ] New hooks in the Hooks table
- [ ] New events in Event Reference
- [ ] New config sections
- [ ] New slot types
- [ ] Deprecated features to remove

**Ecosystem Reference (`ecosystem-reference.md`):**
- [ ] New notable plugins (check for 100+ stars or official mention)
- [ ] New projects
- [ ] New agents
- [ ] Deprecated/archived projects to remove

### Step 5: Update Local Docs

**For each identified change:**

1. **Add new API methods** — Follow existing patterns:
   ```markdown
   #### `client.newApi.method()`
   
   Description of what it does.
   
   ```ts
   const result = await client.newApi.method({
     param: "value",
   })
   ```
   
   **Parameters:** ...
   **Response:** ...
   ```

2. **Add new hooks** — Add to both Hooks table and detailed section:
   ```markdown
   | Hook | Purpose |
   |------|---------|
   | `new.hook` | What it does |
   ```

3. **Add new ecosystem entries** — Use consistent format:
   ```markdown
   | Plugin | Description | GitHub |
   |--------|-------------|--------|
   | new-plugin | What it does | [org/repo](https://github.com/org/repo) |
   ```

4. **Update upstream reference links** — If source locations change:
   ```markdown
   | Resource | URL |
   |----------|-----|
   | New resource | https://... |
   ```

### Step 6: Verify Changes

After updating:

1. **Check cross-references:**
   ```bash
   grep -n "](\./" docs/instructions/*.md
   ```

2. **Check for broken links:**
   ```bash
   # Look for any malformed markdown links
   grep -E "\]\([^)]*$" docs/instructions/*.md
   ```

3. **Verify upstream links are current:**
   ```bash
   grep -E "https://(opencode\.ai|github\.com/anomaly)" docs/instructions/*.md
   ```

4. **Check table formatting:**
   - All tables have proper headers
   - All table rows have the same number of columns

### Step 7: Document What Changed

Create a summary of changes made:

```markdown
## Docs Update Summary

### SDK Reference
- Added `client.newApi.*` methods (5 new methods)
- Added `experimental.new.hook` hook signature
- Updated TUI API with `api.newSurface`

### Plugin Architecture
- Added 3 new event types to Event Reference
- Updated Available Hooks table
- Added deprecation notice for `old.hook`

### Ecosystem Reference
- Added 12 new plugins
- Added 4 new projects
- Removed 2 archived projects

### Upstream References
- Updated SDK source link to new package structure
- Added link to new OpenAPI spec location
```

## Common Update Scenarios

### Scenario 1: New SDK Method Added

**Detection:**
```bash
# Check SDK types for new methods
grep "class.*extends _HeyApiClient" node_modules/@opencode-ai/sdk/dist/gen/sdk.gen.d.ts
```

**Action:**
1. Add method to SDK Reference under appropriate section
2. Add usage example from official docs
3. Update method table in Plugin Architecture if it's a commonly-used method

### Scenario 2: New Hook Added

**Detection:**
```bash
# Check plugin types for new hooks
grep "^\s*\".*\..*\"?:" node_modules/@opencode-ai/plugin/dist/index.d.ts
```

**Action:**
1. Add to Hooks table in Plugin Architecture
2. Add detailed hook signature in SDK Reference
3. Add to lib/hooks.ts and lib/hook-types.ts if using the derived types pattern

### Scenario 3: New Ecosystem Plugin

**Detection:**
- WebFetch https://opencode.ai/docs/ecosystem/ and compare with local ecosystem-reference.md

**Action:**
1. Add to appropriate category in Ecosystem Reference
2. Include GitHub link, description
3. Add to "Notable plugins" in Plugin Architecture if it's widely used

### Scenario 4: Breaking Change Upstream

**Detection:**
- Method signature changed
- Hook parameters changed
- Deprecated feature removed

**Action:**
1. Update method signatures in SDK Reference
2. Add migration notes if breaking
3. Update examples to use new API
4. Add deprecation notices with removal timeline

## Maintenance Schedule

**Suggested update frequency:**
- After major OpenCode releases (monthly)
- When adding new SDK dependencies to package.json
- When users report docs are out of sync
- Before publishing this plugin template to npm

## Quick Commands

```bash
# Fetch all upstream docs at once
WebFetch https://opencode.ai/docs/sdk/ && \
WebFetch https://opencode.ai/docs/plugins/ && \
WebFetch https://opencode.ai/docs/ecosystem/

# Check SDK version
cat node_modules/@opencode-ai/sdk/package.json | grep version

# Count current documented methods
grep "^####.*client\." docs/instructions/sdk-reference.md | wc -l

# List all upstream reference links
grep -h "https://opencode.ai\|https://github.com/anomaly" docs/instructions/*.md | sort -u
```

## Troubleshooting

**Problem:** WebFetch returns stale content

**Solution:** Use `livecrawl: "preferred"` option in WebFetch to bypass cache

---

**Problem:** Can't find new method in SDK types

**Solution:** Check if SDK package needs updating:
```bash
pnpm update @opencode-ai/sdk
```

---

**Problem:** Upstream docs restructured, links broken

**Solution:** Update all upstream reference links in both docs files, verify with WebFetch

---

## Related Skills

- `plugin-server` — Understanding server plugin hooks to document correctly
- `plugin-tui` — Understanding TUI plugin API to document correctly
- `opencode-troubleshooting` — Debugging issues that arise from doc/reality mismatches
