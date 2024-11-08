const { PrismaClient } = require ("@prisma/client")
const prisma = new PrismaClient()
const imagekit = require("../libs/imageKitConfig");

exports.addImage = async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ 
        message: "Bad request", 
        error: "Image file is required or file size is too large"
      })
    }
    if (!file) {
      return res.status(400).json({
        message: "bad request", 
        error: "Image file is required"
      })
    }
    const result = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });

    const image = await prisma.allimage.create({
      data: {
        title,
        description,
        imageURL: result.url,
        imageFieldId: result.fileId,
        isActive: true,
      },
    });

    res.status(201).json({ message: "Image uploaded successfully", image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const images = await prisma.allimage.findMany({ where: { isActive: true } });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getImageById = async (req, res) => {
  const { id } = req.params;
  // console.log("ID received:", id);
  try {
    const image = await prisma.allimage.findUnique({ where: { id: parseInt(id) } });
    res.json(image || { message: "Image not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update title and description
exports.updateImage = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  // console.log("ID:", id);
  // console.log("Title:", title);
  // console.log("Description:", description);
  try {
    const updatedImage = await prisma.allimage.update({
      where: { id: parseInt(id) },
      data: { title, description },
    });
    res.json(updatedImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete image
exports.deleteImage = async (req, res) => {
  const { id } = req.params;

  try {
    const imageData = await prisma.allimage.findUnique({
      where: { id: parseInt(id) },
    });

    if (!imageData) {
      return res.status(404).json({ error: "Image not found" });
    }

    const { imageFieldId } = imageData;
    await imagekit.deleteFile(imageFieldId);

    await prisma.allimage.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};