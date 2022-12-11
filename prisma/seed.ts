import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.category.create({
    data: {
      name: "Personal",
      color: "#FF0000",
      userId: user.id,
    },
  });

  await prisma.category.create({
    data: {
      name: "Groceries",
      color: "#00FF00",
      userId: user.id,
    },
  });

  await prisma.category.create({
    data: {
      name: "Gifts",
      color: "#0000FF",
      userId: user.id,
    },
  });

  await prisma.category.create({
    data: {
      name: "Health",
      color: "#FFFF00",
      userId: user.id,
    },
  });

  await prisma.category.create({
    data: {
      name: "Work",
      color: "#FF00FF",
      userId: user.id,
    },
  });

  await prisma.category.create({
    data: {
      name: "Travel",
      color: "#00FFFF",
      userId: user.id,
    },
  });

  await prisma.category.create({
    data: {
      name: "Studying",
      color: "#000000",
      userId: user.id,
    },
  });

  await prisma.category.create({
    data: {
      name: "Entertainment",
      color: "#FFFFFF",
      userId: user.id,
    },
  });

  await prisma.category.create({
    data: {
      name: "Savings",
      color: "#FF8000",
      userId: user.id,
    },
  });

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
  });

  // seed salaries ;)
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    date.setDate(5);
    date.setFullYear(2022);
    await prisma.record.create({
      data: {
        info: "Salary",
        date: date,
        value: 10000 + Math.random() * 1000,
        userId: user.id,
        categoryId: categories.find((c) => c.name === "Work")?.id,
      },
    });
  }

  // seed more expenses
  for (let i = 0; i < 2000; i++) {
    const date = new Date();
    date.setMonth(0);
    date.setDate(1);
    date.setDate(date.getDate() - i);
    date.setFullYear(2022);
    await prisma.record.create({
      data: {
        info: `Expense ${i}`,
        date: date,
        value: -(Math.random() * 100 + Math.random() * 1000),
        userId: user.id,
        categoryId:
          categories[Math.floor(Math.random() * categories.length)].id,
      },
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
