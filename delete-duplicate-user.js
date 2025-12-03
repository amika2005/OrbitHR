
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const emailToDelete = 'amikafnando123@gmail.com';
  
  const user = await prisma.user.findUnique({
    where: { email: emailToDelete }
  });

  if (!user) {
    console.log(`User with email ${emailToDelete} not found.`);
    return;
  }

  console.log(`Deleting user: ${user.firstName} ${user.lastName} (${user.email}) - ID: ${user.id}`);

  await prisma.user.delete({
    where: { email: emailToDelete }
  });

  console.log('User deleted successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
