-- Add ExcludeFromTotal column to levelpack_level table
-- This allows excluding specific levels from total time calculations
-- while still showing them in the level pack

ALTER TABLE levelpack_level 
ADD COLUMN ExcludeFromTotal INT(11) NOT NULL DEFAULT 0
AFTER Targets;
