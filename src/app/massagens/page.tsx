import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"

const FALLBACK_MASSAGES = [
  {
    _id: "1",
    title: "Massagem Tântrica",
    description: "Uma jornada de autoconhecimento e despertar sensorial, expandindo a sua capacidade de sentir prazer.",
    image: null,
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
    slug,
    "therapists": *[_type == "therapist" && references(^._id)] {
      _id,
      name,
      image
    }
  }`
  const data = await client.fetch(query)
  return data
}

export default async function MassagesPage() {
  const sanityMassages = await getMassages()
  const massages = sanityMassages.length > 0 ? sanityMassages : FALLBACK_MASSAGES

  return (
    <main className="pt-32 bg-[#ffd7f042] min-h-screen">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium uppercase tracking-luxury text-gold mb-3">
            NOSSOS SERVIÇOS
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900">
            Menu de Massagens
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {massages.map((massage: any) => (
            <div key={massage._id} className="group relative overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={massage.image ? urlFor(massage.image).url() : massage.fallbackImage}
                  alt={massage.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-serif text-slate-900 mb-3 group-hover:text-gold transition-colors duration-300">
                  {massage.title}
                </h3>
                <p className="text-slate-700 mb-6 leading-relaxed text-sm line-clamp-3">
                  {massage.description}
                </p>
                <Link 
                  href={`/massagens/${massage.slug.current}`}
                  className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gold hover:text-primary-hover transition-colors group-hover:translate-x-2 duration-300"
                >
                  Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

                {massage.therapists && massage.therapists.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-2">Disponível com:</p>
                    <div className="flex -space-x-2">
                      {massage.therapists.slice(0, 4).map((therapist: any) => (
                        <div key={therapist._id} className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden" title={therapist.name}>
                          {therapist.image ? (
                            <Image 
                              src={urlFor(therapist.image).width(64).height(64).url()} 
                              alt={therapist.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                              {therapist.name.charAt(0)}
                            </div>
                          )}
                        </div>
                      ))}
                      {massage.therapists.length > 4 && (
                        <div className="relative w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          +{massage.therapists.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
