# Sanity Clean Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

## Common CLI Commands

### Local Development
Start the studio locally:
```bash
npm run dev
```
Open [http://localhost:3333](http://localhost:3333) to view it in the browser.

### Deployment (Syncing Schema Changes)
To sync your local schema changes to the hosted Sanity Studio (production):
```bash
npm run deploy
```
**Important:** Your local schema changes will NOT appear on the hosted Sanity Studio website until you successfully run this deploy command.

## Resources
- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)
