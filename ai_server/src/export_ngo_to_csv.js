// Array of possible tags
const tags = [
  "רווחה",
  "מורשת או הנצחה",
  "סביבה ובעלי חיים",
  "התנדבות וקרנות פילנטרופיות",
  "שיכון ופיתוח עירוני",
  "קהילה וחברה",
  "דת"
];

// Simple CSV escape: wrap in quotes and escape inner quotes
function csvEscape(value) {
  if (value === null || value === undefined) return '""';
  const str = value.toString().replace(/"/g, '""');
  return `"${str}"`;
}

// Header line
print("name,ngoNumber,description,tags");

// Cursor over ngos collection
const cursor = db.ngos.find(
  {},
  {
    name: 1,
    ngoNumber: 1,
    description: 1
  }
);

cursor.forEach(doc => {
  const randomTag = tags[Math.floor(Math.random() * tags.length)];

  const line = [
    csvEscape(doc.name),
    csvEscape(doc.ngoNumber),
    csvEscape(doc.description),
    csvEscape(randomTag)
  ].join(",");

  print(line);
});


// ../../../mongosh-2.5.9-win32-x64/bin/mongosh "mongodb://localhost:27017/donatchain" --file export_ngo_to_csv.js > ngo.csv