// Important to connect SANITY with NEXTJS Frontend
// https://github.com/sanity-io/next-sanity
import {
  createClient,
  createPreviewSubscriptionHook,
  createImageUrlBuilder,
  createPortableTextComponent,
} from 'next-sanity'

const config = {
  projectId: 'n9xpvwt2', // from sanity (studio --> sanity.json) (also in managed dashboard)
  dataset: 'production', // from sanity (studio --> sanity.json)
  apiVersion: '2021-03-25', // https://sanity.io/docs/api-versioning (v2021-06-07)
  useCdn: false, // pull from global cashe network or contact lake (In actual prod is true)
}

export const sanityClient = createClient(config)

export const usePreviewSubscription = createPreviewSubscriptionHook(config)

export const urlFor = (source) => createImageUrlBuilder(config).image(source) // the content data

export const PortableText = createPortableTextComponent({
  ...config,
  serializers: {},
})

// TO config CORS --> MANAGED DASHBOARD (https://www.sanity.io/manage/personal/project/n9xpvwt2/settings ---> CORS origins)
