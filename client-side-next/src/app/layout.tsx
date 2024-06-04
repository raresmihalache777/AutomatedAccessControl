import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {UserWrapper} from '@/app/context/userContext'
import { AppWrapper } from "./context/appContext";
import { connectToMongoDB } from "@/dbConfig/dbConfig";
import https from "https";
import { connectToServer } from "./utils/serverConnect";
import axios from "axios";


const inter = Inter({ subsets: ["latin"] });

https.globalAgent.options.rejectUnauthorized = false; 

connectToMongoDB();

const getServerToken = async () => {
  var serverToken = await connectToServer();
  axios.defaults.headers.common = {'Authorization': `Bearer ${serverToken}`}
}

getServerToken()

export const metadata: Metadata = {
  title: "Court Booking App",
  description: "The game starts here!",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <AppWrapper>
          <UserWrapper>
            {children}
          </UserWrapper>
        </AppWrapper>
      </body>
    </html>
  );
}
