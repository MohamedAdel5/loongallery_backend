const GeneralProduct = require("../models/GeneralProductModel");
const GlobalVariables = require("../models/GlobalVariablesModel");
const generalProducts = require("../models/config/generalProducts");
const connectDB = require("./connectDB");
const disconnectDB = require("./disconnectDB");

const dotenv = require("dotenv");
dotenv.config({
	path: "./config.env",
});

const initializeDB = async () => {
	await connectDB();

	// await GlobalVariables.create({
	// 	globalObject: {
	// 		sizesPreview: [
  //       {
  //         size: "15 x 21",
  //         images: ["https://via.placeholder.com/500"]
  //       },
  //       {
  //         size: "20 x 30",
  //         images: ["https://via.placeholder.com/500"]
  //       },
  //       {
  //         size: "30 x 40",
  //         images: ["https://via.placeholder.com/500"]
  //       },
  //       {
  //         size: "40 x 50",
  //         images: ["https://via.placeholder.com/500"]
  //       },
  //       {
  //         size: "50 x 60",
  //         images: ["https://via.placeholder.com/500"]
  //       }
  //     ]
	// 	}
	// });

	// await GlobalVariables.create({
	// 	globalObject: {
	// 		drawingStylesExamples: [
  //       {
  //         style: "Digital drawing",
  //         images: [
  //           "https://via.placeholder.com/500",
  //           "https://via.placeholder.com/500",
  //           "https://via.placeholder.com/500",
  //           "https://via.placeholder.com/500",
  //           "https://via.placeholder.com/500",
  //           "https://via.placeholder.com/500"
  //         ]
  //       },
  //       {
  //         style: "Coal drawing",
  //         images: [
  //           "https://via.placeholder.com/500",
  //           "https://via.placeholder.com/500",
  //           "https://via.placeholder.com/500"
  //         ]
  //       },
  //       {
  //         style: "Pencil drawing",
  //         images: [
  //           "https://via.placeholder.com/500",
  //           "https://via.placeholder.com/500",
  //           "https://via.placeholder.com/500"
  //         ]
  //       },
  //       {
  //         style: "Pen drawing",
  //         images: [
  //           "https://via.placeholder.com/500",
  //           "https://via.placeholder.com/500",
  //           "https://via.placeholder.com/500"
  //         ]
	// 			},
  //       {
  //         style: "Gouache",
  //         images: [
  //           "https://via.placeholder.com/500",
  //           "https://via.placeholder.com/500",
  //           "https://via.placeholder.com/500"
  //         ]
  //       },
  //       {
  //         style: "Watercolor",
  //         images: [
  //           "https://via.placeholder.com/500",
  //           "https://via.placeholder.com/500",
  //           "https://via.placeholder.com/500"
  //         ]
  //       }
  //     ]
	// 	}
	// });

	await GlobalVariables.create({
		globalObject: {
			facePrice: 50,
		},
	});
	await GlobalVariables.create({
		globalObject: {
			metroStations: [
				"Helwan",
				"Ain Helwan",
				"Helwan University",
				"Wadi Hof",
				"Hadayek Helwan",
				"El-Maasara",
				"Tora El-Asmant",
				"Kozzika",
				"Tora El-Balad",
				"Sakanat El-Maadi",
				"Maadi",
				"Hadayek El-Maadi",
				"Dar El-Salam",
				"El-Zahraa'",
				"Mar Girgis",
				"El-Malek El-Saleh",
				"Al-Sayeda Zeinab",
				"Saad Zaghloul",
				"Sadat",
				"Nasser",
				"Orabi",
				"Al-Shohadaa",
				"Ghamra",
				"El-Demerdash",
				"Manshiet El-Sadr",
				"Kobri El-Qobba",
				"Hammamat El-Qobba",
				"Saray El-Qobba",
				"Hadayeq El-Zaitoun",
				"Helmeyet El-Zaitoun",
				"El-Matareyya",
				"Ain Shams",
				"Ezbet El-Nakhl",
				"El-Marg",
				"New El-Marg",

				"El-Mounib",
				"Sakiat Mekky",
				"Omm El-Masryeen",
				"Giza",
				"Faisal",
				"Cairo University",
				"El Bohoth",
				"Dokki",
				"Opera",
				"Sadat",
				"Mohamed Naguib",
				"Attaba",
				"Al Shohadaa",
				"Masarra",
				"Rod El-Farag",
				"St. Teresa",
				"Khalafawy",
				"Mezallat",
				"Kolleyyet El-Zeraa",
				"Shubra El-Kheima",

				"Airport",
				"Ahmed Galal",
				"Adly Mansour",
				"El Haykestep",
				"Omar Ibn El-Khattab",
				"Qobaa",
				"Hesham Barakat",
				"El-Nozha",
				"Nadi El-Shams",
				"Alf Maskan",
				"Heliopolis Square",
				"Haroun",
				"Al-Ahram",
				"Koleyet El-Banat",
				"Stadium",
				"Fair Zone",
				"Abbassiya",
				"Abdou Pasha",
				"El-Geish",
				"Bab El-Shaaria",
				"Attaba",
				"Nasser",
				"Maspero",
				"Zamalek",
				"Kit Kat",
				"Sudan St.",
				"Imbaba",
				"El-Bohy",
				"El-Kawmeya Al-Arabiya",
				"Ring Road",
				"Rod El-Farag Axis",
				"El-Tawfikeya",
				"Wadi El-Nil",
				"Gamaat El Dowal Al-Arabiya",
				"Bulaq El-Dakroor",
				"Cairo University",
			],
		},
	});
	await GlobalVariables.create({
		globalObject: {
			ourLocations: ["Rod ElFarag"],
		},
	});

	await GlobalVariables.create({
		globalObject: {
			shippingFees: {
				home: 35,
				metro: 20,
				ourLocation: 0,
			},
		},
	});

	await GeneralProduct.insertMany(generalProducts.dbSeeds);
	console.log("✅ Finished successfully");
	disconnectDB();
};

initializeDB();
