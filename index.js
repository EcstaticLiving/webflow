/*
wt create index.js --name eli-webflow --secret WEBFLOW=__TOKEN__ --parse-body
*/
module.exports = (body, callback) => {

  const ids = {
    site: '5c6dba8ca6c5f280b99da20d',
    category: {
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

	const Webflow = require('webflow-api')
  const webflow = new Webflow({ token: body.secrets.WEBFLOW })
  
  // Sheetsu API for each sheet: https://sheetsu.com/apis/v1.0su/b5300bfb6db8/sheets/Events

  // END
  callback()

}