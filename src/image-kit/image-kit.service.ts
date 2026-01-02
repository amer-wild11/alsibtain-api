import { BadRequestException, Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
import { UploadResponse } from 'imagekit/dist/libs/interfaces';

interface FileUploadOptions {
  folder?: string;
  transformation?: {
    format?: 'webp' | 'jpg' | 'png';
    quality?: string;
    width?: number;
    height?: number;
    aspectRatio?: string;
    grayscale?: boolean;
    [key: string]: any;
  };
}

@Injectable()
export class ImageKitService {
  private imagekit: ImageKit;

  constructor() {
    this.imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    });
  }
  async upload(
    file: Express.Multer.File,
    options: FileUploadOptions = {},
  ): Promise<UploadResponse> {
    if (
      !file.mimetype.startsWith('image/') &&
      !file.mimetype.startsWith('video/') &&
      file.mimetype !== 'application/pdf'
    ) {
      throw new BadRequestException(
        'Unsupported file type. Only images, videos, and PDFs are allowed.',
      );
    }

    const { folder = '/uploads', transformation } = options;
    const isImage = file.mimetype.startsWith('image/');

    // Build transformation string
    let transformationStr = '';
    if (isImage && transformation) {
      const transformations: string[] = [];

      if (transformation.format) {
        transformations.push(`f-${transformation.format}`);
      }
      if (transformation.quality) {
        transformations.push(`q-${transformation.quality}`);
      }
      if (transformation.width) {
        transformations.push(`w-${transformation.width}`);
      }
      if (transformation.height) {
        transformations.push(`h-${transformation.height}`);
      }
      if (transformation.aspectRatio) {
        transformations.push(`ar-${transformation.aspectRatio}`);
      }
      if (transformation.grayscale) {
        transformations.push('e-grayscale');
      }

      transformationStr = transformations.join(',');
    }

    return this.imagekit.upload({
      file: file.buffer,
      fileName:
        isImage && transformation?.format
          ? file.originalname.replace(/\.\w+$/, `.${transformation.format}`)
          : file.originalname,
      folder,
      useUniqueFileName: true,
      ...(transformationStr && {
        transformation: {
          pre: transformationStr,
        },
      }),
    });
  }

  async deleteFile(fileId: string): Promise<any> {
    if (!fileId) {
      throw new BadRequestException('fileId is required to delete a file');
    }

    try {
      const result = await this.imagekit.deleteFile(fileId);
      return result;
    } catch (error: any) {
      console.error('ImageKit deleteFile error:', error);

      throw new BadRequestException(
        `Failed to delete file with ID "${fileId}". ${
          error?.message || 'Unknown error'
        }`,
      );
    }
  }

  isImage(file: Express.Multer.File): Boolean {
    return file.mimetype.startsWith('image/');
  }
  isPdf(file: Express.Multer.File): Boolean {
    return file.mimetype === 'application/pdf';
  }
  isVideo(file: Express.Multer.File): Boolean {
    return file.mimetype.startsWith('video/');
  }
  getAuthParams() {
    return this.imagekit.getAuthenticationParameters();
  }
}
