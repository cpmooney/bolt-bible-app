import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'cards.json');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { id, score } = req.body;

    let cards = [];
    if (fs.existsSync(dataFile)) {
      const fileContent = fs.readFileSync(dataFile, 'utf8');
      cards = JSON.parse(fileContent);
    }

    const cardIndex = cards.findIndex(card => card.id === id);
    if (cardIndex !== -1) {
      cards[cardIndex].score += score;
      cards[cardIndex].lastReviewed = new Date().toISOString();
      fs.writeFileSync(dataFile, JSON.stringify(cards, null, 2));
      res.status(200).json(cards[cardIndex]);
    } else {
      res.status(404).json({ message: 'Card not found' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}