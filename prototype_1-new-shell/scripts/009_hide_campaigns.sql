-- Migration: Hide campaigns feature
-- This script clears campaign data while preserving the table structure
-- Campaigns can be re-enabled later by repopulating the data

-- Step 1: Set campaign_id to null for all agreements
UPDATE agreements SET campaign_id = NULL WHERE campaign_id IS NOT NULL;

-- Step 2: Clear all campaign data (but keep the table)
DELETE FROM campaigns;
