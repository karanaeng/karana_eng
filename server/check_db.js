import { supabase } from './database.js';

async function checkProducts() {
  const { data, error } = await supabase.from('products').select('title, category');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  console.log('--- PRODUCTS IN DATABASE ---');
  console.log(JSON.stringify(data, null, 2));
  console.log('---------------------------');
}

checkProducts();
