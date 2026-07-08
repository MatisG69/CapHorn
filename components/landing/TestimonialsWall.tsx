'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { TestimonialsColumn, type Testimonial } from './TestimonialsColumn'

const av = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=B8922A&color=fff&bold=true&size=80`

// Avis clients réels (Google). Tous 5 étoiles.
const testimonials: Testimonial[] = [
  {
    text: "Guillaume m’a accompagnée dans le cadre d’un projet immobilier dans le Var. Il a pris le temps d’étudier ma situation au sérieux et de me conseiller au mieux tout au long de mes démarches. Malheureusement, le bien pour lequel j’avais eu un véritable coup de cœur a finalement été vendu. Malgré cela, j’ai beaucoup apprécié son professionnalisme, sa disponibilité et la qualité de son accompagnement. Je le recommande sans hésitation.",
    image: av('Isabelle Marquant'), name: 'Isabelle Marquant', role: 'Projet immobilier · Var',
  },
  {
    text: "J’ai fait appel à Guillaume dans le cadre d’un investissement locatif dans le Douaisis. Étant gérant de société, il fallait trouver un professionnel apte à nous accompagner dans l’étude de mon dossier. L’accompagnement de Guillaume nous a permis de mieux comprendre comment fonctionnent les exigences des banques dans cette situation et il nous a trouvé un financement avantageux dans les délais ! Je ne peux que le recommander, humainement nous partageons la même volonté du service client 🙏",
    image: av('Warren'), name: 'Warren, Les Dénicheurs', role: 'Investissement locatif · Douaisis',
  },
  {
    text: "Un grand merci pour votre accompagnement. Professionnalisme, disponibilité et conseils de qualité. Je recommande vivement !",
    image: av('Hélène Reaux'), name: 'Hélène Reaux', role: 'Financement immobilier',
  },
  {
    text: "Mr Horn est quelqu’un qui est à l’écoute de votre projet du début à la fin et vous expose toutes les options possibles avec leurs avantages et inconvénients tout en évitant de vous influencer. C’est aussi quelqu’un de très humain qui prend le temps avec vous et qui ne s’arrête pas qu’aux chiffres. Il cherche le meilleur en fonction de votre projet et de votre situation actuelle pour que les deux coïncident le mieux possible.",
    image: av('Guillaume Leroy'), name: 'Guillaume Leroy', role: 'Accompagnement de projet',
  },
  {
    text: "Merci encore pour la clarté des explications et la simulation.",
    image: av('Céline'), name: 'Céline', role: 'Simulation & conseil',
  },
  {
    text: "Merci beaucoup de votre aide concernant notre demande. Vous êtes très à l’écoute des demandes. Réponse rapide.",
    image: av('Bertrand'), name: 'Bertrand', role: 'Demande de financement',
  },
  {
    text: "J’ai été accompagné dans la mise en place d’une stratégie d’investissement en SCPI avec financement. Le montage est particulièrement pertinent, notamment sur la partie crédit qui est très bien optimisée (durée, effort d’épargne, projection). Tout est clair, structuré et cohérent dans le temps, ce qui permet de vraiment se projeter sur la création de revenus passifs à long terme. Je recommande pour le sérieux, la maîtrise du financement et la qualité globale de l’accompagnement.",
    image: av('Maxime H'), name: 'Maxime H.', role: 'Investissement SCPI',
  },
]

// Répartition équilibrée sur 3 colonnes (7 avis → 3 / 2 / 2).
const first = testimonials.filter((_, i) => i % 3 === 0)
const second = testimonials.filter((_, i) => i % 3 === 1)
const third = testimonials.filter((_, i) => i % 3 === 2)

export default function TestimonialsWall() {
  const [selected, setSelected] = useState<Testimonial | null>(null)

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [selected])

  return (
    <>
      <div
        className="chc-testi-wall"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          height: 560,
          overflow: 'hidden',
          maskImage: 'linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)',
        }}
      >
        <TestimonialsColumn testimonials={first} duration={17} onSelect={setSelected} />
        <TestimonialsColumn testimonials={second} className="hidden md:block" duration={21} onSelect={setSelected} />
        <TestimonialsColumn testimonials={third} className="hidden lg:block" duration={19} onSelect={setSelected} />
      </div>

      {selected && (
        <div
          className="chc-testi-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`Avis de ${selected.name}`}
          onClick={() => setSelected(null)}
        >
          <div className="chc-testi-modal__card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="chc-testi-modal__close" onClick={() => setSelected(null)} aria-label="Fermer">
              <X className="w-4 h-4" />
            </button>
            <div className="chc-testi-modal__stars" aria-label="Note : 5 sur 5">★★★★★</div>
            <p className="chc-testi-modal__text">{selected.text}</p>
            <div className="chc-testi-modal__author">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.image} alt={selected.name} width={48} height={48} />
              <div>
                <div className="chc-testi-modal__name">{selected.name}</div>
                <div className="chc-testi-modal__role">{selected.role}</div>
              </div>
              <span className="chc-testi-modal__src">Avis Google</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
