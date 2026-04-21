const fs = require('fs');
const path = require('path');
const dir = './src/data/projects';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
const ts = Date.now();

for (const file of files) {
    const p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');

    // For shoeStore.ts
    content = content.replace(
        /image:\s*"https:\/\/raw\.githubusercontent\.com\/arnofrxdd\/portfolio\/main\/Screenshot%202026-01-11%20234842\.png"/g,
        `image: "https://opengraph.githubassets.com/1/zeenutt769/shoe-store?v=${ts}"`
    );

    // For shoppingScraper.ts
    content = content.replace(
        /image:\s*"https:\/\/raw\.githubusercontent\.com\/arnofrxdd\/portfolio\/main\/scrapper\.png"/g,
        `image: "https://opengraph.githubassets.com/1/zeenutt769/bazzarly-backend?v=${ts}"`
    );

    // Add cache buster to existing opengraph urls if not present
    content = content.replace(
        /image:\s*"https:\/\/opengraph\.githubassets\.com\/1\/([^\/]+)\/([^"?!]+)"/g,
        `image: "https://opengraph.githubassets.com/1/$1/$2?v=${ts}"`
    );

    fs.writeFileSync(p, content);
}
console.log('Fixed project image URLs');
