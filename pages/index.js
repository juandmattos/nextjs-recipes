import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { sanityClient, urlFor } from "../lib/sanity"

// groq query
//  http://localhost:3333/vision playground
//    groq.dev (to play around with generic content) 

const recipesQuery = `*[_type == "recipe"]{
  _id,
  name,
  slug,
  mainImage,
}`
// all documents with type recipe and those fields

/*
EXAMPLE:

*[_type == "recipe"]{ ---> Trae todos los documentos recipe pero solo el name de cada uno
  name
}
*/


export default function Home({ recipes }) {
  return (
    <div>
      <Head>
        <title>JDs Kitchen 🍍</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Welcome to JDs Kitchen 🍍</h1>
      {/*recipes folder, slug*/}
      <ul className="recipes-list">
        {recipes?.length > 0 &&
          recipes.map((recipe) => (
            <li key={recipe._id} className="recipe-card">
              <Link href={`/recipes/${recipe.slug.current}`}>
                <a>
                  <img 
                    src={urlFor(recipe.mainImage).url()} 
                    alt={recipe.name}
                  />
                  <span>{recipe.name}</span>
                </a>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  )
}

export async function getStaticProps() {
  const recipes = await sanityClient.fetch(recipesQuery)
  return { props: { recipes } }
}