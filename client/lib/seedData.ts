import { supabase } from './supabase';

/**
 * This is a simple function to seed test data directly from the client
 * Use this if you can't access the Supabase SQL editor
 * Run this once to populate your database with test data
 */
export async function seedTestData() {
  try {
    console.log('🌱 Starting to seed test data...');

    // Insert test locations
    const { data: locations, error: locationError } = await supabase
      .from('locations')
      .upsert([
        {
          name: 'Green Valley Municipal Landfill',
          address: '123 Waste Management Drive',
          city: 'Medina',
          state: 'OH',
          zip_code: '44256',
          phone: '(330) 555-0001',
          email: 'info@greenvalley.com',
          website: 'https://greenvalleylandfill.com',
          latitude: 41.1387,
          longitude: -81.8632,
          location_type: 'landfill',
          notes: 'Full-service municipal landfill accepting general household waste and construction debris. Volume discounts available for contractors.',
          rating: 4.2,
          review_count: 89,
          is_active: true
        },
        {
          name: 'Metro Transfer Station',
          address: '456 Recycling Boulevard',
          city: 'Cleveland',
          state: 'OH',
          zip_code: '44101',
          phone: '(216) 555-0002',
          email: 'contact@metrotransfer.com',
          website: 'https://metrotransfer.com',
          latitude: 41.4993,
          longitude: -81.6944,
          location_type: 'transfer_station',
          notes: 'Modern transfer station with comprehensive recycling programs. Specializes in sorting and processing mixed waste streams.',
          rating: 4.6,
          review_count: 156,
          is_active: true
        },
        {
          name: 'Capitol Construction Landfill',
          address: '789 Industrial Parkway',
          city: 'Columbus',
          state: 'OH',
          zip_code: '43215',
          phone: '(614) 555-0003',
          email: 'info@capitolconstruction.com',
          latitude: 39.9612,
          longitude: -82.9988,
          location_type: 'construction_landfill',
          notes: 'Specialized construction and demolition landfill. Accepts concrete, asphalt, mixed C&D debris. Contractor accounts available.',
          rating: 4.1,
          review_count: 67,
          is_active: true
        },
        {
          name: 'Riverside Recycling Center',
          address: '321 River Road',
          city: 'Toledo',
          state: 'OH',
          zip_code: '43604',
          phone: '(419) 555-0004',
          email: 'info@riversiderecycling.com',
          website: 'https://riversiderecycling.com',
          latitude: 41.6528,
          longitude: -83.5379,
          location_type: 'transfer_station',
          notes: 'Eco-friendly recycling center with material buyback programs. Accepts electronics, metals, and household recyclables.',
          rating: 4.8,
          review_count: 203,
          is_active: true
        },
        {
          name: 'Suburban Waste Solutions',
          address: '555 Commerce Drive',
          city: 'Akron',
          state: 'OH',
          zip_code: '44301',
          phone: '(330) 555-0005',
          email: 'service@suburbanwaste.com',
          website: 'https://suburbanwaste.com',
          latitude: 41.0814,
          longitude: -81.5190,
          location_type: 'landfill',
          notes: 'Community-focused waste disposal facility serving residential and small business customers. Competitive pricing.',
          rating: 4.3,
          review_count: 124,
          is_active: true
        }
      ], { 
        onConflict: 'name',
        ignoreDuplicates: false 
      })
      .select();

    if (locationError) {
      console.error('Error inserting locations:', locationError);
    } else {
      console.log('✅ Inserted', locations?.length || 0, 'locations');
    }

    console.log('🎉 Test data seeding completed!');
    return { success: true, locations };

  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    return { success: false, error };
  }
}

/**
 * Call this function to test if the data was seeded correctly
 */
export async function testDataRetrieval() {
  try {
    const { data: locations, error } = await supabase
      .from('locations')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching locations:', error);
      return { success: false, error };
    }

    console.log('📊 Found', locations?.length || 0, 'active locations');
    locations?.forEach(loc => {
      console.log(`  - ${loc.name} (${loc.location_type}) in ${loc.city}, ${loc.state}`);
    });

    return { success: true, locations };
  } catch (error) {
    console.error('Error testing data retrieval:', error);
    return { success: false, error };
  }
}
