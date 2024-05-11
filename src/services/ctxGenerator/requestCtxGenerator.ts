import User from "../../models/user";
import {JsonSerializer, RequestCtx} from "../../../../json-access-control/dist";
import { parseRequestToJSON } from "../requests/parseRequestToJSON";
import { parseDoctorRequestToJSON } from "../requests/parseDoctorRequestToJSON";
import { parsePatientRequestToJSON } from "../requests/parsePatientRequestToJSON";


export function requestCtxGenerator(user: User): RequestCtx {
    const reqJSON = parseRequestToJSON(user.role);
    return reqJSON;
}

export function requestDoctorCtxGenerator(user: User): RequestCtx {
    const reqJSON = parseDoctorRequestToJSON(user.role, "write");
    return reqJSON;
}

export function requestPatientCtxGenerator(user: User): RequestCtx {
    const reqJSON =  parsePatientRequestToJSON(user.role, user.username, "read");
    return reqJSON;
}