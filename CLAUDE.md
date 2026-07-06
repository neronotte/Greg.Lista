# List@ — Shopping List App

## Project Overview

**List@** is a web-based shopping list app, deployed on Vercel.
Mobile-first: the primary use case is checking off items while walking through a supermarket.

## Repository Structure

```
Greg.Lista/          ← repo root (documentation)
  CLAUDE.md
  README.md
  src/               ← Next.js project (run npm commands from here)
    app/             ← Next.js App Router
    public/
    package.json
    next.config.ts
    tsconfig.json
    .env.local.example
```

> **Vercel**: set `src` as the Root Directory in project settings.

## Core Features

### List Management
- Create, edit, and delete named shopping lists
- Visibility: **private** (owner only) or **family** (all family members)
- Copy a list (to reuse it as a template)
- Each list contains items organized by product category (matching supermarket departments)

### Shopping Mode ("Modalità Spesa")
- Start a shopping session from any list
- Creates a timestamped **instance** of the list (tagged with date/time, user, and supermarket name)
- The original list remains untouched
- During shopping, items are checked off as purchased
- A shopping instance can be reopened to continue (e.g., partial shop at one store, rest at another)
- Instance visibility mirrors the parent list (private → owner only; family → all family members)

### Category Ordering
Items are automatically sorted by product category, aligned with typical supermarket department order:
1. Frutta e verdura
2. Pane e panificati
3. Carne e pesce
4. Salumi e formaggi
5. Latticini e uova
6. Surgelati
7. Dispensa (pasta, riso, conserve, olio, ecc.)
8. Bevande
9. Igiene e pulizia casa
10. Varie

### Families
- A user can create a **Family** and invite other users by email
- A user can belong to **multiple families**
- Family lists and instances are visible and editable by all family members

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Storage**: Supabase (free tier)
- **Auth**: Supabase Auth — Google OAuth (Facebook deferred)
- **Deployment**: Vercel

## Data Model

```
User                          -- managed by Supabase Auth
  id (uuid), email, displayName, avatarUrl

Family
  id, name, createdBy (userId), createdAt

FamilyMember
  familyId, userId, role (owner | member), joinedAt

FamilyInvite
  id, familyId, invitedEmail, token, status (pending | accepted | expired), createdAt

Category
  id, name, sortOrder

List
  id, name, ownerId (userId), familyId (nullable), visibility (private | family)
  createdAt, updatedAt

ListItem
  id, listId, name, categoryId, quantity?, unit?, notes?, sortOrder

ShoppingSession
  id, listId, startedAt, completedAt?, createdBy (userId), supermarket
  -- visibility derived from parent list

SessionEntry
  id, sessionId, listItemId, checked (bool), checkedAt?, checkedBy (userId)?
```

### Visibility rules
| List visibility | Who can see/edit the list | Who can use a session |
|---|---|---|
| private | owner only | owner only |
| family | all family members | all family members |

## Supabase Notes
- Row Level Security (RLS) enforces visibility at DB level
- OAuth redirect URLs configured for Google in Supabase dashboard
- `@supabase/ssr` used for Next.js App Router compatibility
- Migrations live in `src/supabase/migrations/`

## Development Notes
- UI must be mobile-first (phone in supermarket scenario)
- Shopping session state persisted in Supabase (survives page refresh)
- Multiple concurrent sessions from the same list are supported
