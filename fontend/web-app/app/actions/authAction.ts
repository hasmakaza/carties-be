import { getServerSession } from "next-auth";
import { cookies, headers } from "next/headers";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { authOptions } from "../lib/authOptions";


export async function getSessions(){
    return await getServerSession(authOptions)
}

export async function getCurrentUser(){
    try{
        const session = await getSessions();
        if(!session) return null;
        return session.user
    }catch(error){
        return null;
    }
}

export async function getTokenWorkAround(){
    const req = {
        headers: Object.fromEntries(headers() as Headers),
        cookies: Object.fromEntries(
            cookies()
                .getAll()
                .map(c => [c.name, c.value])
        )
    } as NextApiRequest;
    return await getToken({req});
}