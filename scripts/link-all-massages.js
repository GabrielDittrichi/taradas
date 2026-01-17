const { getCliClient } = require('sanity/cli');

const client = getCliClient();

async function linkAllMassagesToTherapists() {
  try {
    console.log('Fetching all massages...');
    const massages = await client.fetch('*[_type == "massage"]{_id, title}');
    console.log(`Found ${massages.length} massages.`);

    if (massages.length === 0) {
      console.log('No massages found. Aborting.');
      return;
    }

    console.log('Fetching all therapists...');
    const therapists = await client.fetch('*[_type == "therapist"]{_id, name}');
    console.log(`Found ${therapists.length} therapists.`);

    if (therapists.length === 0) {
      console.log('No therapists found. Aborting.');
      return;
    }

    // Create array of references to all massages
    const massageRefs = massages.map(m => ({
      _type: 'reference',
      _ref: m._id,
      _key: m._id // using ID as key for simplicity in this bulk operation
    }));

    console.log('Linking all massages to all therapists...');

    const transaction = client.transaction();

    for (const therapist of therapists) {
      console.log(`Queuing update for ${therapist.name}...`);
      transaction.patch(therapist._id, p => p.set({ specialties: massageRefs }));
    }

    console.log('Committing transaction...');
    await transaction.commit();
    console.log('Success! All therapists are now linked to all massages.');

  } catch (err) {
    console.error('Error linking massages:', err);
    process.exit(1);
  }
}

linkAllMassagesToTherapists();
