// const sharp = require('sharp');
const AwsS3Api = require('./AwsS3Api');
const AppError = require('./appError');

module.exports = async (
  imageUrl
) => {
  if (!imageUrl)
    throw new AppError('Missing parameters in function', 500);
  // const buf = Buffer.from(imageData, 'base64');

  const awsObj = new AwsS3Api();
		const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
		const key = imageUrl.substring(url.length);

		await awsObj.s3Delete(key);
};
