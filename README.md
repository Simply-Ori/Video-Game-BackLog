# Video-Game-BackLog
Simple web application that tracks a user's video game backlog

## Supabase setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor and run:

```sql
create table public.games (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	platform text not null,
	status text not null check (status in ('want-to-play', 'playing', 'completed')),
	rating integer not null check (rating between 1 and 10),
	notes text
);

alter table public.games enable row level security;

create policy "Anyone can read games"
	on public.games for select
	to anon
	using (true);

create policy "Anyone can add games"
	on public.games for insert
	to anon
	with check (true);

create policy "Anyone can edit games"
	on public.games for update
	to anon
	using (true)
	with check (true);

create policy "Anyone can delete games"
	on public.games for delete
	to anon
	using (true);
```

3. Copy the project URL and browser-safe publishable/anon key from Supabase.
4. Replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY` at the top of `script.js`.

The current policies make the backlog public because authentication has not been added yet. Never put a Supabase service-role key in browser code. Add authentication and user-specific policies before using this for private data.
