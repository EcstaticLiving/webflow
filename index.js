/*
Sheetsu API for each sheet: https://sheetsu.com/apis/v1.0su/b5300bfb6db8/sheets/Events
wt create index.js --name eli-webflow --secret WEBFLOW=__TOKEN__ --parse-body
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

	const sheetsu = Sheetsu({ address: 'https://sheetsu.com/apis/v1.0su/b5300bfb6db8/sheets/Events' })
	const webflow = new Webflow({ token: body.secrets.WEBFLOW })
	
	// Cycle through each collection to get each item ID
	/*
		const items = webflow.items({ collectionId: ids.collection.events })
		items.then(i => console.log(i.items[0]))
	*/

	// STEP 1: Get spreadsheet data
	// /*

	let eventErrors = []

	sheetsu.read()
		.then(sheetEventsJson => {
			const sheetEvents = JSON.parse(sheetEventsJson)

			// STEP 2: Get events from Webflow
			const wfEventsCollection = webflow.items({ collectionId: ids.collection.events })
			wfEventsCollection.then(i => {

				const wfEvents = i.items

				// STEP 3: Cycle through each Webflow event and update event with sheet data
				wfEvents.forEach((wfEvent, wfRow) => {

					// Add slight timeout since `JSON.parse(sheetEventsJson)` appears to be async
					setTimeout(() => {
						// Find sheet event by Webflow’s ID
						const sheetEvent = sheetEvents.filter(sheetEvent => sheetEvent['_id'] === wfEvent['_id'])[0]

						// Create image object and teachers array
						const updatedSheetEvent = { ...sheetEvent, 'open-graph-image-2': { fileId: '', url: sheetEvent['og-url'] }, 'teacher-s': [...sheetEvent['teacher-s'].split(',')] }

						// Combine Webflow event with sheet event, but give preference to sheet values
						let updatedEvent = { ...wfEvent, ...updatedSheetEvent }

						// Remove key/values that cannot be updated in Webflow
						delete updatedEvent['']
						delete updatedEvent['_id']
						delete updatedEvent['og-url']
						delete updatedEvent['updated-on']
						delete updatedEvent['updated-by']
						delete updatedEvent['created-on']
						delete updatedEvent['created-by']
						delete updatedEvent['published-on']
						delete updatedEvent['published-by']

						// Update Webflow
						const updateWfEvent = webflow.updateItem({
							collectionId: ids.collection.events,
							itemId: wfEvent['_id'],
							fields: updatedEvent
						})
						updateWfEvent
							// END
							.then(i => {
								if (wfRow === wfEvents.length - 1) {
									console.log('Updated event: ' + updatedEvent['name'])
									callback(null, {
										done: 'Webflow should now be updated. Please refresh Webflow to see the results.',
										errors: eventErrors
									})
								}
								else {
									console.log('Updated event: ' + updatedEvent['name'])
								}
							})
							.catch(err => {
								console.log('Error with event: ' + updatedEvent['name'])
								console.error(err)
								const bugReport = {
									event: updatedEvent['name'],
									error: err
								}
								eventErrors.push(bugReport)
							})

					}, 1000)

				})

			})

		})
		.catch(err => console.error(err))
		// */

}