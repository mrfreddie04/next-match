import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { membersData } from "./membersData";

const prisma = new PrismaClient();

async function seedMembers() {
  return membersData.map( async (member) => {
    return prisma.user.create( {data: { 
      name: member.name, 
      email: member.email, 
      emailVerified: new Date(),
      passwordHash: await hash("password", 10),
      image: member.image,
      member: {
        create: {
          name: member.name,
          image: member.image,
          gender: member.gender,
          dateOfBirth: new Date(member.dateOfBirth),
          description: member.description,
          city: member.city,
          country: member.country,    
          createdAt: new Date(member.created), 
          updatedAt: new Date(member.lastActive),
          photos: {
            create: {
              url: member.image
            }
          }
        }
      }
    }});
  })
}

async function main() {
  await seedMembers();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally( async () => {
  await prisma.$disconnect(); //dispose of the prisma instance
});