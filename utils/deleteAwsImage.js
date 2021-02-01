// const sharp = require('sharp');
const AwsS3Api = require('./AwsS3Api');
const AppError = require('./appError');


const deleteAWSImage = async (
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





(async ()=>{
	if(process.argv.length > 2){
		try{
			const dotenv = require("dotenv");
			// You must call this file from the "backend" directory e.g: node utils/deleteAwsImage.js https://loongallery.s3.us-east-2.amazonaws.com/images/products/600c6aafaf7b5343487d94f6.jpeg
			dotenv.config({
				path: "./config.env",
			});
			await deleteAWSImage(process.argv[2]);

		}catch(err)
		{
			console.error(`Error found: ${err}`);
		}
	}
})();


module.exports = deleteAWSImage;
