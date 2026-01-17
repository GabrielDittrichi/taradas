const { getCliClient } = require('sanity/cli');

const client = getCliClient();

async function debugMassageSlugQuery(slug) {
  try {
    const query = `*[_type == "massage" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      "therapists": *[_type == "therapist" && references(^._id)] {
        _id,
        name
      }
    }`;
    
    console.log(`Running query for slug: ${slug}`);
    const data = await client.fetch(query, { slug });
    console.log('Query Result:', JSON.stringify(data, null, 2));

    if (data && data.therapists && data.therapists.length > 0) {
        console.log("SUCCESS: Therapists found for this massage.");
    } else {
        console.log("FAILURE: No therapists found for this massage.");
        
        // Debug references manually
        if (data) {
             const massageId = data._id;
             console.log(`Checking therapists referencing massage ID: ${massageId}`);
             const therapists = await client.fetch(`*[_type == "therapist" && references($id)]`, { id: massageId });
             console.log('Direct Reference Check Result:', JSON.stringify(therapists.map(t => ({name: t.name, specialties: t.specialties})), null, 2));
        }
    }

  } catch (err) {
    console.error('Error debugging query:', err);
  }
}

// Test with a known slug
debugMassageSlugQuery('tantrica');
