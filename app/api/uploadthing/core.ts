import { createUploadthing, type FileRouter } from "uploadthing/next";

import { getServerAuthSession } from "@/lib/auth";

const f = createUploadthing();

const handleAuth = async () => {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return { userId: session.user.id };
};

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
