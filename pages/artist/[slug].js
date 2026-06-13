import fs from 'fs'
import path from 'path'
import Link from 'next/link'

export default function Artist({ artist }){
  if(!artist) return <div>Artist not found</div>
  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h1>{artist.name}</h1>
      <p><Link href="/"><a>Home</a></Link></p>
      <ul>
        {artist.songs.map((s, i)=> (
          <li key={i} style={{marginBottom:12}}>
            <div>{s.title}</div>
            <audio controls src={s.file} style={{display:'block',marginTop:6}} />
            <a href={s.file} download>Download</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function getStaticPaths(){
  const contentDir = path.join(process.cwd(),'content')
  const artists = JSON.parse(fs.readFileSync(path.join(contentDir,'artists.json'),'utf8'))
  const paths = artists.map(a=>({ params: { slug: a.slug } }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }){
  const contentDir = path.join(process.cwd(),'content')
  const artists = JSON.parse(fs.readFileSync(path.join(contentDir,'artists.json'),'utf8'))
  const artistMeta = artists.find(a=>a.slug===params.slug) || null
  if(!artistMeta) return { props: { artist: null } }
  const coll = JSON.parse(fs.readFileSync(path.join(contentDir,artistMeta.folder,'collection.json'),'utf8'))
  return { props: { artist: { ...artistMeta, songs: coll.songs } } }
}
