// THis is to do dynamic routing
// not a route for each recipe, this is for all
// next.js changes the slug accordingly
import { useState } from 'react'
import { useRouter} from 'next/router'
import {
  sanityClient,
  urlFor,
  usePreviewSubscription,
  PortableText,
} from '../../lib/sanity'

const recipeQuery = `*[_type == 'recipe' && slug.current == $slug][0]{
      _id,
      name,
      slug,
      mainImage,
      ingredient[]{
        _key,
        unit,
        wholeNumber,
        fraction,
        ingredient->{
          name
        }
      },
      instructions,
      likes
    }`;

export default function OneRecipe({ data, preview }) {
  const router = useRouter()

  if(router.isFallback || !data) {
    return <div>Loading ...</div>
  }
  const { data: recipe } = usePreviewSubscription(recipeQuery, {
    params: { slug: data.recipe?.slug.current },
    initialData: data,
    enabled: preview
  })
  const [likes, setLikes] = useState(data?.recipe?.likes)

  const addLike = async () => {
    const res = await fetch("/api/handle-like", {
      method: "POST",
      body: JSON.stringify({ _id: recipe._id }),
    }).catch((error) => console.log(error));

    const data = await res.json();

    setLikes(data.likes);
  };

  return (
    <article>
      <h1>{recipe.name}</h1>
      <button className="like-button" onClick={addLike}>
        {likes} ❤️
      </button>
      <main className='content'>
        <img src={urlFor(recipe?.mainImage).url()} alt={recipe.name} />
        <div className='breakdown'>
          <ul className='ingredients'>
            {recipe.ingredient?.map((ingredient) => (
              <li key={ingredient._key} className='ingredient'>
                {ingredient?.wholeNumber}
                {ingredient?.fraction} {ingredient?.unit}
                <br />
                {ingredient?.ingredient?.name}
              </li>
            ))}
          </ul>
          <PortableText
            blocks={recipe?.instructions}
            className='instructions'
          />
        </div>
      </main>
    </article>
  )
}

// REALLY IMPORTANT FUNCTIONS TO UNDERSTAND NEXT.js:

// getStaticPaths --> Knowing the address of every house in a neighbourhood
// getStaticProps --> Knowing the people who live in those houses and what they eat, etc


// all this is to get the current slug for getStaticProps
  // slug.current s how it is stored in the studio
export async function getStaticPaths() {
  const paths = await sanityClient.fetch(
    `*[_type == 'recipe' && defined(slug.current)]{
      'params': {
        'slug': slug.current
      }
    }`
  )

  return {
    paths,
    fallback: true, // to handle 404 pages that doesnt exist
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params
  const recipe = await sanityClient.fetch(recipeQuery, { slug })
  return { props: { data: { recipe }, preview: true } }
}