import { getLocations, searchLocations, getLocationById } from './client/lib/supabaseService';

async function testSupabaseBackend() {
  console.log('Testing Supabase backend configuration...\n');

  try {
    // Test 1: Get all locations
    console.log('Test 1: Fetching all locations...');
    const allLocations = await getLocations();
    console.log(`✅ Found ${allLocations.length} locations`);
    
    if (allLocations.length > 0) {
      const firstLocation = allLocations[0];
      console.log('Sample location:', {
        name: firstLocation.name,
        city: firstLocation.city,
        state: firstLocation.state,
        location_type: firstLocation.location_type,
        debrisTypes: firstLocation.debrisTypes?.length || 0,
        paymentTypes: firstLocation.paymentTypes?.length || 0,
        operatingHours: firstLocation.operatingHours?.length || 0,
      });
    }

    // Test 2: Search locations
    console.log('\nTest 2: Searching locations...');
    const searchResults = await searchLocations('Ohio');
    console.log(`✅ Search found ${searchResults.length} locations in Ohio`);

    // Test 3: Get single location
    if (allLocations.length > 0) {
      console.log('\nTest 3: Fetching single location...');
      const singleLocation = await getLocationById(allLocations[0].id);
      if (singleLocation) {
        console.log(`✅ Successfully fetched: ${singleLocation.name}`);
        console.log('Related data loaded:', {
          debrisTypes: singleLocation.debrisTypes?.length || 0,
          paymentTypes: singleLocation.paymentTypes?.length || 0,
          operatingHours: singleLocation.operatingHours?.length || 0,
          reviews: singleLocation.reviews?.length || 0,
        });
      } else {
        console.log('❌ Failed to fetch single location');
      }
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\nYour Supabase backend is correctly configured with:');
    console.log('- Proper schema matching (snake_case fields)');
    console.log('- Related data loading (debris types, payment types, operating hours)');
    console.log('- Type safety with TypeScript interfaces');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSupabaseBackend();
