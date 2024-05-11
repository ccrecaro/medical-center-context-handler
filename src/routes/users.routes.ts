import express, { Request, Response } from 'express';
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import User from '../models/user';
import {RequestCtx, ResponseCtx} from "../../../json-access-control";
import { requestCtxGenerator, requestDoctorCtxGenerator, requestPatientCtxGenerator } from '../services/ctxGenerator/requestCtxGenerator';
import { sendRequestCtxToPDP } from '../services/pdp.service';
import {compare} from "bcrypt";
import { hashPassword } from '../services/userManagement/createUser';

export const usersRouter = express.Router();

usersRouter.use(express.json());

usersRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const users = (await collections.users?.find({}).toArray()) as unknown as User[];
    res.status(200).send(users);
  } catch (error) {
    let errorMessage = "Failed to do something exceptional";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});

usersRouter.get('/path1', (req: Request, res: Response) => {
  res.send('Hello from Path 1!');
  console.log(hashPassword("pelusa12"));
});

usersRouter.post('/api/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = (await collections.users?.findOne({username: username})) as unknown as User;
    const requestCtxJSON : RequestCtx = requestCtxGenerator(user);
    const data = (await sendRequestCtxToPDP(requestCtxJSON, user.role));

    if (user && await compare(password, user.password)) {
      data.message === "Access granted" ? res.status(200).send(JSON.stringify( {message: "Access granted", role: user.role} )) : res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    let errorMessage = "Failed to do something exceptional";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});

usersRouter.post('/doctor/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = (await collections.users?.findOne({username: username})) as unknown as User;
    const requestCtxJSON : RequestCtx = requestDoctorCtxGenerator(user);
    const data = (await sendRequestCtxToPDP(requestCtxJSON, 'doctor'));

    if (user && await compare(password, user.password)) {
      data.message === "Access granted" ? res.status(200).send(JSON.stringify( {message: "Access granted", role: user.role} )) : res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    let errorMessage = "Failed to do something exceptional";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});

usersRouter.post('/patient/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = (await collections.users?.findOne({username: username})) as unknown as User;
    const requestCtxJSON : RequestCtx = requestPatientCtxGenerator(user);
    const data = (await sendRequestCtxToPDP(requestCtxJSON, 'patient'));

    if (user && await compare(password, user.password)) {
      data.message === "Access granted" ? res.status(200).send(JSON.stringify( {message: "Access granted", role: user.role} )) : res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    let errorMessage = "Failed to do something exceptional";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});

usersRouter.get("/patients", async (req: Request, res: Response) => {
  try {
    const users = (await collections.users?.find({role: "patient" }).toArray()) as unknown as User[];
    res.status(200).send(users);
  } catch (error) {
    let errorMessage = "Failed to do something exceptional";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});

usersRouter.get("/patients/:username", async (req: Request, res: Response) => {
  try {
    const username = req.params.username; // Obtiene el ID del parámetro de la URL

    // Verifica que el ID es un ObjectId válido
    if (!username) {
      return res.status(400).send("Invalid username");
    }

    const user = await collections.users?.findOne({username: username, role: "patient"});

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send("Patient not found");
    }
  } catch (error) {
    let errorMessage = "Failed to retrieve patient data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});

// Ruta para actualizar un paciente
usersRouter.put("/patients/:username", async (req: Request, res: Response) => {
  const username = req.params.username;
  // Verifica que el ID es un ObjectId válido
  if (!username) {
      return res.status(400).send("Invalid ID format");
  }
  const updates = req.body;
  console.log("ENTROO" + JSON.stringify(updates));

    // Eliminar cualquier intento de actualizar el campo '_id'
  if (updates._id) {
      delete updates._id;
  }
  try {
      // Asegúrate de que la colección y la conexión a la base de datos estén configuradas correctamente
      const updatedResult = await collections.users?.updateOne(
          { username: username, role: "patient" },
          { $set: updates }
      );
      console.log(`updatedResult: ${updatedResult}`);

      if (updatedResult && updatedResult.matchedCount === 0) {
          return res.status(404).send("Patient not found");
      }

      res.status(200).send(`Successfully updated patient with id ${username}`);
  } catch (error) {
    console.error("Update Error:", error); // Imprimir el error completo

      let errorMessage = "Failed to update patient";
      if (error instanceof Error) {
          errorMessage = error.message;
      }
      res.status(500).send(errorMessage);
  }
});



function parseResponseCtx(data: string): ResponseCtx {
  // console.log(`data: ${data}`);
  // const msgTemp = JSON.parse(JSON.stringify(data));
  // console.log(`msgTemp: ${msgTemp}`);
  // msgTemp.resCtx = JSON.parse(JSON.stringify(msgTemp.resCtx));
  // console.log(`msgTemp: ${JSON.stringify(msgTemp)}`);
  // return <ResponseCtx>msgTemp.resCtx;

  const msgTemp = JSON.parse(data);

  msgTemp.message = JSON.parse(JSON.stringify(msgTemp.message));

  return <ResponseCtx>msgTemp;
}


// function checkAccess(req: Request, res: Response){
//   const { username, password } = req.body;
//   const defaultSerializer = new JsonSerializer();

//   //"bs@simpsons.com")
//   const reqJSON = parseRequestToJSON(username);

//   const requestFromJSON: RequestCtx = defaultSerializer.deserialize(reqJSON, RequestCtx) as RequestCtx; //cast para anular nulls            
//   console.log("===== Objeto 3======");
//   var policyFinder: PolicyFinder = new PolicyFinder(["/Users/carolinacontreras/Desktop/TFM/PAP/policies/json/testPolicy.json"]);
//   var pdp:PDP = new PDP(policyFinder);
//   pdp.policyFinder.loadPolicies();
  
//   var resCtx = pdp.evaluateContext(requestFromJSON);
//   console.log(JSON.stringify(resCtx));

//   return resCtx.result[0].decision === "Permit" ? res.json({ message: "Access granted" }) : res.status(403).json({ message: "Access denied" });
// }

export default usersRouter;
