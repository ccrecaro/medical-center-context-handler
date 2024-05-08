import { RequestCtx } from "../../../json-access-control/dist";
import User from "../models/user";


export async function sendRequestCtxToPDP(requestCtxJSON: any) {
    try {
        const response = await fetch('http://localhost:3001/api/permission', {
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
