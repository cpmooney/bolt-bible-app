import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'cards.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    let cards = [];
    if (fs.existsSync(dataFile)) {
      const fileContent = fs.readFileSync(dataFile, 'utf8');
      cards = JSON.parse(fileContent);
    }

    // Sort cards by score (ascending) and last reviewed date
    cards.sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return new Date(a.lastReviewed || 0) - new Date(b.lastReviewed || 0);
    });

    // Return the first card with score 0 or the card with the lowest score
    const nextCard = cards.find(card => card.score === 0) || cards[0];

    if (nextCard) {
      res.status(200).json(nextCard);
    } else {
      res.status(404).json({ message: 'No cards available' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}