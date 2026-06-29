import React from 'react'

/**
 * Rendu Markdown minimal et sûr (sans dépendance, sans dangerouslySetInnerHTML).
 * Gère : titres (##, ###), images ![alt](url), citations (>), listes (-),
 * paragraphes, gras (**), liens [texte](url). Tout le reste est échappé par
 * React (texte brut) → pas d'injection HTML.
 */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  // Découpe sur **gras** et [lien](url)
  const regex = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    if (m[2] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-b${i}`}>{m[2]}</strong>)
    } else if (m[4] !== undefined) {
      nodes.push(
        <a key={`${keyPrefix}-l${i}`} href={m[5]} target="_blank" rel="noopener noreferrer">
          {m[4]}
        </a>,
      )
    }
    last = m.index + m[0].length
    i++
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export function BlogContent({ body }: { body: string }) {
  const lines = (body ?? '').replace(/\r\n/g, '\n').split('\n')
  const blocks: React.ReactNode[] = []
  let paragraph: string[] = []
  let list: string[] = []
  let key = 0

  const flushParagraph = () => {
    if (paragraph.length) {
      const txt = paragraph.join(' ')
      blocks.push(<p key={`p${key++}`}>{renderInline(txt, `p${key}`)}</p>)
      paragraph = []
    }
  }
  const flushList = () => {
    if (list.length) {
      blocks.push(
        <ul key={`u${key++}`} className="chc-article__list">
          {list.map((it, idx) => (
            <li key={idx}>{renderInline(it, `u${key}-${idx}`)}</li>
          ))}
        </ul>,
      )
      list = []
    }
  }

  for (const raw of lines) {
    const line = raw.trim()
    const img = line.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/)

    if (line === '') {
      flushParagraph()
      flushList()
    } else if (img) {
      flushParagraph()
      flushList()
      blocks.push(
        <figure key={`f${key++}`} className="chc-article__figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img[2]} alt={img[1]} loading="lazy" />
          {img[1] && <figcaption>{img[1]}</figcaption>}
        </figure>,
      )
    } else if (line.startsWith('### ')) {
      flushParagraph()
      flushList()
      blocks.push(<h3 key={`h3${key++}`}>{renderInline(line.slice(4), `h3${key}`)}</h3>)
    } else if (line.startsWith('## ')) {
      flushParagraph()
      flushList()
      blocks.push(<h2 key={`h2${key++}`}>{renderInline(line.slice(3), `h2${key}`)}</h2>)
    } else if (line.startsWith('> ')) {
      flushParagraph()
      flushList()
      blocks.push(<blockquote key={`q${key++}`}>{renderInline(line.slice(2), `q${key}`)}</blockquote>)
    } else if (line.startsWith('- ')) {
      flushParagraph()
      list.push(line.slice(2))
    } else {
      flushList()
      paragraph.push(line)
    }
  }
  flushParagraph()
  flushList()

  return <div className="chc-article__body">{blocks}</div>
}
