// fetch-collection.mjs
// Downloads your Discogs collection and saves it as collection.json.
// Run from the folder where you want collection.json to appear (needs Node 18+):
//   DISCOGS_USER=yourname DISCOGS_TOKEN=yourtoken node fetch-collection.mjs
// Your token stays on your computer. It is never written into the website files.

import { writeFile } from "node:fs/promises";

const user = process.env.DISCOGS_USER;
const token = process.env.DISCOGS_TOKEN;
if (!user || !token) {
  console.error("Please set DISCOGS_USER and DISCOGS_TOKEN first (see the top of this file).");
  process.exit(1);
}

const headers = {
  "User-Agent": "PersonalRecordGallery/1.0",
  Authorization: `Discogs token=${token}`,
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const records = [];
let page = 1;
let pages = 1;

while (page <= pages) {
  // folder 0 = "All" (your whole collection)
  const url =
    `https://api.discogs.com/users/${encodeURIComponent(user)}` +
    `/collection/folders/0/releases?per_page=100&page=${page}&sort=added&sort_order=desc`;

  const res = await fetch(url, { headers });

  if (res.status === 429) {
    console.log("Discogs asked us to slow down. Waiting 60 seconds...");
    await sleep(60000);
    continue; // try the same page again
  }
  if (!res.ok) {
    console.error(`Discogs error ${res.status}:`, await res.text());
    process.exit(1);
  }

  const data = await res.json();
  pages = data.pagination.pages;

  for (const item of data.releases) {
    const b = item.basic_information;
    records.push({
      id: b.id,
      title: b.title,
      // Discogs adds "(2)" to tell apart artists with the same name; strip it
      artist: (b.artists || []).map((a) => a.name.replace(/\s\(\d+\)$/, "")).join(", "),
      year: b.year || null,
      label: b.labels?.[0]?.name || "",
      catno: b.labels?.[0]?.catno || "",
      genre: (b.genres || []).join(", "),
      format: (b.formats || [])
        .map((f) => [f.name, ...(f.descriptions || [])].join(", "))
        .join(" / "),
      cover: b.cover_image || "",
      url: `https://www.discogs.com/release/${b.id}`,
    });
  }

  console.log(`Fetched page ${page} of ${pages} (${records.length} records so far)`);
  page++;
  await sleep(1100); // stay well under the rate limit
}

await writeFile("collection.json", JSON.stringify(records));
console.log(`Done! Saved ${records.length} records to collection.json`);
