# DATA
| Query | Where | Rendering / refresh | Why |
|---|---|---|---|
| Home averages | Server | ISR, revalidate 60s + revalidatePath after writes | Same for everyone |
| /item/[slug] | Server | SSG via generateStaticParams + ISR; dynamicParams=false | Fixed list of items, public data |
| /budget | Server fetch, client interaction | ISR; Planner is a client component | Prices are shared; slider state is per-user UI |
| /my | Server | Dynamic (reads cookie) | Per-user data |
Client components hold only UI state and call Server Actions; none fetch data.

**Storage:** local JSON file (`lib/db.js`). On Vercel it is `/tmp`, so it is temporary. Sample data comes from `data/seed.json` until the first save.
