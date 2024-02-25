import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const newUser = await prisma.user.create({
    data: {
        Profile:{
            create: {
                email: "arogya.bic@gmail.com", 
                password: "123456",
                // name: "Arogya bicpuria",
                bio: "I am arogya bicpuria",
                image: "https://www.google.com",
                phoneNumber: "8989748248",
                
            }
            
        }
      // ...other fields...
    },
  });

  console.log('Created new user: ', newUser);

  // Add additional logic to create conversations, messages, etc.
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
