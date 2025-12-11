import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Company
  const company = await prisma.company.upsert({
    where: { slug: 'orbithr' },
    update: {},
    create: {
      name: 'OrbitHR Demo',
      slug: 'orbithr',
      country: 'SRI_LANKA',
      currency: 'LKR',
      taxRules: {
        taxFreeThreshold: 100000,
        brackets: [
          { min: 100000, max: 141667, rate: 0.06 },
          { min: 141667, max: 183333, rate: 0.12 },
          { min: 183333, max: 225000, rate: 0.18 },
          { min: 225000, max: 266667, rate: 0.24 },
          { min: 266667, max: 308333, rate: 0.30 },
          { min: 308333, max: null, rate: 0.36 },
        ],
      },
      settings: {
        theme: 'rooster',
        logo: '/logo.png',
      },
    },
  });

  console.log(`🏢 Created company: ${company.name}`);

  // 2. Create Screening Templates
  const template = await prisma.screeningTemplate.create({
    data: {
      name: 'Standard Developer Fit',
      type: 'BALANCED',
      systemPrompt: 'Analyze the candidate for technical skills and cultural fit.',
      evaluationCriteria: { technical: 50, cultural: 30, communication: 20 },
      culturalValues: ['Innovation', 'Teamwork', 'Transparency'],
      companyId: company.id,
      isDefault: true,
    },
  });

  // 3. Create Jobs
  const job = await prisma.job.create({
    data: {
      title: 'Senior Full Stack Engineer',
      description: 'We are looking for an experienced Full Stack Engineer to join our team.',
      requirements: 'React, Node.js, TypeScript, PostgreSQL',
      country: 'SRI_LANKA',
      location: 'Colombo (Remote)',
      salaryMin: 250000,
      salaryMax: 450000,
      currency: 'LKR',
      department: 'Engineering',
      employmentType: 'Full-time',
      status: 'OPEN',
      keySkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      companyId: company.id,
      screeningTemplateId: template.id,
    },
  });

  console.log(`💼 Created job: ${job.title}`);

  // 4. Create Employees (Dummy Data)
  const employees = [
    {
      firstName: 'Amika',
      lastName: 'Fernando',
      email: 'amika@orbithr.test',
      role: UserRole.HR_MANAGER,
      position: 'HR Manager',
      salary: 150000,
    },
    {
      firstName: 'Kasun',
      lastName: 'Perera',
      email: 'kasun@orbithr.test',
      role: UserRole.EMPLOYEE,
      position: 'Software Engineer',
      salary: 250000,
    },
    {
      firstName: 'Nimal',
      lastName: 'Silva',
      email: 'nimal@orbithr.test',
      role: UserRole.EMPLOYEE,
      position: 'Product Manager',
      salary: 300000,
    },
  ];

  for (const emp of employees) {
    await prisma.user.create({
      data: {
        ...emp,
        companyId: company.id,
        clerkId: `mock_clerk_${emp.firstName.toLowerCase()}`, // Placeholder
      },
    });
  }

  console.log(`👥 Created ${employees.length} employees`);

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
