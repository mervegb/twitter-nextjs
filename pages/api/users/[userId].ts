import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
    try {
      const { userId } = req.query;
      if(!userId || typeof userId !== 'string') {
        throw new Error('User ID not provided');
      }

      const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
    });
       
     const followersCount = await prisma.user.count({
        where: {
            followingIds: {
                has: userId
            }
        }   
     });
     return res.status(200).json({ ...user, followersCount }); // {id:"1", name:"John Doe", followersCount: "2"}
    }
    catch(error: unknown) {
        return res.status(500).json({ message: error });
    }
}