class APIFeatures {
  constructor(query, rawQueryObj) {
    this.query = query;
    this.rawQueryObj = rawQueryObj;
  }

  filter() {
    // 1a - FILTERING
    const queryObj = { ...this.rawQueryObj };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1b - ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 2 - SORTING
    if (this.rawQueryObj.sort) {
      const sortBy = this.rawQueryObj.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // 3 - FIELDS LIMITING
    if (this.rawQueryObj.fields) {
      const fields = this.rawQueryObj.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // 4 - PAGINATION
    const page = this.rawQueryObj.page * 1 || 1;
    const limit = this.rawQueryObj.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // if (this.rawQueryObj.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exists.');
    // }

    return this;
  }
}

module.exports = APIFeatures;
