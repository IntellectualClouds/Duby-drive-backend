const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const adminPassword = '12345678'; // Plain text password

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Check if admin role already exists
  let adminRole = await prisma.role.findUnique({
    where: { name: 'Super Admin' },
  });

  if (!adminRole) {
    try {
      // Create the admin role
      adminRole = await prisma.role.create({
        data: {
          name: 'Super Admin',
        },
      });
      console.log('Admin role created');
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('Admin role already exists');
      } else {
        throw error;
      }
    }
  } else {
    console.log('Admin role already exists');
  }

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // Create the admin user
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword, 
        roleId: adminRole.id,
        phoneNumber:"1234564897"
      },
    });

    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
