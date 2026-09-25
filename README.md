# My Game Backlog

My Game Backlog is a simple web application for tracking video games I want to play, am currently playing, or have completed. It was created for the Engineering Design 2 assignment.

## Technologies Used

- HTML
- CSS
- JavaScript
- Supabase

## Features

The application supports:

- Adding games to the backlog
- Viewing saved games
- Editing game information
- Deleting games

## Supabase Database

The application uses the existing `public.games` table in Supabase. The table contains these columns:

| Column | Type | Description |
| --- | --- | --- |
| `id` | `int8` | Primary key |
| `title` | `text` | Game title |
| `platform` | `text` | Gaming platform |
| `status` | `text` | Current game status |
| `rating` | `int2` | Game rating from 1 to 10 |
| `notes` | `text` | Additional notes about the game |

Row Level Security is enabled for the table. Public `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies are in place for this class project.

The Supabase project URL and publishable/anon key are configured at the top of `script.js`.
