/*
  # Add Tier and Discount Fields to Supplements Table

  1. New Fields
    - Add tier field to supplements table
    - Add subscription_discount_percent field to supplements table
    - Add use_case field to supplements table

  2. Constraints
    - Add check constraint for tier values
    - Add check constraint for subscription_discount_percent range
*/

-- Add new columns if they don't exist
ALTER TABLE supplements 
ADD COLUMN IF NOT EXISTS tier TEXT CHECK (tier IN ('green', 'yellow', 'orange', 'red')),
ADD COLUMN IF NOT EXISTS subscription_discount_percent INTEGER DEFAULT 0 CHECK (subscription_discount_percent >= 0 AND subscription_discount_percent <= 100),
ADD COLUMN IF NOT EXISTS use_case TEXT;

-- Update existing supplements with tier information
UPDATE supplements 
SET tier = 'green' 
WHERE name IN ('Creatine Monohydrate', 'Vitamin D3', 'Magnesium Glycinate', 'Whey Protein Isolate (Unflavored)');

UPDATE supplements 
SET tier = 'yellow' 
WHERE name IN ('Ashwagandha (Withania somnifera)', 'Rhodiola Rosea', 'Berberine', 'β-Alanine');

UPDATE supplements 
SET tier = 'orange' 
WHERE name IN ('Tongkat Ali (Eurycoma longifolia)', 'HMB (β-Hydroxy β-Methylbutyrate)', 'DHEA (Dehydroepiandrosterone)');

-- Set subscription discount percentages
UPDATE supplements 
SET subscription_discount_percent = 15 
WHERE tier = 'green';

UPDATE supplements 
SET subscription_discount_percent = 12 
WHERE tier = 'yellow';

UPDATE supplements 
SET subscription_discount_percent = 10 
WHERE tier = 'orange';

-- Set use cases for popular supplements
UPDATE supplements 
SET use_case = 'Muscle strength & power' 
WHERE name LIKE '%Creatine%';

UPDATE supplements 
SET use_case = 'Immune & bone health' 
WHERE name LIKE '%Vitamin D%';

UPDATE supplements 
SET use_case = 'Stress & anxiety' 
WHERE name LIKE '%Ashwagandha%';

UPDATE supplements 
SET use_case = 'Sleep & recovery' 
WHERE name LIKE '%Magnesium%';

UPDATE supplements 
SET use_case = 'Hormonal support' 
WHERE name LIKE '%Tongkat Ali%';

UPDATE supplements 
SET use_case = 'Metabolic health' 
WHERE name LIKE '%Berberine%';

UPDATE supplements 
SET use_case = 'Energy & focus' 
WHERE name LIKE '%Rhodiola%';

UPDATE supplements 
SET use_case = 'Endurance' 
WHERE name LIKE '%β-Alanine%' OR name LIKE '%Beta-Alanine%';

-- Create index for faster filtering by tier
CREATE INDEX IF NOT EXISTS idx_supplements_tier ON supplements(tier);