export default function MetaTags(
  path = "",
  title = "",
  description = "",
  keywords = [],
  image = "",
  imageWidth = "",
  imageHeight = "",
  video = "",
  videoWidth = "",
  videoHeight = "",
  audio = ""
) {
  return {
    title: title,
    description: description,
    referrer: "origin-when-cross-origin",
    keywords: keywords,
    authors: [{ name: process.env.AUTHOR, url: process.env.AUTHOR_SITE }],
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    itunes: {
      appId: process.env.APPLE_APP_ID,
      appArgument: process.env.APPLE_APP_ARGUMENT,
    },
    appleWebApp: {
      title: title,
      statusBarStyle: "black-translucent",
    },
    facebook: {
      appId: process.env.FB_APP_ID,
    },
    openGraph: {
      title: title,
      description: description,
      url: `${process.env.URL}/${path}`,
      siteName: process.env.BRAND,
      images: image
        ? [
            {
              url: image,
              width: imageWidth,
              height: imageHeight,
            },
          ]
        : [],
      videos: video
        ? [
            {
              url: video,
              width: videoWidth,
              height: videoHeight,
            },
          ]
        : [],
      audio: audio
        ? [
            {
              url: audio,
            },
          ]
        : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      siteId: process.env.SITE_ID,
      creator: process.env.CREATOR,
      creatorId: process.env.CREATOR_ID,
      images: image ? [image] : [],
    },
  };
}
