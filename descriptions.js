/*
wt create descriptions.js --name eli-webflow-descriptions --secret WEBFLOW=__TOKEN__ --parse-body
*/

const Sheetsu = require('sheetsu-node')
const Webflow = require('webflow-api')

module.exports = (body, callback) => {
 
	const ids = {
		site: '5c6dba8ca6c5f280b99da20d',
		collection: {
			blog: '5c89c609372666477496ff9e',
			cancellation: '5c89c609372666077396ffba',
			categories: '5c89c6093726661c8496ff6a',
			descriptions: '5c89c6093726665a2d96ff70',
			durations: '5c89c6093726668eb696ff6c',
			events: '5c89c60937266680c496ff72',
			faqs: '5c926d920b9dce120577ba32',
			faqsctt: '5c927086ebad5605f4b179e3',
			homepage: '5c89c60937266661b796ff2b',
			levels: '5c89c609372666aac396ff6e',
			locations: '5c89c609372666516296ff6b',
			organisers: '5c89c609372666562e96ff73',
			regions: '5c89c609372666583296ffb1',
			reviews: '5c89c60937266683db96ff4e',
			teachers: '5c89c609372666300e96ff71',
			terms: '5c91c27f1aaad780715a1736',
			topics: '5c89c60937266697ff96ff6f',
			types: '5c89c6093726660a4a96ff6d',
			venues: '5c89c609372666f94a96ff61'
		}
	}

	const sheetsu = Sheetsu({ address: 'https://sheetsu.com/apis/v1.0su/b5300bfb6db8/sheets/Descriptions' })
	const webflow = new Webflow({ token: body.secrets.WEBFLOW })
	
	// Cycle through each collection to get each item ID
	/*
		const items = webflow.items({ collectionId: ids.collection.descriptions })
		items.then(i => {
      const descriptions = i.items
      descriptions.forEach(description => console.log(description['_id'], description['slug']))
    })
	*/

	// STEP 1: Get spreadsheet data
	// /*

	sheetsu.read()
		.then(sheetDescriptionsJson => {
			const sheetDescriptions = JSON.parse(sheetDescriptionsJson)

			// STEP 2: Get descriptions from Webflow
			const wfDescriptionsCollection = webflow.items({ collectionId: ids.collection.descriptions })
			wfDescriptionsCollection.then(i => {

				const wfDescriptions = i.items

				// STEP 3: Cycle through each Webflow description and update description with sheet data
				wfDescriptions.forEach((wfDescription, wfRow) => {

					// Add slight timeout since `JSON.parse(sheetDescriptionsJson)` appears to be async
					setTimeout(() => {

						// Find sheet description by Webflow’s ID
            const sheetDescription = sheetDescriptions.filter(sheetDescription => sheetDescription['_id'] === wfDescription['_id'])[0]
            
            // Create image objects and array from `Tags: Other`
            const ogUrl = sheetDescription['og-url']
              ? { fileId: '', url: sheetDescription['og-url'] }
              : ''
            const otherTags = sheetDescription['tags-other-2']
              ? [...sheetDescription['tags-other-2'].split(',')]
              : []
						const updatedSheetDescription = {
              ...sheetDescription,
              'open-graph-image-2': ogUrl,
              'image': { fileId: '', url: sheetDescription['image-url'] },
              'tags-other-2': otherTags
            }

						// Combine Webflow description with sheet description, but give preference to sheet values
						let updatedDescription = { ...wfDescription, ...updatedSheetDescription }

						// Remove key/values that cannot be updated in Webflow
						delete updatedDescription['']
						delete updatedDescription['_id']
            delete updatedDescription['og-url']
            delete updatedDescription['image-url']
						delete updatedDescription['updated-on']
						delete updatedDescription['updated-by']
						delete updatedDescription['created-on']
						delete updatedDescription['created-by']
						delete updatedDescription['published-on']
						delete updatedDescription['published-by']
						updatedDescription['_draft'] = false

						// Update Webflow
						const updateWfDescription = webflow.updateItem({
							collectionId: ids.collection.descriptions,
							itemId: wfDescription['_id'],
							fields: updatedDescription
						})
						updateWfDescription
							// END
							.then(i => {
								console.log('Updated description: ' + updatedDescription['name'])
								if (wfRow === wfDescriptions.length - 1) {
									callback(null, {
										done: 'Webflow should now be updated. Please refresh Webflow to see the results.'
									})
								}
							})
							.catch(err => {
								console.log('Error with description: ' + updatedDescription['name'])
								console.error(err)
								callback(null, {
									error: {
										description: updatedDescription['name'],
										message: err.msg,
										problem: err.problems
									}
								})
							})

					}, 1000)

				})

			})

		})
		.catch(err => console.error(err))
		// */

}