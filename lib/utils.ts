import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Client } from "@langchain/langgraph-sdk";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const converToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const lgClient = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

  return new Client({
    apiUrl,
  });
};
