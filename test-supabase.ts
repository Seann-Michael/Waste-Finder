import { supabase } from './client/lib/supabase'

async function testConnection() {
  try {
    // Try to fetch locations
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('Error:', error)
    } else {
      console.log('Success! Found', data?.length || 0, 'locations')
      console.log('Data:', data)
    }
  } catch (err) {
    console.error('Connection failed:', err)
  }
}

testConnection()
