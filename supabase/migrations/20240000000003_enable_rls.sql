-- Enable Row Level Security on all tables
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FAMILIES TABLE POLICIES
-- ============================================

-- Users can view their own family
CREATE POLICY "Users can view their own family"
  ON families
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own family (onboarding)
CREATE POLICY "Users can create their own family"
  ON families
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own family
CREATE POLICY "Users can update their own family"
  ON families
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own family
CREATE POLICY "Users can delete their own family"
  ON families
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- MEMBERS TABLE POLICIES
-- ============================================

-- Users can view members of their family
CREATE POLICY "Users can view members of their family"
  ON members
  FOR SELECT
  USING (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

-- Users can insert members to their family
CREATE POLICY "Users can create members in their family"
  ON members
  FOR INSERT
  WITH CHECK (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

-- Users can update members of their family
CREATE POLICY "Users can update members of their family"
  ON members
  FOR UPDATE
  USING (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

-- Users can delete members of their family
CREATE POLICY "Users can delete members of their family"
  ON members
  FOR DELETE
  USING (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- HABITS TABLE POLICIES
-- ============================================

-- Users can view habits of their family
CREATE POLICY "Users can view habits of their family"
  ON habits
  FOR SELECT
  USING (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

-- Users can create habits in their family
CREATE POLICY "Users can create habits in their family"
  ON habits
  FOR INSERT
  WITH CHECK (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

-- Users can update habits of their family
CREATE POLICY "Users can update habits of their family"
  ON habits
  FOR UPDATE
  USING (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

-- Users can delete (soft delete) habits of their family
CREATE POLICY "Users can delete habits of their family"
  ON habits
  FOR DELETE
  USING (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- HABIT_LOGS TABLE POLICIES
-- ============================================

-- Users can view habit logs for members in their family
CREATE POLICY "Users can view habit logs of their family"
  ON habit_logs
  FOR SELECT
  USING (
    member_id IN (
      SELECT id FROM members
      WHERE family_id IN (
        SELECT id FROM families WHERE user_id = auth.uid()
      )
    )
  );

-- Users can insert habit logs for members in their family
CREATE POLICY "Users can create habit logs for their family"
  ON habit_logs
  FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT id FROM members
      WHERE family_id IN (
        SELECT id FROM families WHERE user_id = auth.uid()
      )
    )
    AND
    habit_id IN (
      SELECT id FROM habits
      WHERE family_id IN (
        SELECT id FROM families WHERE user_id = auth.uid()
      )
    )
  );

-- Users can update habit logs of their family
CREATE POLICY "Users can update habit logs of their family"
  ON habit_logs
  FOR UPDATE
  USING (
    member_id IN (
      SELECT id FROM members
      WHERE family_id IN (
        SELECT id FROM families WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    member_id IN (
      SELECT id FROM members
      WHERE family_id IN (
        SELECT id FROM families WHERE user_id = auth.uid()
      )
    )
  );

-- Users can delete habit logs of their family
CREATE POLICY "Users can delete habit logs of their family"
  ON habit_logs
  FOR DELETE
  USING (
    member_id IN (
      SELECT id FROM members
      WHERE family_id IN (
        SELECT id FROM families WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================
-- STORAGE POLICIES (for member avatars)
-- ============================================

-- Note: These policies should be created in Supabase Dashboard
-- under Storage > member-avatars > Policies
--
-- Policy 1: Allow authenticated users to upload their family's avatars
-- Name: "Users can upload family member avatars"
-- Operation: INSERT
-- Policy definition:
-- bucket_id = 'member-avatars'
-- AND auth.uid() IN (
--   SELECT user_id FROM families
--   WHERE id IN (
--     SELECT family_id FROM members
--     WHERE id::text = (storage.foldername(name))[1]
--   )
-- )
--
-- Policy 2: Allow authenticated users to view their family's avatars
-- Name: "Users can view family member avatars"
-- Operation: SELECT
-- Policy definition:
-- bucket_id = 'member-avatars'
-- AND auth.uid() IN (
--   SELECT user_id FROM families
--   WHERE id IN (
--     SELECT family_id FROM members
--     WHERE id::text = (storage.foldername(name))[1]
--   )
-- )
--
-- Policy 3: Allow authenticated users to update their family's avatars
-- Name: "Users can update family member avatars"
-- Operation: UPDATE
-- Policy definition:
-- bucket_id = 'member-avatars'
-- AND auth.uid() IN (
--   SELECT user_id FROM families
--   WHERE id IN (
--     SELECT family_id FROM members
--     WHERE id::text = (storage.foldername(name))[1]
--   )
-- )
--
-- Policy 4: Allow authenticated users to delete their family's avatars
-- Name: "Users can delete family member avatars"
-- Operation: DELETE
-- Policy definition:
-- bucket_id = 'member-avatars'
-- AND auth.uid() IN (
--   SELECT user_id FROM families
--   WHERE id IN (
--     SELECT family_id FROM members
--     WHERE id::text = (storage.foldername(name))[1]
--   )
-- )
