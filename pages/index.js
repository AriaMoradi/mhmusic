import fs from 'fs'
import path from 'path'
import Link from 'next/link'

export default function Home({ artists }) {
  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h1>mhmusic</h1>
      {artists.map(artist=> (
        <div key={artist.slug} style={{marginBottom:24}}>
          <h2><Link href={`/artist/${artist.slug}`}><a>{artist.name}</a></Link></h2>
          <ul>
            {artist.songs.map((s, i) => (
              <li key={i} style={{marginBottom:8}}>
                <div>{s.title}</div>
                <audio controls src={s.file} style={{display:'block',marginTop:6}} />
                <a href={s.file} download>Download</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export async function getStaticProps(){
  const contentDir = path.join(process.cwd(),'content')
  const artists = JSON.parse(fs.readFileSync(path.join(contentDir,'artists.json'),'utf8'))
  const artistsWithSongs = artists.map(a=>{
    const coll = JSON.parse(fs.readFileSync(path.join(contentDir,a.folder,'collection.json'),'utf8'))
    return { ...a, songs: coll.songs }
  })
  return { props: { artists: artistsWithSongs } }
}
