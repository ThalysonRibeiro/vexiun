import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string
});

export const POST = async (req: Request) => {
  const formData = await req.formData();

  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  if (!userId || userId === "") {
    return NextResponse.json({ error: "Falha ao alterar imagem." }, { status: 401 });
  }

  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    return NextResponse.json({ error: "Formato de imagem inválido." }, { status: 401 });
  }

  const results = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          tags: [`${userId}`],
          public_id: file.name
        },
        function (error, result) {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      )
      .end(buffer);
  });

  return NextResponse.json(results);
};
