const { getCliClient } = require('sanity/cli');

const client = getCliClient();

const specialties = [
  { title: 'Massagem Tântrica', slug: 'massagem-tantrica' },
  { title: 'Massagem Relaxante', slug: 'massagem-relaxante' },
  { title: 'Massagem Nuru', slug: 'massagem-nuru' },
  { title: 'Massagem Terapêutica', slug: 'massagem-terapeutica' },
  { title: 'Massagem a 4 Mãos', slug: 'massagem-4-maos' },
  { title: 'Massagem Sensual', slug: 'massagem-sensual' },
];

const therapistSpecialties = {
  'beatriz': ['massagem-tantrica', 'massagem-relaxante'],
  'luiza': ['massagem-nuru', 'massagem-terapeutica'],
  'mariha': ['massagem-sensual', 'massagem-tantrica']
};

async function importSpecialties() {
  console.log('Iniciando importação de especialidades...');

  // 1. Create Massages
  const massageIds = {};
  
  for (const sp of specialties) {
    const existing = await client.fetch(`*[_type == "massage" && slug.current == $slug][0]`, { slug: sp.slug });
    
    if (existing) {
      console.log(`Massagem já existe: ${sp.title}`);
      massageIds[sp.slug] = existing._id;
    } else {
      console.log(`Criando massagem: ${sp.title}`);
      const doc = {
        _type: 'massage',
        title: sp.title,
        slug: { _type: 'slug', current: sp.slug },
        description: `Descrição para ${sp.title}`, // Placeholder
      };
      const created = await client.create(doc);
      massageIds[sp.slug] = created._id;
    }
  }

  // 2. Assign to Therapists
  for (const [slug, specialtySlugs] of Object.entries(therapistSpecialties)) {
    console.log(`Atualizando especialidades para: ${slug}`);
    
    const therapist = await client.fetch(`*[_type == "therapist" && slug.current == $slug][0]`, { slug });
    
    if (!therapist) {
      console.warn(`Terapeuta não encontrada: ${slug}`);
      continue;
    }

    const refs = specialtySlugs.map(s => ({
      _type: 'reference',
      _ref: massageIds[s],
      _key: massageIds[s] // Ensure uniqueness in array
    }));

    await client.patch(therapist._id)
      .set({ specialties: refs })
      .commit();
      
    console.log(`Atualizado ${slug} com ${refs.length} especialidades.`);
  }

  console.log('Importação concluída!');
}

importSpecialties().catch(err => {
  console.error('Erro na importação:', err);
  process.exit(1);
});
