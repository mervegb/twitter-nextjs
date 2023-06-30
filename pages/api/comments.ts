import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb"

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }
    try {
        const {currentUser} = await serverAuth(req, res)
        const {body} = req.body
        const {postId} = req.query

        if(!postId || typeof postId !== 'string') {
            throw new Error('Invalid post id')
        }

        const comment = await prisma.comment.create({
            data: {
                body,
                userId: currentUser.id,
                postId,
            },
        })

        // Notifications
        try {
            const post = await prisma.post.findUnique({
              where: {
                id: postId
              }
            })
            if(post?.userId) {
              await prisma.notification.create({
                data: {
                 body: `${currentUser.username} replied to your tweet`,
                 userId: post.userId,
                }
              })
              await prisma.user.update({
                where: {
                  id: post.userId
                },
                data: {
                  hasNotification: true
                }
              })
            }
          }
          catch (error) {
            console.log(error);
          }

        return res.status(200).json(comment)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }

}