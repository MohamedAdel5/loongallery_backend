// const sharp = require('sharp');
const AwsS3Api = require('./awsS3Api');
const AppError = require('./appError');

module.exports = async (
  imageData,
  folderName,
  id
) => {
  if (!imageData || !folderName || !id)
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

		const key = `images/${folderName}/${id}.jpeg`;
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

    // eslint-disable-next-line no-await-in-loop
    await awsObj.s3Upload(imageData, key);

    // imgObjects.push({
    //   width: dimension[0],
    //   height: dimension[1],
    //   url: `${url}${key}`
    // });
  // }

	// return imgObjects;
	return `${url}${key}`;
};
