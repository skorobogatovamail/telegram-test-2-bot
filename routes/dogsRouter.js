/* eslint-disable camelcase */
const { Router } = require('express');
const fs = require('fs');
const { Dog } = require('../db/models');
const uploadPhoto = require('../middleware/uploadPhoto');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.route('/').get(authMiddleware, async (req, res) => {
  const { id } = res.locals.initData.user;
  const data = await Dog.findAll({ where: { userId: id } });
  return res.json(data);
});

router
  .route('/uploadImage')
  .post(uploadPhoto.single('photos'), async (req, res) => {
    try {
      const { path: oldPath, originalname } = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      const newPath = `${oldPath}.${ext}`;
      fs.renameSync(oldPath, newPath);
      newPath.replace('uploads/', '');

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;
