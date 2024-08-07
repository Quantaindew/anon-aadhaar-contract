import type { Request, Response } from "express";

interface OnlineUser {
    connectionId:string,
    category:string,
    inCall:boolean,
}

let onlineUsers:OnlineUser[] = [];

export async function connectController(req: Request, res: Response) {
  //console.log(req.body)
  try {
    const { connectionId, category } = req.body;
    if (!connectionId || !category) {
      return res.status(400).json({ error: 'Connection Id and category are required' });
    }

    for(let i=0; i<onlineUsers.length; i++){
        if(onlineUsers[i].connectionId === connectionId){
            return res.status(403).json({ error: 'Connection Id already exists' });
        }
    }

    onlineUsers.push(
        {
            connectionId,
            category,
            inCall:false
        }
    )
    let userV = onlineUsers.length;
    let calleeId = "";
    for(let i=0; i<onlineUsers.length; i++){
        if(category === onlineUsers[i].category && connectionId !== onlineUsers[i].connectionId && onlineUsers[i].inCall != true){
            onlineUsers[i].inCall=true;
            onlineUsers[userV-1].inCall = true;
            calleeId = onlineUsers[i].connectionId;
            break;
        }
    }
    
    res.json({ calleeId });
    console.log("Online Users: ", onlineUsers)
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while connecting' });
  }
}