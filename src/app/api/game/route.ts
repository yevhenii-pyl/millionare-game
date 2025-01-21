import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

async function POST() {
  const filePath = path.join(process.cwd(), "data", "initialConfig.json");
  const questions = JSON.parse(await fs.readFile(filePath, "utf-8"));

  return NextResponse.json({ questions });
}

export { POST };
