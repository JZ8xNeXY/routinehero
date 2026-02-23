# RLS (Row Level Security) Setup Guide

## Overview

Row Level Security (RLS) ensures that users can only access data belonging to their family. This prevents unauthorized access to other families' data.

## Step 1: Apply Migration (Local)

```bash
# If using local Supabase
npx supabase db push

# Or apply manually
npx supabase db reset
```

## Step 2: Apply Migration (Cloud)

### Option A: Using Supabase CLI
```bash
# Login to Supabase
npx supabase login

# Link your project
npx supabase link --project-ref mpkaoiqxdgdgkdmtmpct

# Push migration
npx supabase db push
```

### Option B: Manual Application
1. Go to https://supabase.com/dashboard/project/mpkaoiqxdgdgkdmtmpct/sql/new
2. Copy contents of `supabase/migrations/20240000000003_enable_rls.sql`
3. Paste and run

## Step 3: Create Storage Bucket (if not exists)

1. Go to https://supabase.com/dashboard/project/mpkaoiqxdgdgkdmtmpct/storage/buckets
2. Click "New bucket"
3. Name: `member-avatars`
4. Public: ☑️ (checked)
5. Click "Create bucket"

## Step 4: Set Storage Policies

Go to Storage > member-avatars > Policies and create these 4 policies:

### Policy 1: Upload
- **Name**: Users can upload family member avatars
- **Allowed operation**: INSERT
- **Policy definition**:
```sql
bucket_id = 'member-avatars'
AND auth.uid() IN (
  SELECT user_id FROM families
  WHERE id IN (
    SELECT family_id FROM members
    WHERE id::text = (storage.foldername(name))[1]
  )
)
```

### Policy 2: View
- **Name**: Users can view family member avatars
- **Allowed operation**: SELECT
- **Policy definition**:
```sql
bucket_id = 'member-avatars'
AND auth.uid() IN (
  SELECT user_id FROM families
  WHERE id IN (
    SELECT family_id FROM members
    WHERE id::text = (storage.foldername(name))[1]
  )
)
```

### Policy 3: Update
- **Name**: Users can update family member avatars
- **Allowed operation**: UPDATE
- **Policy definition**:
```sql
bucket_id = 'member-avatars'
AND auth.uid() IN (
  SELECT user_id FROM families
  WHERE id IN (
    SELECT family_id FROM members
    WHERE id::text = (storage.foldername(name))[1]
  )
)
```

### Policy 4: Delete
- **Name**: Users can delete family member avatars
- **Allowed operation**: DELETE
- **Policy definition**:
```sql
bucket_id = 'member-avatars'
AND auth.uid() IN (
  SELECT user_id FROM families
  WHERE id IN (
    SELECT family_id FROM members
    WHERE id::text = (storage.foldername(name))[1]
  )
)
```

## Step 5: Verify RLS is Working

### Test 1: Check RLS is enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('families', 'members', 'habits', 'habit_logs');
```
All should show `rowsecurity = true`

### Test 2: Check policies exist
```sql
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```
Should show all policies created above

### Test 3: Functional test
1. Sign in as User A
2. Create a family and members
3. Sign out
4. Sign in as User B
5. Create a different family
6. Try to access User A's data (should fail)

## Security Checklist

- [x] RLS enabled on `families` table
- [x] RLS enabled on `members` table
- [x] RLS enabled on `habits` table
- [x] RLS enabled on `habit_logs` table
- [ ] Storage bucket `member-avatars` created
- [ ] Storage policies configured (4 policies)
- [ ] Migration applied to cloud database
- [ ] Functional testing completed

## What RLS Protects Against

✅ **Protected:**
- User A cannot view User B's family data
- User A cannot modify User B's members
- User A cannot create habits for User B's family
- User A cannot view User B's habit logs
- User A cannot upload avatars to User B's members

❌ **Not Protected (by design):**
- Authenticated users can create their own family (onboarding)
- Users can perform all CRUD operations on their own data

## Troubleshooting

**Problem**: "new row violates row-level security policy"
- **Cause**: Trying to insert/update data for another user's family
- **Solution**: This is expected behavior - RLS is working correctly

**Problem**: Cannot see any data after enabling RLS
- **Cause**: Missing SELECT policies or user not authenticated
- **Solution**: Check that user is authenticated and SELECT policies exist

**Problem**: Storage upload fails with 403 error
- **Cause**: Storage policies not configured
- **Solution**: Follow Step 4 to create storage policies

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
