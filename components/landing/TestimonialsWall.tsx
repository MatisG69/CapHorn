'use client'

import { TestimonialsColumn, type Testimonial } from './TestimonialsColumn'

const av = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=B8922A&color=fff&bold=true&size=80`

// ⚠️ Avis de démonstration — à remplacer par de vrais témoignages clients.
const testimonials: Testimonial[] = [
  { text: "Cap Horn a décroché un taux que ma banque refusait. Dossier bouclé en trois semaines.", image: av('Julie L'), name: 'Julie L.', role: 'Primo-accédante, Lille' },
  { text: "Un seul interlocuteur du premier appel à la signature. Guillaume a tout négocié à ma place.", image: av('Marc D'), name: 'Marc D.', role: "Chef d'entreprise, Roubaix" },
  { text: "On nous disait notre dossier impossible à financer. Ils ont trouvé la banque qui a dit oui.", image: av('Sophie K'), name: 'Sophie & Karim', role: 'Investisseurs locatifs' },
  { text: "Près de 18 000 € économisés sur l'assurance de mon prêt grâce à la délégation.", image: av('Antoine R'), name: 'Antoine R.', role: 'Cadre, Marcq-en-Barœul' },
  { text: "Réactivité impressionnante : rappelé sous 24 h, accompagné jusque chez le notaire.", image: av('Elodie M'), name: 'Élodie M.', role: 'Résidence principale' },
  { text: "Le financement de mon cabinet a été monté sur mesure. Un service vraiment haut de gamme.", image: av('Laurent D'), name: 'Dr. Laurent', role: 'Chirurgien-dentiste' },
  { text: "Conseil honnête : orienté vers la solution la plus saine, pas la plus chère pour moi.", image: av('Nadia B'), name: 'Nadia B.', role: 'Regroupement de crédits' },
  { text: "Reprise d'entreprise financée avec un effet de levier optimal. Bluffant de maîtrise.", image: av('Thomas V'), name: 'Thomas V.', role: 'Repreneur' },
  { text: "Accompagnement clair et rassurant de A à Z. Je recommande les yeux fermés.", image: av('Camille P'), name: 'Camille P.', role: 'Investissement locatif' },
]

const first = testimonials.slice(0, 3)
const second = testimonials.slice(3, 6)
const third = testimonials.slice(6, 9)

export default function TestimonialsWall() {
  return (
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
      <TestimonialsColumn testimonials={first} duration={17} />
      <TestimonialsColumn testimonials={second} className="hidden md:block" duration={21} />
      <TestimonialsColumn testimonials={third} className="hidden lg:block" duration={19} />
    </div>
  )
}
