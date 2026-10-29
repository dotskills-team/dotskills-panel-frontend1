import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores";

export async function hydrateAuth() {
   const user = await userService.me();

   useAuthStore.getState().initialize(user);

   return user;
}