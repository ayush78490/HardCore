import { prisma } from '@/lib/prisma';

const defaultGames = [
  {
    id: 1,
    title: "Catizen",
    description: "A brain storming puzzle game where you combine tiles to reach 2048.",
    image: "/images/catizen.png",
    url: "https://catizen-nine.vercel.app/",
    isActive: true,
  },
  {
    id: 2,
    title: "Knightfall",
    description: "A survival game where you play as a knight defending against waves of enemies.",
    image: "/images/default-game.png",
    url: "https://knight-fall-core.vercel.app/",
    isActive: true,
  },
  {
    id: 3,
    title: "Snow Boarder",
    description: "Snow Boarder is an exciting game where you navigate through snowy slopes.",
    image: "/images/snowman.png",
    url: "https://knight-fall-core.vercel.app/",
    isActive: true,
  },
  {
    id: 4,
    title: "Shooting Wizard",
    description: "A shooting game where you play as a wizard battling against various enemies.",
    image: "/images/spaceInvader.png",
    url: "https://danielzlatanov.github.io/softuni-wizard/",
    isActive: true,
  },
  {
    id: 5,
    title: "Space Invaders",
    description: "A classic arcade game where you defend against waves of alien invaders.",
    image: "/images/spaceGame.png",
    url: "https://space-invaders-by-tesfamichael-tafere.netlify.app/",
    isActive: true,
  },
];

async function seed() {
  for (const game of defaultGames) {
    await prisma.game.upsert({
      where: { id: game.id },
      update: {
        title: game.title,
        description: game.description,
        isActive: game.isActive,
        gameUrl: game.url,
      },
      create: {
        id: game.id,
        title: game.title,
        description: game.description,
        isActive: game.isActive,
        gameUrl: game.url,
      },
    });
  }
  console.log('Database seeded with default games');
}

seed()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });