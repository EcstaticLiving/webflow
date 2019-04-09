/*
wt create blogs.js --name eli-webflow-blogs --secret WEBFLOW=__TOKEN__ --parse-body
*/

const Sheetsu = require('sheetsu-node')
const Webflow = require('webflow-api')

module.exports = (body, callback) => {
 
	const ids = {
		site: '5c6dba8ca6c5f280b99da20d',
		collection: {
			blogposts: '5c89c609372666477496ff9e',
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

	const sheetsu = Sheetsu({ address: 'https://sheetsu.com/apis/v1.0su/b5300bfb6db8/sheets/Blogs' })
	const webflow = new Webflow({ token: body.secrets.WEBFLOW })
	
	// Cycle through collection to get each field ID
	/*
		const items = webflow.items({ collectionId: ids.collection.blogposts })
		items.then(i => console.log(i.items[0]))
	*/

	// Cycle through collection to get each item ID
	/*
		const items = webflow.items({ collectionId: ids.collection.blogposts })
		items.then(i => {
			i.items.forEach(item => console.log(item['_id'], item['slug']))
		})
	*/

	// STEP 1: Get spreadsheet data
	// /*
	sheetsu.read()
		.then(sheetBlogPostsJson => {
			const sheetBlogPosts = JSON.parse(sheetBlogPostsJson)

			// STEP 2: Get blog posts from Webflow
			const wfBlogPostsCollection = webflow.items({ collectionId: ids.collection.blogposts })
			wfBlogPostsCollection.then(i => {

				const wfBlogPosts = i.items

				// STEP 3: Cycle through each Webflow blog post and update blog post with sheet data. Add slight timeout since `JSON.parse(sheetBlogPostsJson)` appears to be async.
				setTimeout(() => {
					for (let wfRow = 0; wfRow < wfBlogPosts.length; wfRow++) {
						const wfBlogPost = wfBlogPosts[wfRow]

						// Find sheet blog post by Webflow’s ID
						const sheetBlogPost = sheetBlogPosts.filter(sheetBlogPost => sheetBlogPost['_id'] === wfBlogPost['_id'])[0]

						// Create image object and teachers array
						const updatedSheetBlogPost = {
							...sheetBlogPost,
							'image': { fileId: '', url: sheetBlogPost['image-url'] }
							// 'open-graph-images': { fileId: '', url: sheetBlogPost['og-image-url'] }
						}

						// Combine Webflow blog post with sheet blog post, but give preference to sheet values
						let updatedBlogPost = {
							...wfBlogPost,
							...updatedSheetBlogPost
						}

						// Remove key/values that cannot be updated in Webflow
						delete updatedBlogPost['']
						delete updatedBlogPost['_id']
						delete updatedBlogPost['image-url']
						delete updatedBlogPost['og-image-url']
						delete updatedBlogPost['updated-on']
						delete updatedBlogPost['updated-by']
						delete updatedBlogPost['created-on']
						delete updatedBlogPost['created-by']
						delete updatedBlogPost['published-on']
						delete updatedBlogPost['published-by']
						updatedBlogPost['_draft'] = false

						// Update Webflow
						const updateWfBlogPost = webflow.updateItem({
							collectionId: ids.collection.blogposts,
							itemId: wfBlogPost['_id'],
							fields: updatedBlogPost
						})

						// Add timeout to circumvent 60 items per minute rate limitation
						setTimeout(() => {
							updateWfBlogPost
								// END
								.then(i => {
									console.log('Updated blog post: ' + updatedBlogPost['name'])
									if (wfRow === wfBlogPosts.length - 1) {
										callback(null, {
											done: 'Webflow should now be updated. Please refresh Webflow to see the results.'
										})
									}
								})
								.catch(err => {
									console.log('Error with blog post: ' + updatedBlogPost['name'])
									console.error(err)
									callback(null, {
										error: {
											blogPost: updatedBlogPost['name'],
											message: err.msg,
											problem: err.problems
										}
									})
								})
						}, 2000)

					}
				}, 1000)

			})

		})
		.catch(err => console.error(err))
		// */

}