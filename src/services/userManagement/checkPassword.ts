import {compare} from "bcrypt";

export async function checkPassword(userPassword: string, storedHash: string) {
    try {
      // Comparar la contraseña proporcionada con el hash guardado
      const match = await compare(userPassword, storedHash);
      return match;
    } catch (error) {
      console.error('Error checking password', error);
    }
}
