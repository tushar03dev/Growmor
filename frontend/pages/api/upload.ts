import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import formidable from "formidable"
import { uploadImage } from "../../lib/cloudinary"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.isAdmin) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    const [fields, files] = await form.parse(req)

    if (!files.image) {
      return res.status(400).json({ message: "No image provided" })
    }

    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image
    const imageUrl = await uploadImage(imageFile.filepath)

    res.status(200).json({ url: imageUrl })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ message: "Failed to upload image" })
  }
}
