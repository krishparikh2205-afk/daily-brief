const now = new Date();
const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
const dd = String(now.getUTCDate()).padStart(2, '0');
const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${mm}/${dd}`;
console.log('Testing URL:', url);
const res = await fetch(url, { headers: { 'User-Agent': 'DailyBriefBot/1.0 (krishparikh25@users.noreply.github.com)' } });
if (res.ok) {
  const data = await res.json();
  console.log('Selected count:', data.selected?.length);
  console.log('Sample text:', data.selected?.[0]?.text);
  console.log('Sample link:', data.selected?.[0]?.pages?.[0]?.content_urls?.desktop?.page);
} else {
  console.log('Error status:', res.status);
}
