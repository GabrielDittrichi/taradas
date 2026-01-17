const fs = require('fs');
const path = require('path');
const { basename } = require('path');
const { defineCliConfig, getCliClient } = require('sanity/cli');

// Configuration
// We use getCliClient which automatically picks up the configuration and token
// when run with `sanity exec ... --with-user-token`
let client;
try {
  client = getCliClient();
} catch (e) {
  // Fallback for manual run (if needed, but we aim for sanity exec)
  const { createClient } = require('next-sanity');
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2ll603bs';
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const apiVersion = '2024-01-01';
  const token = process.env.SANITY_API_TOKEN;
  
  if (!token) {
    console.error("Error: Could not get CLI client and SANITY_API_TOKEN is not set.");
    process.exit(1);
  }
  
  client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}

const dataPath = path.join(__dirname, '../src/data/therapists_scraped.json');
const imagesDir = path.join(__dirname, '../public');

async function uploadImage(imagePath) {
  try {
    const absolutePath = path.join(imagesDir, imagePath);
    if (!fs.existsSync(absolutePath)) {
      console.warn(`Image not found: ${absolutePath}`);
      return null;
    }
    const stream = fs.createReadStream(absolutePath);
    const asset = await client.assets.upload('image', stream, {
      filename: basename(imagePath)
    });
    return asset._id;
  } catch (err) {
    console.error(`Failed to upload image ${imagePath}:`, err.message);
    return null;
  }
}

async function importTherapists() {
  if (!fs.existsSync(dataPath)) {
      console.error(`Data file not found at ${dataPath}`);
      return;
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const therapists = JSON.parse(rawData);

  console.log(`Starting import for project: ${client.config().projectId}, dataset: ${client.config().dataset}`);

  for (const t of therapists) {
    console.log(`Importing ${t.name}...`);

    // Upload Main Image
    let mainImageId = null;
    if (t.mainImage) {
      console.log(`  Uploading main image: ${t.mainImage}`);
      mainImageId = await uploadImage(t.mainImage);
    }

    // Upload Gallery
    const galleryKeys = [];
    if (t.gallery && Array.isArray(t.gallery)) {
      console.log(`  Uploading gallery (${t.gallery.length} images)...`);
      for (const imgPath of t.gallery) {
        const assetId = await uploadImage(imgPath);
        if (assetId) {
          galleryKeys.push({
            _key: assetId, 
            _type: 'image',
            asset: {
              _type: "reference",
              _ref: assetId
            }
          });
        }
      }
    }

    // Create Document
    const doc = {
      _type: 'therapist',
      name: t.name,
      slug: {
        _type: 'slug',
        current: t.slug
      },
      bio: t.bio,
      image: mainImageId ? {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: mainImageId
        }
      } : undefined,
      gallery: galleryKeys,
    };

    // Check if exists
    const existing = await client.fetch(`*[_type == "therapist" && slug.current == $slug][0]`, { slug: t.slug });
    
    if (existing) {
      console.log(`  Updating existing therapist: ${t.name}`);
      await client.patch(existing._id).set(doc).commit();
    } else {
      console.log(`  Creating new therapist: ${t.name}`);
      await client.create(doc);
    }
  }
  console.log('Import completed!');
}

importTherapists().catch(console.error);
