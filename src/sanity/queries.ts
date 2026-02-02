// Query for Project Deck (Landing Page)
// Query for Project Deck (Landing Page)
// Query for Project Deck (Landing Page)
export const PROJECTS_QUERY = `*[_type == "project" && (language == $language || (!defined(language) && $language == 'en'))] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  "status": sidebar.status,
  "techStack": sidebar.techStack,
  "projectType": sidebar.projectType,
  "timeline": sidebar.timeline,
  "liveUrl": sidebar.liveUrl,
  "heroImage": heroImage.asset->url
}`;

// Query for Project Detail Page
export const PROJECT_DETAIL_QUERY = `*[_type == "project" && slug.current == $slug && (language == $language || (!defined(language) && $language == 'en'))][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  heroImage,
  coreMetrics,
  sidebar,
  contentModules[] {
    _key,
    _type,
    anchorId,
    // Full Width Layout
    _type == "layoutFullWidth" => {
      paddingTop,
      paddingBottom,
      showBottomBorder,
      content[] {
        _key,
        _type,
        _type == "richTextBlock" => { content },
        _type == "mediaBlock" => { image, "videoFile": videoFile{ "asset": asset->{ url } }, video, caption, alt, layout },
        _type == "statsBlock" => { items }
      }
    },
    // Split Layout
    _type == "layoutSplit" => {
      ratio,
      paddingTop,
      paddingBottom,
      showBottomBorder,
      leftSlot[] {
        _key,
        _type,
        _type == "richTextBlock" => { content },
        _type == "mediaBlock" => { image, "videoFile": videoFile{ "asset": asset->{ url } }, video, caption, alt, layout },
        _type == "statsBlock" => { items }
      },
      rightSlot[] {
        _key,
        _type,
        _type == "richTextBlock" => { content },
        _type == "mediaBlock" => { image, "videoFile": videoFile{ "asset": asset->{ url } }, video, caption, alt, layout },
        _type == "statsBlock" => { items }
      }
    },
    // Grid Layout
    _type == "layoutGrid" => {
      columns,
      paddingTop,
      paddingBottom,
      showBottomBorder,
      items[] {
        _key,
        _type,
        _type == "mediaBlock" => { image, "videoFile": videoFile{ "asset": asset->{ url } }, video, caption, alt, layout },
        _type == "statsBlock" => { items }
      }
    }
  }
}`;

