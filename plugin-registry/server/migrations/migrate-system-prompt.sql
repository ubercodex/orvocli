-- Migration: Add system_prompt column to profiles table
-- Run this on the production database

-- Add the column if it doesn't exist
ALTER TABLE profiles ADD COLUMN system_prompt TEXT;
