-- First, let's insert some payment types
INSERT INTO payment_types (name, description) VALUES 
('Cash', 'Cash payments accepted'),
('Credit Card', 'Visa, MasterCard, American Express'),
('Check', 'Personal and business checks'),
('Debit Card', 'Debit card payments')
ON CONFLICT (name) DO NOTHING;

-- Insert debris types with different categories
INSERT INTO debris_types (name, description, category, price_per_ton, price_note) VALUES 
('General Household Waste', 'Regular household garbage and refuse', 'general', 65.00, 'per ton'),
('Yard Waste', 'Leaves, grass clippings, branches', 'general', 35.00, 'per ton'),
('Construction Debris', 'Mixed construction and demolition materials', 'construction', 85.00, 'per ton'),
('Clean Concrete', 'Concrete without rebar or contamination', 'construction', 35.00, 'per ton'),
('Asphalt', 'Asphalt paving materials', 'construction', 40.00, 'per ton'),
('Clean Wood', 'Untreated lumber and wood materials', 'construction', 55.00, 'per ton'),
('Mixed Demolition', 'General demolition debris', 'construction', 95.00, 'per ton'),
('Appliances', 'Refrigerators, washers, dryers', 'general', 25.00, 'per item'),
('Electronics', 'Computers, TVs, electronic waste', 'recyclable', 0.00, 'Free drop-off'),
('Cardboard', 'Clean cardboard and boxes', 'recyclable', 0.00, 'Free drop-off'),
('Aluminum Cans', 'Aluminum beverage cans', 'recyclable', -45.00, 'We pay per pound'),
('Scrap Metal', 'Mixed scrap metal', 'recyclable', -15.00, 'We pay per pound')
ON CONFLICT (name) DO NOTHING;

-- Add 3 test locations with realistic Ohio data
INSERT INTO locations (
  name, address, city, state, zip_code, phone, 
  email, website, latitude, longitude, location_type, notes, rating, review_count
) VALUES 
(
  'Green Valley Municipal Landfill',
  '123 Waste Management Drive',
  'Medina',
  'OH',
  '44256',
  '(330) 555-0001',
  'info@greenvalley.com',
  'https://greenvalleylandfill.com',
  41.1387,
  -81.8632,
  'landfill',
  'Full-service municipal landfill accepting general household waste and construction debris. Volume discounts available for contractors.',
  4.2,
  89
),
(
  'Metro Transfer Station',
  '456 Recycling Boulevard',
  'Cleveland',
  'OH',
  '44101',
  '(216) 555-0002',
  'contact@metrotransfer.com',
  'https://metrotransfer.com',
  41.4993,
  -81.6944,
  'transfer_station',
  'Modern transfer station with comprehensive recycling programs. Specializes in sorting and processing mixed waste streams.',
  4.6,
  156
),
(
  'Capitol Construction Landfill',
  '789 Industrial Parkway',
  'Columbus',
  'OH',
  '43215',
  '(614) 555-0003',
  'info@capitolconstruction.com',
  null,
  39.9612,
  -82.9988,
  'construction_landfill',
  'Specialized construction and demolition landfill. Accepts concrete, asphalt, mixed C&D debris. Contractor accounts available.',
  4.1,
  67
),
(
  'Riverside Recycling Center',
  '321 River Road',
  'Toledo',
  'OH',
  '43604',
  '(419) 555-0004',
  'info@riversiderecycling.com',
  'https://riversiderecycling.com',
  41.6528,
  -83.5379,
  'transfer_station',
  'Eco-friendly recycling center with material buyback programs. Accepts electronics, metals, and household recyclables.',
  4.8,
  203
),
(
  'Suburban Waste Solutions',
  '555 Commerce Drive',
  'Akron',
  'OH',
  '44301',
  '(330) 555-0005',
  'service@suburbanwaste.com',
  'https://suburbanwaste.com',
  41.0814,
  -81.5190,
  'landfill',
  'Community-focused waste disposal facility serving residential and small business customers. Competitive pricing.',
  4.3,
  124
)
ON CONFLICT (name) DO NOTHING;

-- Get the location IDs for the inserted locations
-- Add operating hours for all locations (Monday-Saturday, closed Sunday)
INSERT INTO operating_hours (location_id, day_of_week, open_time, close_time, is_closed)
SELECT 
  l.id as location_id,
  dow.day_num as day_of_week,
  CASE 
    WHEN dow.day_num = 0 THEN '00:00'  -- Sunday closed
    WHEN dow.day_num = 6 THEN '08:00'  -- Saturday opens later
    ELSE '07:00'                       -- Weekdays
  END as open_time,
  CASE 
    WHEN dow.day_num = 0 THEN '00:00'  -- Sunday closed
    WHEN dow.day_num = 6 THEN '15:00'  -- Saturday closes earlier
    ELSE '17:00'                       -- Weekdays
  END as close_time,
  CASE 
    WHEN dow.day_num = 0 THEN true     -- Sunday closed
    ELSE false                         -- Other days open
  END as is_closed
FROM locations l
CROSS JOIN (
  SELECT generate_series(0, 6) as day_num
) dow
WHERE l.name IN (
  'Green Valley Municipal Landfill',
  'Metro Transfer Station', 
  'Capitol Construction Landfill',
  'Riverside Recycling Center',
  'Suburban Waste Solutions'
)
ON CONFLICT (location_id, day_of_week) DO NOTHING;

-- Associate payment types with locations
INSERT INTO location_payment_types (location_id, payment_type_id)
SELECT l.id, pt.id
FROM locations l
CROSS JOIN payment_types pt
WHERE l.name IN (
  'Green Valley Municipal Landfill',
  'Metro Transfer Station', 
  'Capitol Construction Landfill',
  'Riverside Recycling Center',
  'Suburban Waste Solutions'
)
AND pt.name IN ('Cash', 'Credit Card', 'Check')
ON CONFLICT (location_id, payment_type_id) DO NOTHING;

-- Associate debris types with locations based on their type
-- Landfills accept general waste
INSERT INTO location_debris_types (location_id, debris_type_id)
SELECT l.id, dt.id
FROM locations l
CROSS JOIN debris_types dt
WHERE l.location_type = 'landfill'
AND dt.category IN ('general', 'construction')
ON CONFLICT (location_id, debris_type_id) DO NOTHING;

-- Transfer stations accept general and recyclable
INSERT INTO location_debris_types (location_id, debris_type_id)
SELECT l.id, dt.id
FROM locations l
CROSS JOIN debris_types dt
WHERE l.location_type = 'transfer_station'
AND dt.category IN ('general', 'recyclable', 'construction')
ON CONFLICT (location_id, debris_type_id) DO NOTHING;

-- Construction landfills only accept construction debris
INSERT INTO location_debris_types (location_id, debris_type_id)
SELECT l.id, dt.id
FROM locations l
CROSS JOIN debris_types dt
WHERE l.location_type = 'construction_landfill'
AND dt.category = 'construction'
ON CONFLICT (location_id, debris_type_id) DO NOTHING;

-- Add some sample reviews
INSERT INTO reviews (location_id, rating, title, content, author_name, author_email, is_approved, is_moderated)
SELECT 
  l.id,
  5,
  'Great service and fair prices',
  'Dropped off construction debris here last week. Staff was helpful and the facility was clean. Pricing was very competitive compared to other places I called.',
  'Mike Johnson',
  'mike.j@email.com',
  true,
  true
FROM locations l 
WHERE l.name = 'Green Valley Municipal Landfill'
UNION ALL
SELECT 
  l.id,
  4,
  'Quick and efficient',
  'Easy drop-off process for household items. The recycling program is excellent and the staff knows their stuff.',
  'Sarah Williams',
  'sarah.w@email.com',
  true,
  true
FROM locations l 
WHERE l.name = 'Metro Transfer Station'
UNION ALL
SELECT 
  l.id,
  5,
  'Professional operation',
  'Been using this facility for my contracting business for years. Always reliable and they handle large loads efficiently.',
  'Tom Builder',
  'tom@buildersinc.com',
  true,
  true
FROM locations l 
WHERE l.name = 'Capitol Construction Landfill'
ON CONFLICT (location_id, author_email) DO NOTHING;

-- Verify the data was inserted
SELECT 'Locations inserted:' as message, count(*) as count FROM locations WHERE is_active = true
UNION ALL
SELECT 'Payment types inserted:', count(*) FROM payment_types
UNION ALL
SELECT 'Debris types inserted:', count(*) FROM debris_types
UNION ALL
SELECT 'Operating hours inserted:', count(*) FROM operating_hours
UNION ALL
SELECT 'Location-payment associations:', count(*) FROM location_payment_types
UNION ALL
SELECT 'Location-debris associations:', count(*) FROM location_debris_types
UNION ALL
SELECT 'Reviews inserted:', count(*) FROM reviews;
