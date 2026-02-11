# Supabase Setup Guide for Anita's Creative Space

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project:
   - **Name**: `anita-creative-space`
   - **Database Password**: [Create a strong password and save it]
   - **Region**: Choose closest to your location
4. Wait for project to initialize (~2 minutes)

---

## Step 2: Get Your Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy these values (you'll need them for `.env` file):
   - **Project URL** (under Project URL)
   - **anon/public key** (under Project API keys)

---

## Step 3: Create Database Tables

Go to **SQL Editor** and run these SQL commands one by one:

### 1. Posts Table (for poems, drafts, published content)

```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'poem', -- 'poem', 'journal', 'idea'
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published'
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  media_urls TEXT[] DEFAULT '{}', -- Array of image/video URLs
  is_favorite BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0
);

-- Add index for faster queries
CREATE INDEX posts_status_idx ON posts(status);
CREATE INDEX posts_type_idx ON posts(type);
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);
```

### 2. Mood Tracker Table

```sql
CREATE TABLE moods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  mood_date DATE NOT NULL UNIQUE,
  mood_type TEXT NOT NULL, -- 'happy', 'sad', 'motivated', 'calm', 'anxious', etc.
  mood_intensity INTEGER CHECK (mood_intensity >= 1 AND mood_intensity <= 5),
  note TEXT,
  color TEXT NOT NULL
);

-- Index for date queries
CREATE INDEX moods_date_idx ON moods(mood_date DESC);
```

### 3. Writing Prompts Table

```sql
CREATE TABLE writing_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  prompt TEXT NOT NULL,
  category TEXT, -- 'nature', 'emotions', 'memories', 'dreams', etc.
  used_at TIMESTAMP WITH TIME ZONE,
  is_used BOOLEAN DEFAULT false
);
```

### 4. Photos Table

```sql
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  album TEXT,
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false
);

-- Index for faster queries
CREATE INDEX photos_album_idx ON photos(album);
CREATE INDEX photos_created_at_idx ON photos(created_at DESC);
```

### 5. Ideas Notebook Table

```sql
CREATE TABLE ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  color TEXT DEFAULT '#b76e79'
);

-- Index for faster queries
CREATE INDEX ideas_pinned_idx ON ideas(is_pinned);
CREATE INDEX ideas_archived_idx ON ideas(is_archived);
```

---

## Step 4: Set Up Storage Buckets

Go to **Storage** and create these buckets:

### 1. Create "post-media" Bucket

1. Click **New bucket**
2. Name: `post-media`
3. **Public bucket**: ✅ YES (check this box)
4. Click **Create bucket**

### 2. Create "photos" Bucket

1. Click **New bucket**
2. Name: `photos`
3. **Public bucket**: ✅ YES (check this box)
4. Click **Create bucket**

---

## Step 5: Set Up Storage Policies

For each bucket, you need to allow public access:

### For "post-media" bucket:

Go to **Storage** → **post-media** → **Policies** → **New Policy**

**Policy 1: Allow Public Upload**

```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'post-media');
```

**Policy 2: Allow Public Read**

```sql
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-media');
```

**Policy 3: Allow Public Delete**

```sql
CREATE POLICY "Allow public delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'post-media');
```

### For "photos" bucket:

Repeat the same three policies but replace `'post-media'` with `'photos'`

---

## Step 6: Enable Row Level Security (RLS)

For now, we'll disable RLS since this is a personal app. Run this in SQL Editor:

```sql
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE moods DISABLE ROW LEVEL SECURITY;
ALTER TABLE writing_prompts DISABLE ROW LEVEL SECURITY;
ALTER TABLE photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE ideas DISABLE ROW LEVEL SECURITY;
```

**Note:** For a production app, you'd want to enable RLS and add proper policies. Since this is personal, we're keeping it simple.

---

## Step 7: Seed Some Writing Prompts (Optional)

Add some initial writing prompts:

```sql
INSERT INTO writing_prompts (prompt, category) VALUES
  ('Write about a moment when time seemed to stand still', 'memories'),
  ('Describe the sound of rain using only metaphors', 'nature'),
  ('What does freedom mean to you?', 'emotions'),
  ('Write a letter to your future self', 'dreams'),
  ('Capture the feeling of a sunrise in words', 'nature'),
  ('Write about a place that feels like home', 'memories'),
  ('Describe happiness without using the word happy', 'emotions'),
  ('What would you tell your younger self?', 'dreams'),
  ('Write about the space between words', 'abstract'),
  ('Describe the color of a feeling', 'emotions');
```

---

## Step 8: Create .env File

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with what you copied from Step 2.

---

## ✅ Checklist

- [ ] Created Supabase project
- [ ] Copied Project URL and anon key
- [ ] Created all 5 tables (posts, moods, writing_prompts, photos, ideas)
- [ ] Created storage buckets (post-media, photos)
- [ ] Set up storage policies for both buckets
- [ ] Disabled RLS on all tables
- [ ] (Optional) Added writing prompts
- [ ] Created .env file with credentials
- [ ] Added .env to .gitignore

---

## 🎉 You're All Set!

Once you complete these steps, I'll be able to connect the frontend to Supabase and build out all the features!
