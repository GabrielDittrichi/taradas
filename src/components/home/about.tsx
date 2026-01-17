import Image from "next/image"
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/motion"

export function About() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image Grid */}
          <div className="w-full md:w-1/2 relative">
            <FadeInStagger className="grid grid-cols-2 gap-4">
               <FadeInItem className="relative h-64 md:h-80 w-full rounded-none overflow-hidden mt-8">
                 <Image
                   src="https://images.unsplash.com/photo-1620733723572-11c52f7c2d82?q=80&w=1974&auto=format&fit=crop"
                   alt="Detalhe do ambiente"
                   fill
                   className="object-cover"
                 />
               </FadeInItem>
               <FadeInItem className="relative h-64 md:h-80 w-full rounded-none overflow-hidden">
                 <Image
                   src="https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?q=80&w=2069&auto=format&fit=crop"
                   alt="Sala de massagem"
                   fill
                   className="object-cover"
                 />
               </FadeInItem>
            </FadeInStagger>
            {/* Decorative Element */}
            <div className="absolute -z-10 top-0 right-0 w-2/3 h-full bg-slate-50 translate-x-1/4 -translate-y-8" />
          </div>

          {/* Content */}
          <FadeIn className="w-full md:w-1/2 space-y-6" delay={0.3}>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              O Espaço
            </p>
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight">
              Um santuário de discrição e elegância
            </h2>
            <p className="text-slate-700 leading-relaxed text-lg">
              Localizado no coração de Lisboa, o Magnolia Lunar foi desenhado para ser o seu refúgio privado. Cada detalhe, da iluminação suave aos aromas envolventes, é pensado para desconectar você do mundo exterior.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Dispomos de suites privadas com duche, garantindo total conforto e higiene antes e depois da sua sessão. O nosso ambiente é estritamente profissional e seguro.
            </p>
            
            <div className="pt-4">
                <ul className="space-y-3">
                    <li className="flex items-center text-slate-700">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full mr-3" />
                        Ambiente Climatizado e Acústico
                    </li>
                    <li className="flex items-center text-slate-700">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full mr-3" />
                        Duche Privativo em Todas as Salas
                    </li>
                    <li className="flex items-center text-slate-700">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full mr-3" />
                        Fácil Acesso e Discrição Total
                    </li>
                </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
