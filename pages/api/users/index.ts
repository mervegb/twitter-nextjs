import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })
    return res.status(200).json(users);
  }
  catch(error: unknown) {
    return res.status(500).json({ message: error });
  }
}