const prisma = require('../utils/prismaImport.js');
const asyncHandler = require('../utils/asyncHandler');

exports.getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true }
  });
  res.json(user);
});

exports.updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const data = req.body;

  if (data.password) {
    const bcrypt = require('bcryptjs');
    data.password = await bcrypt.hash(data.password, 10);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data
  });

  res.json(user);
});
