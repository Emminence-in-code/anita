import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ========== POSTS / POEMS / JOURNAL ==========

export const getPosts = async (filters = {}) => {
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  if (filters.is_favorite !== undefined) {
    query = query.eq('is_favorite', filters.is_favorite);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getPostById = async (id) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createPost = async (post) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([post])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePost = async (id, updates) => {
  const { data, error } = await supabase
    .from('posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePost = async (id) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const toggleFavorite = async (id, currentValue) => {
  return updatePost(id, { is_favorite: !currentValue });
};

// ========== MOODS ==========

export const getMoods = async (startDate = null, endDate = null) => {
  let query = supabase
    .from('moods')
    .select('*')
    .order('mood_date', { ascending: false });

  if (startDate) {
    query = query.gte('mood_date', startDate);
  }

  if (endDate) {
    query = query.lte('mood_date', endDate);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getMoodByDate = async (date) => {
  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .eq('mood_date', date)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
};

export const createMood = async (mood) => {
  const { data, error } = await supabase
    .from('moods')
    .insert([mood])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateMood = async (id, updates) => {
  const { data, error } = await supabase
    .from('moods')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const upsertMood = async (mood) => {
  const { data, error } = await supabase
    .from('moods')
    .upsert(mood, { onConflict: 'mood_date' })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ========== WRITING PROMPTS ==========

export const getRandomPrompt = async () => {
  const { data, error } = await supabase
    .from('writing_prompts')
    .select('*')
    .eq('is_used', false)
    .limit(10);

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
};

export const markPromptUsed = async (id) => {
  const { error } = await supabase
    .from('writing_prompts')
    .update({ is_used: true, used_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
};

// ========== PHOTOS ==========

export const getPhotos = async (filters = {}) => {
  let query = supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.album) {
    query = query.eq('album', filters.album);
  }

  if (filters.is_favorite !== undefined) {
    query = query.eq('is_favorite', filters.is_favorite);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createPhoto = async (photo) => {
  const { data, error } = await supabase
    .from('photos')
    .insert([photo])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePhoto = async (id, updates) => {
  const { data, error } = await supabase
    .from('photos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePhoto = async (id) => {
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// ========== IDEAS ==========

export const getIdeas = async (filters = {}) => {
  let query = supabase
    .from('ideas')
    .select('*')
    .eq('is_archived', filters.showArchived || false)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createIdea = async (idea) => {
  const { data, error } = await supabase
    .from('ideas')
    .insert([idea])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateIdea = async (id, updates) => {
  const { data, error } = await supabase
    .from('ideas')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteIdea = async (id) => {
  const { error } = await supabase
    .from('ideas')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const toggleIdeaPin = async (id, currentValue) => {
  return updateIdea(id, { is_pinned: !currentValue });
};

export const toggleIdeaArchive = async (id, currentValue) => {
  return updateIdea(id, { is_archived: !currentValue });
};

// ========== FILE UPLOADS ==========

export const uploadFile = async (bucket, file, path = null) => {
  const fileName = path || `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return { path: data.path, publicUrl };
};

export const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
};

// Helper: Upload multiple files
export const uploadMultipleFiles = async (bucket, files) => {
  const uploads = files.map(file => uploadFile(bucket, file));
  return Promise.all(uploads);
};
