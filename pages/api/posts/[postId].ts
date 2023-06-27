import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'GET') {
    return res.status(405).json({message: 'Method not allowed'})
  }

  try {
    const { postId } = req.query

    if(!postId && typeof postId !== 'string') {
      return res.status(400).json({message: 'Missing postId'})
    }
 
    const post = await prisma.post.findUnique({
        where: {
            id: postId as string,
        },
        include: {
            user: true,
            comments: {
                include: {
                    user: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    })

    return res.status(200).json(post)
    
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: 'Internal server error'})
  }
}