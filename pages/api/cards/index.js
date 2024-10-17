import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'cards.json');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { content, citation } = req.body;
    
    let cards = [];
    if (fs.existsSync(dataFile)) {
      const fileContent = fs.readFileSync(dataFile, 'utf8');
      cards = JSON.parse(fileContent);
    }

    const newCard = {
      id: Date.now().toString(),
      content,
      citation,
      score: 0,
      lastReviewed: null,
    };

    cards.push(newCard);
    fs.writeFileSync(dataFile, JSON.stringify(cards, null, 2));

    res.status(201).json(newCard);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}