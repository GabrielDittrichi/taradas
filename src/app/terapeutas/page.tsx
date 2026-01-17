import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"

async function getTherapists() {
  const query = `*[_type == "therapist"] | order(name asc) {
    _id,
    name,
    "specialties": specialties[]->title,
    image,
    slug
  }`
  const data = await client.fetch(query)
  return data
}

export default async function TherapistsPage() {
  const therapists = await getTherapists()

  return (
    <main className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-medium uppercase tracking-luxury text-gold mb-3">
            NOSSA EQUIPA
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900">
            Terapeutas
          </h1>
        </div>

        {therapists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">Nenhuma terapeuta encontrada no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {therapists.map((therapist: any) => {
              const imageUrl = therapist.image ? urlFor(therapist.image).url() : null
              
              if (!imageUrl) return null

              return (
                <Link 
                  key={therapist._id} 
                  href={`/terapeutas/${therapist.slug?.current || '#'}`}
                  className="group cursor-pointer block"
                >
                  <div className="relative h-[450px] w-full overflow-hidden mb-6 bg-slate-100 shadow-sm">
                    <Image
                      src={imageUrl}
                      alt={therapist.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                      <h3 className="text-3xl font-serif text-white mb-2">{therapist.name}</h3>
                      <p className="text-xs uppercase tracking-luxury text-gold font-medium">
                        {therapist.specialties ? therapist.specialties.join(" • ") : ""}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
