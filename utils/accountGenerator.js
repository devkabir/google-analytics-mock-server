const { encodeIntToUUID, decodeUUIDToInt } = require("./uuidEncoder");

const handle = (query, type) => {
  const { pageSize = 50, pageToken = "" } = query;

  const pageSizeInt = parseInt(pageSize, 10);
  let pageTokenInt = 0;
  if (pageToken !== "") {
    pageTokenInt = parseInt(decodeUUIDToInt(pageToken), 10);
  }

  // Validate pageSize
  if (isNaN(pageSizeInt) || pageSizeInt < 1 || pageSizeInt > 200) {
    return {
      error: {
        code: 400,
        message: "Invalid value for pageSize. Must be between 1 and 200.",
        status: "INVALID_ARGUMENT",
      },
    };
  }

  // Validate pageToken
  if (isNaN(pageTokenInt) || pageTokenInt < 0) {
    return {
      error: {
        code: 400,
        message:
          "Invalid value for pageToken. Must be a non-negative integer. parsed value: " +
          pageTokenInt,
        status: "INVALID_ARGUMENT",
        data: {
          parsedValue: pageTokenInt,
          token: pageToken,
        },
      },
    };
  }

  // Retrieve the total number of accounts and properties per account from environment variables
  const totalAccounts = parseInt(process.env.TOTAL_ACCOUNTS, 10);
  const propertiesPerAccount = parseInt(process.env.PROPERTIES_PER_ACCOUNT, 10);

  if (isNaN(totalAccounts) || totalAccounts < 1) {
    return {
      error: {
        code: 500,
        message:
          "Invalid TOTAL_ACCOUNTS environment variable. Must be a positive integer.",
        status: "INTERNAL_ERROR",
      },
    };
  }

  if (isNaN(propertiesPerAccount) || propertiesPerAccount < 1) {
    return {
      error: {
        code: 500,
        message:
          "Invalid PROPERTIES_PER_ACCOUNT environment variable. Must be a positive integer.",
        status: "INTERNAL_ERROR",
      },
    };
  }
  const startIndex = pageTokenInt * pageSizeInt;
  // Calculate nextPageToken
  let response;

  if (type === "accounts") {
    const endIndex = Math.min(startIndex + pageSizeInt, totalAccounts);
    const nextPageToken = endIndex < totalAccounts ? pageTokenInt + 1 : null;

    if (startIndex >= totalAccounts) {
      return {
        accounts: [],
        nextPageToken: null,
      };
    }

    // Generate mock accounts
    response = Array.from({ length: endIndex - startIndex }, (_, i) => {
      const accountId = startIndex + i + 1;
      return {
        name: `accounts/${accountId}`,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        displayName: `Account ${accountId}`,
        regionCode: "US",
        deleted: false,
        gmpOrganization: accountId.toString(),
      };
    });
    const result = {
      accounts: response,
    };
    if (nextPageToken !== null) {
      result.nextPageToken = encodeIntToUUID(nextPageToken);
    }
    return result;
  }

  if (type === "properties") {
    const endIndex = Math.min(startIndex + pageSizeInt, propertiesPerAccount);
    const nextPageToken =
      endIndex < propertiesPerAccount ? pageTokenInt + 1 : null;

    if (startIndex >= propertiesPerAccount) {
      return {
        properties: [],
        nextPageToken: null,
      };
    }
    const accountId = parseInt(query.filter.split("/")[1]) || 1;

    // Generate mock properties
    response = Array.from({ length: endIndex - startIndex }, (_, i) => {
      const propertyId = startIndex + i + 1;
      return {
        name: `properties/${accountId}${propertyId}`,
        displayName: `#${propertyId} Property of Account ${accountId}`,
        propertyType: "PROPERTY_TYPE_ORDINARY",
        parent: `accounts/${accountId}`,
      };
    }
    );
    return {
      properties: response,
      nextPageToken:
        nextPageToken !== null ? encodeIntToUUID(nextPageToken) : null,
    };
  }

  if (startIndex >= totalAccounts) {
    return {
      accountSummaries: [],
      nextPageToken: null,
    };
  }

  const endIndex = Math.min(startIndex + pageSizeInt, totalAccounts);
  const nextPageToken = endIndex < totalAccounts ? pageTokenInt + 1 : null;
  // Generate mock account summaries
  response = Array.from({ length: endIndex - startIndex }, (_, i) => {
    const accountId = startIndex + i + 1;
    return {
      name: `accountSummaries/${accountId}`,
      account: `accounts/${accountId}`,
      displayName: `Account ${accountId}`,
      propertySummaries: Array.from(
        { length: propertiesPerAccount },
        (_, j) => {
          const propertyId = accountId * 1000 + (j + 1); // Unique property ID for each property
          return {
            property: `properties/${propertyId}`,
            displayName: `Property ${accountId}-${propertyId}`,
            propertyType: "PROPERTY_TYPE_ORDINARY",
            parent: `accounts/${accountId}`,
          };
        }
      ),
    };
  });

  // Response
  return {
    response,
    nextPageToken:
      nextPageToken !== null ? encodeIntToUUID(nextPageToken) : null,
  };
};

module.exports = handle;
