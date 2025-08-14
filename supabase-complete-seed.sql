-- Complete database seeding with all mock data from frontend
-- This replaces all hardcoded frontend data with proper database entries

-- First, clean up any existing test data (optional)
-- DELETE FROM reviews WHERE author_name LIKE '%Mock%' OR content LIKE '%mock%';
-- DELETE FROM location_debris_types;
-- DELETE FROM location_payment_types;
-- DELETE FROM operating_hours;
-- DELETE FROM locations WHERE name LIKE '%Test%' OR name LIKE '%Mock%';

-- Insert more comprehensive debris types
INSERT INTO debris_types (name, description, category, price_per_ton, price_note) VALUES 
-- General waste types
('General Household Waste', 'Regular household garbage and refuse', 'general', 65.00, 'per ton'),
('Municipal Solid Waste', 'Mixed municipal waste stream', 'general', 70.00, 'per ton'),
('Yard Waste', 'Leaves, grass clippings, branches', 'general', 35.00, 'per ton'),
('Organic Waste', 'Compostable organic materials', 'general', 40.00, 'per ton'),
('Appliances', 'Refrigerators, washers, dryers', 'general', 25.00, 'per item'),

-- Construction waste types
('Construction Debris', 'Mixed construction and demolition materials', 'construction', 85.00, 'per ton'),
('Clean Concrete', 'Concrete without rebar or contamination', 'construction', 35.00, 'per ton'),
('Concrete with Rebar', 'Reinforced concrete materials', 'construction', 45.00, 'per ton'),
('Asphalt', 'Asphalt paving materials', 'construction', 40.00, 'per ton'),
('Clean Wood', 'Untreated lumber and wood materials', 'construction', 55.00, 'per ton'),
('Treated Lumber', 'Pressure-treated wood materials', 'construction', 75.00, 'per ton'),
('Drywall', 'Gypsum wallboard and sheetrock', 'construction', 60.00, 'per ton'),
('Mixed Demolition', 'General demolition debris', 'construction', 95.00, 'per ton'),
('Roofing Materials', 'Shingles, tar paper, roofing debris', 'construction', 80.00, 'per ton'),
('Brick and Masonry', 'Brick, block, stone materials', 'construction', 50.00, 'per ton'),

-- Recyclable materials
('Electronics', 'Computers, TVs, electronic waste', 'recyclable', 0.00, 'Free drop-off'),
('Cardboard', 'Clean cardboard and boxes', 'recyclable', 0.00, 'Free drop-off'),
('Paper', 'Office paper, newspapers, magazines', 'recyclable', 0.00, 'Free drop-off'),
('Aluminum Cans', 'Aluminum beverage cans', 'recyclable', -45.00, 'We pay per pound'),
('Scrap Metal', 'Mixed scrap metal', 'recyclable', -15.00, 'We pay per pound'),
('Copper', 'Clean copper wire and pipe', 'recyclable', -280.00, 'We pay per pound'),
('Steel', 'Iron and steel scrap', 'recyclable', -12.00, 'We pay per pound'),
('Batteries', 'Car batteries, lead acid batteries', 'recyclable', -8.00, 'We pay per battery'),

-- Hazardous materials
('Paint', 'Latex and oil-based paints', 'hazardous', 150.00, 'per 5-gallon bucket'),
('Chemicals', 'Household and industrial chemicals', 'hazardous', 200.00, 'per container'),
('Tires', 'Vehicle tires of all sizes', 'hazardous', 8.00, 'per tire'),
('Motor Oil', 'Used motor oil and fluids', 'hazardous', 0.00, 'Free drop-off'),
('Asbestos', 'Asbestos-containing materials', 'hazardous', 500.00, 'per ton - certified disposal')
ON CONFLICT (name) DO NOTHING;

-- Insert comprehensive payment types
INSERT INTO payment_types (name, description) VALUES 
('Cash', 'Cash payments accepted'),
('Credit Card', 'Visa, MasterCard, American Express, Discover'),
('Debit Card', 'Debit card payments'),
('Check', 'Personal and business checks'),
('Company Account', 'Net 30 billing for established accounts'),
('ACH Transfer', 'Electronic bank transfers'),
('PayPal', 'PayPal payments accepted'),
('Apple Pay', 'Mobile payment via Apple Pay'),
('Google Pay', 'Mobile payment via Google Pay')
ON CONFLICT (name) DO NOTHING;

-- Insert comprehensive locations across multiple states
INSERT INTO locations (
  name, address, city, state, zip_code, phone, 
  email, website, latitude, longitude, location_type, notes, rating, review_count
) VALUES 

-- Ohio locations (existing + new)
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
),

-- New locations in other states
(
  'Pine Ridge Landfill',
  '2500 Highway 45 North',
  'Jackson',
  'MS',
  '39201',
  '(601) 555-0101',
  'operations@pineridgems.com',
  'https://pineridgelandfill.com',
  32.2988,
  -90.1848,
  'landfill',
  'Regional landfill serving central Mississippi. Accepts municipal solid waste and construction debris.',
  4.0,
  78
),
(
  'Mountain View Transfer',
  '1800 Industrial Boulevard',
  'Denver',
  'CO',
  '80202',
  '(303) 555-0201',
  'info@mountainviewtransfer.com',
  'https://mountainviewtransfer.com',
  39.7392,
  -104.9903,
  'transfer_station',
  'High-altitude waste transfer facility with specialized equipment for mountain region disposal needs.',
  4.5,
  142
),
(
  'Coastal Waste Management',
  '500 Harbor Drive',
  'Virginia Beach',
  'VA',
  '23451',
  '(757) 555-0301',
  'contact@coastalwm.com',
  'https://coastalwastemanagement.com',
  36.8529,
  -75.9780,
  'landfill',
  'Coastal landfill with marine debris processing capabilities. Environmental compliance certified.',
  4.4,
  191
),
(
  'Prairie Construction Disposal',
  '3200 Farm Road 2920',
  'Austin',
  'TX',
  '78741',
  '(512) 555-0401',
  'dispatch@prairieconstruction.com',
  null,
  30.2672,
  -97.7431,
  'construction_landfill',
  'Texas-sized construction landfill accepting all C&D materials. Fast turnaround times for contractors.',
  4.2,
  89
),
(
  'Desert Recycling Hub',
  '750 Industrial Way',
  'Phoenix',
  'AZ',
  '85003',
  '(602) 555-0501',
  'info@desertrecycling.com',
  'https://desertrecyclinghub.com',
  33.4484,
  -112.0740,
  'transfer_station',
  'Desert-climate optimized recycling facility. Solar-powered operations with water conservation systems.',
  4.7,
  167
)
ON CONFLICT (name) DO NOTHING;

-- Add operating hours for all locations
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
ON CONFLICT (location_id, day_of_week) DO NOTHING;

-- Associate all payment types with all locations
INSERT INTO location_payment_types (location_id, payment_type_id)
SELECT l.id, pt.id
FROM locations l
CROSS JOIN payment_types pt
WHERE pt.name IN ('Cash', 'Credit Card', 'Check', 'Debit Card')
ON CONFLICT (location_id, payment_type_id) DO NOTHING;

-- Associate debris types with locations based on their type
-- Landfills accept general and construction waste
INSERT INTO location_debris_types (location_id, debris_type_id)
SELECT l.id, dt.id
FROM locations l
CROSS JOIN debris_types dt
WHERE l.location_type = 'landfill'
AND dt.category IN ('general', 'construction')
ON CONFLICT (location_id, debris_type_id) DO NOTHING;

-- Transfer stations accept all types
INSERT INTO location_debris_types (location_id, debris_type_id)
SELECT l.id, dt.id
FROM locations l
CROSS JOIN debris_types dt
WHERE l.location_type = 'transfer_station'
ON CONFLICT (location_id, debris_type_id) DO NOTHING;

-- Construction landfills only accept construction debris
INSERT INTO location_debris_types (location_id, debris_type_id)
SELECT l.id, dt.id
FROM locations l
CROSS JOIN debris_types dt
WHERE l.location_type = 'construction_landfill'
AND dt.category = 'construction'
ON CONFLICT (location_id, debris_type_id) DO NOTHING;

-- Add comprehensive sample reviews for all locations
INSERT INTO reviews (location_id, rating, title, content, author_name, author_email, is_approved, is_moderated)
SELECT 
  l.id,
  5,
  'Excellent service and fair prices',
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
UNION ALL
SELECT 
  l.id,
  4,
  'Great recycling programs',
  'Love that they pay for scrap metal and aluminum. Makes recycling worthwhile. Clean facility with helpful staff.',
  'Lisa Chen',
  'lisa.chen@email.com',
  true,
  true
FROM locations l 
WHERE l.name = 'Riverside Recycling Center'
UNION ALL
SELECT 
  l.id,
  5,
  'Community focused',
  'Local business that really cares about the community. Fair prices and they work with you on scheduling.',
  'Robert Martinez',
  'r.martinez@email.com',
  true,
  true
FROM locations l 
WHERE l.name = 'Suburban Waste Solutions'
ON CONFLICT (location_id, author_email) DO NOTHING;

-- Add more reviews for variety
INSERT INTO reviews (location_id, rating, title, content, author_name, author_email, is_approved, is_moderated)
SELECT 
  l.id,
  4,
  'Good location with minor issues',
  'Overall good experience but parking can be limited during peak hours. Staff is knowledgeable about debris classification.',
  'Jennifer Adams',
  'j.adams@email.com',
  true,
  true
FROM locations l 
WHERE l.location_type = 'transfer_station'
LIMIT 3
UNION ALL
SELECT 
  l.id,
  5,
  'Highly recommend',
  'Fast service, competitive pricing, and environmentally conscious operations. Will definitely use again.',
  'David Thompson',
  'd.thompson@email.com',
  true,
  true
FROM locations l 
WHERE l.location_type = 'landfill'
LIMIT 2
ON CONFLICT (location_id, author_email) DO NOTHING;

-- Create a table for resources (from Learn page)
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_type TEXT,
  file_size TEXT,
  download_url TEXT,
  category TEXT,
  featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample resources
INSERT INTO resources (title, description, file_type, file_size, download_url, category, featured) VALUES
('Dumpster Rental Contract Template', 'Professional contract template for dumpster rental agreements with legal protections.', 'PDF', '2.1 MB', '#', 'Contracts', true),
('Waste Management Cost Calculator', 'Excel spreadsheet to calculate and compare waste management costs across different vendors.', 'XLSX', '1.5 MB', '#', 'Tools', false),
('Debris Classification Guide', 'Comprehensive guide to properly classify different types of construction and household debris.', 'PDF', '5.2 MB', '#', 'Guides', true),
('Safety Protocols for Waste Handling', 'Comprehensive safety guide for handling various types of waste materials.', 'PDF', '3.8 MB', '#', 'Safety', true),
('Environmental Compliance Checklist', 'Checklist to ensure your waste disposal practices meet environmental regulations.', 'PDF', '1.2 MB', '#', 'Compliance', false)
ON CONFLICT DO NOTHING;

-- Create admin users table (for AdminSettings)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  permissions TEXT[],
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample admin users
INSERT INTO admin_users (name, email, role, permissions, last_login) VALUES
('Sean Webb', 'sean@dumpnearme.com', 'super_admin', '{"all"}', '2024-01-22T08:45:00Z'),
('Sarah Johnson', 'sarah@dumpnearme.com', 'admin', '{"locations", "reviews", "users"}', '2024-01-21T16:20:00Z'),
('Mike Chen', 'mike@dumpnearme.com', 'moderator', '{"reviews", "content"}', '2024-01-20T11:30:00Z')
ON CONFLICT (email) DO NOTHING;

-- Create pending locations table (for AdminSettings)
CREATE TABLE IF NOT EXISTS pending_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  address TEXT NOT NULL,
  suggested_data JSONB,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES admin_users(id)
);

-- Insert sample pending locations
INSERT INTO pending_locations (name, submitter_name, submitter_email, address, suggested_data, status) VALUES
('Riverside Recycling Center Update', 'Lisa K.', 'lisa.k@email.com', '456 River Road, Portland, OR 97202', '{"phone": "(503) 555-0123", "website": "https://riverside-recycling.com"}', 'pending'),
('Metro Waste Facility', 'John D.', 'john.d@email.com', '789 Industrial Ave, Chicago, IL 60601', '{"location_type": "transfer_station", "accepts_hazardous": true}', 'pending')
ON CONFLICT DO NOTHING;

-- Final verification query
SELECT 
  'Locations' as table_name, count(*) as records FROM locations WHERE is_active = true
UNION ALL
SELECT 'Payment types', count(*) FROM payment_types
UNION ALL
SELECT 'Debris types', count(*) FROM debris_types
UNION ALL
SELECT 'Operating hours', count(*) FROM operating_hours
UNION ALL
SELECT 'Location-payment associations', count(*) FROM location_payment_types
UNION ALL
SELECT 'Location-debris associations', count(*) FROM location_debris_types
UNION ALL
SELECT 'Reviews', count(*) FROM reviews
UNION ALL
SELECT 'Resources', count(*) FROM resources
UNION ALL
SELECT 'Admin users', count(*) FROM admin_users
UNION ALL
SELECT 'Pending locations', count(*) FROM pending_locations;
