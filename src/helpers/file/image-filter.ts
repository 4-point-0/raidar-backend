import { HttpException, HttpStatus } from '@nestjs/common';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: any,
) => {
  const fileExtension = file.mimetype.split('/')[1];
  const validFiles = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm', 'pdf'];
  if (validFiles.some((el) => fileExtension.includes(el)))
    return callback(null, true);

  return callback(
    new HttpException(`Not valid file type`, HttpStatus.UNPROCESSABLE_ENTITY),
    false,
  );
};
