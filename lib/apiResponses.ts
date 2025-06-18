import { NextResponse } from "next/server";

export function ok<T>(data: T, init: ResponseInit = {}) {
  return NextResponse.json(data, init);
}

export function error(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function handleError(err: unknown, message = "Internal Server Error") {
  console.error(err);
  return error(message, 500);
}
