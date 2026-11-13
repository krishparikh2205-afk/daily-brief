import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

const parser = new Parser();
const feed = await parser.parseURL('http://feeds.bbci.co.uk/news/world/rss.xml');
const first = feed.items[0];
console.log('BBC title:', first.title);
console.log('BBC link:', first.link);

const res = await fetch(first.link, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
const html = await res.text();
const $ = cheerio.load(html);
const ogImage = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');
console.log('Extracted og:image:', ogImage);
