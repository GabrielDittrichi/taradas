const { getCliClient } = require('sanity/cli');

const client = getCliClient();

async function listMassages() {
  try {
    const massages = await client.fetch('*[_type == "massage"]{title, "slug": slug.current}');
    console.log('Available Massages:', JSON.stringify(massages, null, 2));
  } catch (err) {
    console.error('Error listing massages:', err);
  }
}

listMassages();
