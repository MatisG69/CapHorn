/**
 * Injecte un graphe schema.org dans le document.
 *
 * Le contenu provient exclusivement de lib/seo/jsonld.ts (données internes,
 * jamais de saisie utilisateur). JSON.stringify échappe déjà les guillemets ;
 * on neutralise en plus la séquence `</script>` par précaution.
 */
export function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  )
}
