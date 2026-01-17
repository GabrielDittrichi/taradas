import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/motion"

const FALLBACK_MASSAGES = [
  {
    _id: "1",
    title: "Massagem Tântrica",
    description: "Uma jornada de autoconhecimento e despertar sensorial, expandindo a sua capacidade de sentir prazer.",
    image: null, // Will handle fallback logic in render
    slug: { current: "tantrica" },
    fallbackImage: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop"
  },
  {
    _id: "2",
    title: "Massagem Nuru",
    description: "Técnica japonesa corpo a corpo com gel especial, proporcionando um contato íntimo e deslizante.",
    image: null,
    slug: { current: "nuru" },
    fallbackImage: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2574&auto=format&fit=crop"
  },
  {
    _id: "3",
    title: "Massagem Lingam",
    description: "Focada na saúde masculina e vitalidade, utilizando toques precisos para desbloquear energias.",
    image: null,
    slug: { current: "lingam" },
    fallbackImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop"
  },
  {
    _id: "4",
    title: "Massagem Relaxante",
    description: "Movimentos suaves e rítmicos para aliviar tensões musculares e promover relaxamento profundo.",
    image: null,
    slug: { current: "relaxante" },
    fallbackImage: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop"
  }
]

async function getMassages() {
  const query = `*[_type == "massage"] | order(_createdAt asc) {
    _id,
    title,
    description,
    image,
    slug
  }`
  const data = await client.fetch(query)
  return data
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop"

export async function Massages() {
  const sanityMassages = await getMassages()
  // If we have sanity data, use it. Otherwise use fallback (only if sanity is empty, which might not be desired if we want to show mixed content, but for now assumption is: if sanity has data, use it).
  // However, the issue is that sanity data might be incomplete (missing images).
  const massages = sanityMassages.length > 0 ? sanityMassages : FALLBACK_MASSAGES

  return (
    <section className="py-24 bg-[#fff7d3]">
      <div className="container mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <p className="text-xs font-medium uppercase tracking-luxury text-gold mb-3">
            NOSSOS SERVIÇOS
          </p>
          <h2 className="text-4xl md:text-5xl font-philosopher text-white">
            Experiências Sensoriais
          </h2>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {massages.map((massage: any) => {
             const imageUrl = massage.image ? urlFor(massage.image).url() : (massage.fallbackImage || PLACEHOLDER_IMAGE)
             
             return (
              <FadeInItem key={massage._id} className="group relative overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={massage.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                </div>
                
                <div className="p-10">
                  <h3 className="text-3xl font-serif text-slate-900 mb-4 group-hover:text-gold transition-colors duration-300">
                    {massage.title}
                  </h3>
                  <p className="text-slate-700 mb-8 leading-relaxed text-lg">
                    {massage.description}
                  </p>
                  <Link 
                    href={`/massagens/${massage.slug.current}`}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gold hover:text-primary-hover transition-colors group-hover:translate-x-2 duration-300"
                  >
                    Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </FadeInItem>
            )
          })}
        </FadeInStagger>
        
        <FadeIn className="text-center mt-16" delay={0.4}>
           <Link
            href="/massagens"
            className="inline-flex items-center justify-center border border-slate-900 px-10 py-4 text-xs font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 hover:shadow-lg"
           >
             Ver Todas as Massagens
           </Link>
        </FadeIn>
      </div>
    </section>
  )
}
