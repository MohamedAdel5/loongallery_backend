// const sharp = require('sharp');
const AwsS3Api = require('./AwsS3Api');
const AppError = require('./appError');

module.exports = async (
	imageData,
	imageMime,
  folderName,
	id
) => {
  if (!imageData || !imageMime || !folderName || !id)
    throw new AppError('Missing parameters in function', 500);
  // const buf = Buffer.from(imageData, 'base64');

  const awsObj = new AwsS3Api();

  // const imgObjects = [];

  // for (let i = 0; i < dimensions.length; i += 1) {
  //   const dimension = dimensions[i];
	// 	const name = qualityNames[i];
		
    // const img = await sharp(buf)
    //   .resize(dimension[0], dimension[1])
    //   .toBuffer();

		const key = `images/${folderName}/${id}.${imageMime.split('/')[1]}`;
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

    // eslint-disable-next-line no-await-in-loop
    await awsObj.s3Upload(imageData, imageMime, key);

    // imgObjects.push({
    //   width: dimension[0],
    //   height: dimension[1],
    //   url: `${url}${key}`
    // });
  // }

	// return imgObjects;
	return `${url}${key}`;
};
