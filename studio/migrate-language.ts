import { createClient } from '@sanity/client'

const client = createClient({
    projectId: 'argneoi8',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    // This token needs to be provided by the user or assumed from local config if using 'sanity exec'
    // But for 'sanity exec', the client is usually pre-configured.
    // Let's assume we run this with `sanity exec`.
})

const fetchDocuments = async () => {
    // Fetch all projects that do NOT have a language field
    const query = `*[_type == "project" && !defined(language)][0...100]`
    const docs = await client.fetch(query)
    console.log(`Found ${docs.length} documents to migrate.`)
    return docs
}

const migrate = async () => {
    const docs = await fetchDocuments()

    if (docs.length === 0) {
        console.log('No documents need migration.')
        return
    }

    const transaction = client.transaction()

    docs.forEach(doc => {
        transaction.patch(doc._id, p => p.set({ language: 'en' }))
    })

    try {
        const result = await transaction.commit()
        console.log('Migration successful!', result)
    } catch (err) {
        console.error('Migration failed:', err)
    }
}

migrate()
