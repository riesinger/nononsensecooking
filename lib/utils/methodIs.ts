import { NextApiRequest, NextApiResponse } from "next";

export function methodIs(
  method: string,
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== method) {
    res
      .status(405)
      .json({ error: `Only ${method} requests are allowed to this endpoint` });
    return false;
  }
  return true;
}
