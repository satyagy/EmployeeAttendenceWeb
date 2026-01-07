{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11900\viewh16840\viewkind1
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ PrismaClient \} from '@prisma/client';\
\
const prisma = new PrismaClient();\
\
async function main() \{\
  const users = await prisma.user.findMany(); // adjust model name\
  console.log('Users:', users);\
\}\
\
main()\
  .catch(console.error)\
  .finally(() => prisma.$disconnect());\
}