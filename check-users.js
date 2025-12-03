
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { firstName: { contains: 'Amika', mode: 'insensitive' } },
        { lastName: { contains: 'Fernando', mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
      email: true,
      position: true
    }
  });
  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
