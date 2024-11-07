import s3 from "./s3.js";

/**
 * @method getSignedUrl
 * @description Getting the signed URL to download
 * @param {string} key
 * @param {string} bucket
 * @returns {Promise<string>}
 */
const getSignedUrl = async (key, bucket, downloadParams) => {
  if (!key || !bucket) {
    return null;
  }
  console.log("key:", key, "bucket:", bucket);
  const signedUrlExpireSeconds = 60 * 5;
  
  let params = {
    Bucket: bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  };
  // If downloadParams are provided, modify the params accordingly
  if (downloadParams) {
    params = {
      Bucket: bucket,
      Key: key,
      Expires: signedUrlExpireSeconds,
      ResponseContentDisposition: "attachment",
    };
  }

  try {
    const signedUrl = await s3.getSignedUrlPromise("getObject", params);
    return signedUrl;
  } catch (error) {
    return null;
  }
};


/**
 * @method uploadBufferToS3
 * @description Uploading buffer to S3 bucket
 * @param {Buffer} buffer
 * @param {string} filename
 * @param {string} bucket
 * @param {string} contentType
 * @returns {Promise<Object>}
 */
const uploadBufferToS3 = async (buffer, filename, bucket, contentType) => {
  return new Promise((resolve, reject) => {
    console.log("uploading to S3 .... ");
    const params = contentType
      ? {
          Bucket: bucket,
          Key: filename,
          Body: buffer,
          ContentType: contentType,
        }
      : {
          Bucket: bucket,
          Key: filename,
          Body: buffer,
        };

    s3.upload(params, function (s3Err, data) {
      console.log("uploaded to S3  .... ");
      if (s3Err) reject(s3Err);
      resolve(data);
      console.log(`File uploaded successfully at ${data.Location}`);
    });
  });
};

/**
 * @method deleteImageFromS3
 * @description Deleting an image from S3 bucket
 * @param {string} key
 * @param {string} bucket
 * @returns {Promise<Object>}
 */
const deleteImageFromS3 = async (key, bucket) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  try {
    const data = await s3.deleteObject(params).promise();
    console.log(`Successfully deleted object ${key} from bucket ${bucket}`);
    return data;
  } catch (err) {
    console.error(`Failed to delete object ${key} from bucket ${bucket}:`, err);
    throw err;
  }
};

export { getSignedUrl, uploadBufferToS3, deleteImageFromS3 };
