const { getCliClient } = require('sanity/cli');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const stream = require('stream');

const pipeline = promisify(stream.pipeline);
const client = getCliClient();

const massageImages = {
  'massagem-tantrica': 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2000&auto=format&fit=crop',
  'massagem-relaxante': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2000&auto=format&fit=crop',
  'massagem-nuru': 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2000&auto=format&fit=crop',
  'massagem-terapeutica': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2000&auto=format&fit=crop',
  'massagem-4-maos': 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=2000&auto=format&fit=crop',
  'massagem-sensual': 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2000&auto=format&fit=crop'
};

const tempDir = path.join(__dirname, 'temp_images');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

async function downloadImage(url, filename) {
  const filepath = path.join(tempDir, filename);
  console.log(`Downloading ${url} to ${filepath}...`);
  
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(filepath);
      pipeline(response, fileStream)
        .then(() => resolve(filepath))
        .catch(reject);
    }).on('error', reject);
  });
}

async function updateMassageImages() {
  console.log('Iniciando atualização de imagens das massagens...');

  for (const [slug, imageUrl] of Object.entries(massageImages)) {
    console.log(`Processando: ${slug}`);
    
    // 1. Check if massage exists
    const massage = await client.fetch(`*[_type == "massage" && slug.current == $slug][0]`, { slug });
    if (!massage) {
      console.warn(`Massagem não encontrada: ${slug}`);
      continue;
    }

    if (massage.image) {
      console.log(`Massagem ${slug} já possui imagem. Pulando...`);
      // Uncomment the next line if you want to force update existing images
      // continue; 
    }

    try {
      // 2. Download Image
      const filename = `${slug}.jpg`;
      const filepath = await downloadImage(imageUrl, filename);

      // 3. Upload to Sanity
      console.log(`Fazendo upload para o Sanity...`);
      const readStream = fs.createReadStream(filepath);
      const asset = await client.assets.upload('image', readStream, {
        filename: filename
      });

      // 4. Patch Document
      console.log(`Atualizando documento da massagem...`);
      await client.patch(massage._id)
        .set({
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id
            }
          }
        })
        .commit();

      console.log(`Sucesso: Imagem atualizada para ${slug}`);

      // Cleanup
      fs.unlinkSync(filepath);

    } catch (err) {
      console.error(`Erro ao processar ${slug}:`, err);
    }
  }

  // Cleanup dir
  if (fs.existsSync(tempDir)) {
    fs.rmdirSync(tempDir);
  }
  
  console.log('Atualização concluída!');
}

updateMassageImages().catch(err => {
  console.error('Erro geral:', err);
  process.exit(1);
});
