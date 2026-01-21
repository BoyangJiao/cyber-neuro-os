// Query for Project Deck (Landing Page)
export const PROJECTS_QUERY = `*[_type == "project"] | order(_createdAt desc) {
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
export const PROJECT_DETAIL_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  heroImage,
  coreMetrics,
  sidebar,
  contentModules[] {
    _key,
    title,
    theme,
    layout,
    content,
    media
  }
}`;
