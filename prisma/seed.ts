import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const nodeChallenge = await prisma.challenge.create({
    data: {
      title: 'Desafio Node JS',
      description: 'Detalhes do desafio Node JS',
      Submission: {
        create: [
          {
            repositoryUrl: 'https://github.com/user/link-do-repositorio.git',
            grade: 0,
            status: 'PENDING',
          },
        ],
      },
    },
  });

  console.log({ nodeChallenge });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
