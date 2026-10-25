# AUTH
| Private route | Layer 1 middleware | Layer 2 page | Layer 3 action |
|---|---|---|---|
| /my | no cookie → /signin?next= | getUser() verifies JWT + user exists | addPrice and deletePrice call getUser(); deletePrice also checks ownerId |
Cookie: httpOnly, sameSite=lax, secure in production, 7 days. Passwords hashed with bcrypt.

## The three attacks
1. Signed out: `deletePrice(id)` → 'Unauthenticated' (lib/actions.js).
2. Signed in as another user: `deletePrice(theirId)` → 'Forbidden' (`row.ownerId !== user.id`). Sample rows belong to 'sample', so nobody can delete them.
3. `/signin?next=https://example.com` → `safeNext()` (lib/auth.js) falls back to /my.
