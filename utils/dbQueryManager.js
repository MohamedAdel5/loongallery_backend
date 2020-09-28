const getQueryStringFilterFields = require("./../utils/getQueryStringFilterFields");

class DbQueryManager {
	constructor(dbQuery) {
		this.dbQuery = dbQuery;
	}

	filter(fields) {
		//Advanced filtering
		let fieldsStr = JSON.stringify(fields);
		fieldsStr = fieldsStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
		this.dbQuery = this.dbQuery.find(JSON.parse(fieldsStr));

		return this.dbQuery;
	}
	selectFields(fields) {
		const filteredFields = fields.split(",").join(" ");
		this.dbQuery = this.dbQuery.select(filteredFields);
		return this.dbQuery;
	}
	sort(sortBy) {
		const sortByFields = sortBy.split(",").join(" ");
		this.dbQuery = this.dbQuery.sort(sortByFields);
		return this.dbQuery;
	}
	paginate(page, limit) {
		page = page * 1;
		limit = limit * 1;
		const skip = (page - 1) * limit;
		this.dbQuery.skip(skip).limit(limit);
		return this.dbQuery;
	}
	all(queryStringObject) {
		const { fields, sort, page, limit } = queryStringObject;
		const filterFields = getQueryStringFilterFields(queryStringObject);
		if (filterFields) this.filter(filterFields);
		if (fields) this.dbQuery = this.selectFields(fields);
		if (sort) this.dbQuery = this.sort(sort);
		if (page && limit) this.dbQuery = this.paginate(page, limit);
		return this.dbQuery;
	}
}
module.exports = DbQueryManager;
