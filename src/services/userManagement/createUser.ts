import {hash} from "bcrypt";

const saltRounds = 10;

export async function hashPassword(password: string) {
  try {
    // Generar un hash de la contraseña
    const hashedPassword = await hash(password, saltRounds);
    console.log(hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password', error);
  }
}

async function createUser(username: string, password: string) {
  const hashedPassword = await hashPassword(password);
  
  // Aquí es donde guardarías el username y el hashedPassword en MongoDB
  // db.users.insertOne({ username: username, password: hashedPassword });

  console.log('User created with hashed password:', hashedPassword);
}
