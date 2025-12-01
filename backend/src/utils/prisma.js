import { PrismaClient } from '@prisma/client';

let prisma;

// Prevent multiple Prisma instances during hot reloads (important for dev)
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

export default prisma;

export async function connectDB() {
    try {
        await prisma.$connect();
        console.log("Connected to Prisma Database");
    } catch (err) {
        console.error("Prisma DB connection error:", err);
        process.exit(1);
    }
}
