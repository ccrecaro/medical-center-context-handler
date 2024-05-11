import { RequestCtx } from "../../../json-access-control/dist";
import User from "../models/user";


export async function sendRequestCtxToPDP(requestCtxJSON: any, role: string) {
    const url: string = role == "doctor" ? "http://localhost:3001/api/permission/doctor" : "http://localhost:3001/api/permission/patient";
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({requestCtxJSON})
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error llamando a PDP:', error);
    }
}
