"use server";
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { cookies } from "next/headers";
import { handleError } from "@/lib/actions/user.action";

export const createSessionClient = async () => {
  try {
    const session = (await cookies()).get("appwrite-sessions");
    if (session) {
      const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId);

      // if (!session || !session.value) handleError(error, "Could not find session");

      client.setSession(session.value);

      return {
        get account() {
          return new Account(client);
        },
        get database() {
          return new Databases(client);
        },
      };
    }
  } catch (error) {
    handleError(error, "No session");
  }
};

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
