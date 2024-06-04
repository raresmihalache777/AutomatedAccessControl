import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function connectToServer(){
    const clientUser = process.env.SERVER_USER
    const clientPass = process.env.SERVER_PASS
    try{
        var response = null
        var count = 0
        var token = ''
        while((!response) && count < 10){
            response = await axios.get(`${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}/api/auth/get-token`, {data:{clientUser, clientPass}, headers: {'Content-Type': 'application/json'}})
            if(response != null){
                token = response.data.access_token
                break
            }else{
                count+=1
                setTimeout(()=> null, 2000)
            }
        }

        return token
    }catch(error:any){
        console.log(error)
        return ''
    } 
}