import { NextApiRequest, NextApiResponse } from "next";
import { methodIs } from "./utils/methodIs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!methodIs("GET", req, res)) return;
  // TODO: Add more information to the health endpoint:
    // - Commit short hash
    // - "Version" / Git Branch / Tag
  res.status(200).json({ status: "healthy" });
};
