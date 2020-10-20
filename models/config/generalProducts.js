exports.customGeneralProducts = {
	//portrait sizes width x height
	"Digital drawing": {
		sizesPrices: {
			"15 x 21": 75,
			"20 x 30": 100,
			"30 x 40": 150,
			"40 x 50": 250,
			"50 x 60": 300,
		},
	},
	"Coal drawing": {
		sizesPrices: { "20 x 30": 200, "30 x 40": 280 },
	},
	"Pencil drawing": {
		sizesPrices: { "20 x 30": 200, "30 x 40": 280 },
	},
	"Pen drawing": {
		sizesPrices: { "20 x 30": 200, "30 x 40": 280 },
	},
	Gouache: {
		sizesPrices: { "20 x 30": 200, "30 x 40": 280 },
	},
	Watercolor: {
		sizesPrices: { "20 x 30": 200, "30 x 40": 280 },
	},
	"Wood carving": {
		sizesPrices: { "One size": 200 }, //Undefined till the meeting
	},
};

exports.nonCustomGeneralProducts = {
	"Decoration tableau": {
		sizesPrices: {
			"15 x 21": 75,
			"20 x 30": 100,
			"30 x 40": 150,
			"40 x 50": 250,
			"50 x 60": 300,
		},
	},
	Mersal: {
		sizesPrices: { "One size": 40 },
	},
};

module.exports.dbSeeds = [
	{
		productName: "Decoration tableau",
		isCustomProduct: false,
		sizesPrices: {
			"15 x 21": 75,
			"20 x 30": 100,
			"30 x 40": 150,
			"40 x 50": 250,
			"50 x 60": 300,
		},
		dateOfRelease: new Date(),
	},
	{
		productName: "Mersal",
		isCustomProduct: false,
		sizesPrices: {
			"One size": 40,
		},
		dateOfRelease: new Date(),
	},
	{
		productName: "Digital drawing",
		isCustomProduct: true,
		sizesPrices: {
			"15 x 21": 75,
			"20 x 30": 100,
			"30 x 40": 150,
			"40 x 50": 250,
			"50 x 60": 300,
		},
		dateOfRelease: new Date(),
	},
	{
		productName: "Coal drawing",
		isCustomProduct: true,
		sizesPrices: {
			"20 x 30": 200,
			"30 x 40": 280,
		},
		dateOfRelease: new Date(),
	},
	{
		productName: "Pencil drawing",
		isCustomProduct: true,
		sizesPrices: {
			"20 x 30": 200,
			"30 x 40": 280,
		},
		dateOfRelease: new Date(),
	},
	{
		productName: "Pen drawing",
		isCustomProduct: true,
		sizesPrices: {
			"20 x 30": 200,
			"30 x 40": 280,
		},
		dateOfRelease: new Date(),
	},
	{
		productName: "Gouache",
		isCustomProduct: true,
		sizesPrices: {
			"20 x 30": 200,
			"30 x 40": 280,
		},
		dateOfRelease: new Date(),
	},
	{
		productName: "Watercolor",
		isCustomProduct: true,
		sizesPrices: {
			"20 x 30": 200,
			"30 x 40": 280,
		},
		dateOfRelease: new Date(),
	},
	{
		productName: "Wood carving",
		isCustomProduct: true,
		sizesPrices: {
			"One size": 200,
		},
		dateOfRelease: new Date(),
	},
];
