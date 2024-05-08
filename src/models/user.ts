import { ObjectId } from "mongodb";

export default class User {
    constructor(public username: string, public email: string, public password: string, public role: string, public id?: ObjectId) {}
}