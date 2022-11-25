import { diskStorage } from 'multer';

export const multerOptions = () => {
  return {
    storage: diskStorage({
      destination: 'src/public/upload/',
      filename: (req, file, cb) => {
        const filename = `${Date.now()}_${file.originalname}`;
        cb(null, `${filename}`);
      },
    }),
  };
};
