"use strict"

const cheerio = require("cheerio")
    , typpy = require("typpy")
    , axios = require("axios")
    , scrapeHTML = require("scrape-it-core")

/**
 * scrapeIt
 * A scraping module for humans.
 *
 * @name scrapeIt
 * @function
 * @param {String|Object} url The page url or request options.
 * @param {Object} opts The options passed to `scrapeHTML` method.
 * @param {Function} cb The callback function.
 * @return {Promise} A promise object resolving with:
 *
 *   - `data` (Object): The scraped data.
 *   - `$` (Function): The Cheeerio function. This may be handy to do some other manipulation on the DOM, if needed.
 *   - `response` (Object): The response object.
 *   - `body` (String): The raw body as a string.
 *
 */
async function scrapeIt (url, opts) {
    const res = await axios.get(url, { headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Accept-Encoding': 'gzip',
      'Cookie': '__gads=ID=6450ad92d5dcf253:T=1698763152:RT=1700676393:S=ALNI_MZ4uiROb2hrpktPbb1c1N0qW75jlA;',
      'Accept-Language': 'id,en-US;q=0.9,en;q=0.8,ja;q=0.7,zh-CN;q=0.6,zh;q=0.5'
    }})
    const $ = cheerio.load(res.data);
    let scrapedData = scrapeIt.scrapeHTML($, opts)
    return Object.assign(res, {
        data: scrapedData,
        body: res.data
    })
}

/**
 * scrapeIt.scrapeHTML
 * Scrapes the data in the provided element.
 *
 * For the format of the selector, please refer to the [Selectors section of the Cheerio library](https://github.com/cheeriojs/cheerio#-selector-context-root-)
 *
 * @name scrapeIt.scrapeHTML
 * @function
 * @param {Cheerio} $ The input element.
 * @param {Object} opts An object containing the scraping information.
 *
 *   If you want to scrape a list, you have to use the `listItem` selector:
 *
 *    - `listItem` (String): The list item selector.
 *    - `data` (Object): The fields to include in the list objects:
 *       - `<fieldName>` (Object|String): The selector or an object containing:
 *          - `selector` (String): The selector.
 *          - `convert` (Function): An optional function to change the value.
 *          - `how` (Function|String): A function or function name to access the
 *            value.
 *          - `attr` (String): If provided, the value will be taken based on
 *            the attribute name.
 *          - `trim` (Boolean): If `false`, the value will *not* be trimmed
 *            (default: `true`).
 *          - `closest` (String): If provided, returns the first ancestor of
 *            the given element.
 *          - `eq` (Number): If provided, it will select the *nth* element.
 *          - `texteq` (Number): If provided, it will select the *nth* direct text child.
 *            Deep text child selection is not possible yet.
 *            Overwrites the `how` key.
 *          - `listItem` (Object): An object, keeping the recursive schema of
 *            the `listItem` object. This can be used to create nested lists.
 *
 *   **Example**:
 *   ```js
 *   {
 *      articles: {
 *          listItem: ".article"
 *        , data: {
 *              createdAt: {
 *                  selector: ".date"
 *                , convert: x => new Date(x)
 *              }
 *            , title: "a.article-title"
 *            , tags: {
 *                  listItem: ".tags > span"
 *              }
 *            , content: {
 *                  selector: ".article-content"
 *                , how: "html"
 *              }
 *            , traverseOtherNode: {
 *                  selector: ".upperNode"
 *                , closest: "div"
 *                , convert: x => x.length
 *              }
 *          }
 *      }
 *   }
 *   ```
 *
 *   If you want to collect specific data from the page, just use the same
 *   schema used for the `data` field.
 *
 *   **Example**:
 *   ```js
 *   {
 *        title: ".header h1"
 *      , desc: ".header h2"
 *      , avatar: {
 *            selector: ".header img"
 *          , attr: "src"
 *        }
 *   }
 *   ```
 *
 * @returns {Object} The scraped data.
 */
scrapeIt.scrapeHTML = scrapeHTML

module.exports = scrapeIt