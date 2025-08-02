import { PrismaClient } from "./src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.todo.deleteMany(); // Clear existing data

  await prisma.todo.createMany({
    data: [
      { title: "Learn Hono", completed: true },
      { title: "Build a Todo App" },
      { title: "Deploy to Vercel" },
    ],
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
