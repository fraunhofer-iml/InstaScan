/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {Injectable, Logger} from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import type { Readable as ReadableStream } from 'node:stream';
import process from 'node:process';

@Injectable()
export class ImagesS3Service {

  private readonly logger: Logger = new Logger(ImagesS3Service.name);

  constructor(
    private readonly s3Service: MinioService
  ) {}

  /**
   * Return the image with the given uuid from the s3 server.
   * @param uuid The uuid of the image that should be returned.
   */
  public async getImage(uuid: string): Promise<string> {
    const s3FileName: string = `${uuid}.jpeg`;
    const storedImage: ReadableStream = await this.s3Service.client.getObject(process.env.S3_BUCKET, s3FileName);
    const pictureBuffer: Buffer = await new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      storedImage.on('data', (chunk) => chunks.push(chunk));
      storedImage.on('end', () => resolve(Buffer.concat(chunks)));
      storedImage.on('error', () => reject(new Error('Could not read content')));
    });
    return pictureBuffer.toString('base64');
  }

  /**
   * Upload a new image to the s3 server.
   * @param base64Image The image that should be stored on the s3 server as base64 string.
   * @param uuid The uuid of the new image that should be stored.
   */
  public async uploadImage(base64Image: string, uuid: string): Promise<string> {
    if (!await this.s3Service.client.bucketExists(process.env.S3_BUCKET)) {
      await this.s3Service.client.makeBucket(process.env.S3_BUCKET);
    }
    try {
      const s3FileName: string = `${uuid}.jpeg`;
      const fileBuffer: Buffer = Buffer.from(base64Image, 'base64');

      this.logger.log('Save new image with name ', s3FileName, ' to s3');
      return this.s3Service.client.putObject(process.env.S3_BUCKET, s3FileName, fileBuffer).then(uploadResponse => uploadResponse.etag);
    }
    catch (e) {
      this.logger.error('Could not upload image', e);
      return null;
    }
  }

  /**
   * Remove an image with the given uuid from the s3 server.
   * @param uuid The uuid of the image that should be removed.
   */
  public async removeImage(uuid: string): Promise<void> {
    this.logger.log('Remove image with uuid ', uuid, ' from s3');
    await this.s3Service.client.removeObjects(process.env.S3_BUCKET, [`${uuid}.jpeg`]);
  }
}
