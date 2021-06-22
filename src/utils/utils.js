module.exports.pagination = (response, url, page, limit, totalPages) => {
  const linkHeader = {
    first: `${url}?limit=${limit}&page=1`,
    prev: response.hasPrevPage ? `${url}?limit=${limit}&page=${page - 1}` : `${url}?limit=${limit}&page=${page}`,
    next: response.hasNextPage ? `${url}?limit=${limit}&page=${page + 1}` : `${url}?limit=${limit}&page=${page}`,
    last: `${url}?limit=${limit}&page=${totalPages}`,
  };

  return linkHeader;
};

module.exports.validateUser = (params) => {
  const checkForValidMongoDbID = new RegExp('^[0-9a-fA-F]{24}$');
  const validObjectId = checkForValidMongoDbID.test(params);

  if (validObjectId) {
    return { _id: params };
  }
  return { email: params };
};
