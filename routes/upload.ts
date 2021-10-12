import cloudinary from 'cloudinary';
import { Response, Router, Request } from 'express';
import fs from 'fs';
import { IReqFile } from '../config/interface';
import auth from '../middleware/auth';

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const router = Router();
router.post('/upload', auth, async (req: IReqFile, res: Response) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: 'No files were upload' });
    }
    const file = req.files.file;
    if (Array.isArray(file)) {
      const listimg: Array<object> = [];
      for (let i of file) {
        await cloudinary.v2.uploader.upload(
          i.tempFilePath,
          { folder: 'nextjsapp' },
          async (err, result: any) => {
            if (err) throw err;
            removeTmp(i.tempFilePath);
            listimg.push({ public_id: result.public_id, url: result.secure_url });
          }
        );
      }
      return res.json(listimg);
    } else {
      await cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { folder: 'nextjsapp' },
        async (err, result: any) => {
          if (err) throw err;
          removeTmp(file.tempFilePath);

          return res.json({ public_id: result.public_id, url: result.secure_url });
        }
      );
    }
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
});

router.post('/delImg', auth, (req: Request, res: Response) => {
  try {
    const { public_id } = req.body;
    console.log(req.body);
    if (!public_id) return res.status(400).json({ msg: 'No images Selected' });
    if (Array.isArray(public_id)) {
      public_id.map((state) => {
        cloudinary.v2.uploader.destroy(state);
      });
      res.json({ msg: 'Deleted Image List' });
    } else {
      cloudinary.v2.uploader.destroy(public_id, async (err: any, result: any) => {
        if (err) throw err;
        res.json({ msg: 'Deleted Image' });
      });
    }
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
});

const removeTmp = (path: fs.PathLike) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
export default router;
