import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'WSGQQ213',
  database: 'content_pilot',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'admin@contentpilot.dev' },
    update: {},
    create: {
      email: 'admin@contentpilot.dev',
      name: 'ContentPilot Admin',
      password: 'admin123456',
    },
  });

  const channelNames = [
    'Frontend',
    'Backend',
    'Database',
    'Engineering',
    'Project Notes',
  ];

  for (const name of channelNames) {
    await prisma.channel.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const frontendChannel = await prisma.channel.findUnique({
    where: { name: 'Frontend' },
  });

  if (frontendChannel) {
    await prisma.article.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: 'Getting Started with ContentPilot',
        content: 'This is the first sample article in ContentPilot.',
        status: 'PUBLISHED',
        coverType: 'NONE',
        authorId: user.id,
        channelId: frontendChannel.id,
        publishedAt: new Date(),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });