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

  const categoryGroceries = await prisma.category.create({
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

  await prisma.record.create({
    data: {
      info: "Lidl",
      date: new Date("2021-01-01"),
      value: -100.23,
      userId: user.id,
      categoryId: categoryGroceries.id,
    },
  });

  await prisma.record.create({
    data: {
      info: "Aldi",
      date: new Date("2021-01-02"),
      value: -200.23,
      userId: user.id,
      categoryId: categoryGroceries.id,
    },
  });

  await prisma.record.create({
    data: {
      info: "Salary",
      date: new Date("2021-01-03"),
      value: 45000,
      userId: user.id,
    },
  });

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
