// Helper to generate a dynamic profile
const generateProfile = (accountId, webPropertyId, profileId, index) => {
  const date = new Date();
  const randomDate = (daysOffset) =>
    new Date(date.setDate(date.getDate() - daysOffset))
      .toISOString()
      .split(".")[0] + "Z";

  return {
    id: profileId,
    kind: "analytics#profile",
    selfLink: `https://www.googleapis.com/analytics/v3/management/accounts/${accountId}/webproperties/${webPropertyId}/profiles/${profileId}`,
    accountId: `${profileId}`,
    webPropertyId: webPropertyId,
    internalWebPropertyId: `${
      parseInt(webPropertyId.split("-")[1], 10) + index
    }`,
    name: `Dynamic Profile ${index}`,
    currency: index % 2 === 0 ? "USD" : "EUR",
    timezone: index % 2 === 0 ? "America/Los_Angeles" : "Europe/London",
    websiteUrl: index % 2 === 0 ? "https://example.com" : "https://example.org",
    type: "WEB",
    permissions: {
      effective:
        index % 2 === 0
          ? ["READ_AND_ANALYZE"]
          : ["EDIT", "MANAGE_USERS", "READ_AND_ANALYZE"],
    },
    created: randomDate(365 * 2),
    updated: randomDate(30),
    eCommerceTracking: index % 2 === 0,
    enhancedECommerceTracking: index % 2 === 0,
    botFilteringEnabled: true,
  };
};

// Route to generate dynamic profiles
const handle = ({ accountId, webPropertyId, itemsPerPage, startIndex }) => {
  if (!accountId || !webPropertyId) {
    return {
      error: {
        code: 400,
        message: "Missing required parameters: accountId and webPropertyId.",
        status: "INVALID_ARGUMENT",
      },
    };
  }
  // Dynamic parameters
  const totalProfiles = parseInt(process.env.TOTAL_PROFILES, 10);

  // Validate environment variable
  if (isNaN(totalProfiles) || totalProfiles < 1) {
    return {
      error: {
        code: 500,
        message:
          "Invalid TOTAL_PROFILES environment variable. Must be a positive integer.",
        status: "INTERNAL_ERROR",
      },
    };
  }

  // Validate query parameters
  if (
    isNaN(itemsPerPage) ||
    isNaN(startIndex) ||
    itemsPerPage <= 0 ||
    startIndex <= 0
  ) {
    return {
      error: {
        code: 400,
        message: "Invalid itemsPerPage or startIndex query parameters.",
        status: "INVALID_ARGUMENT",
      },
    };
  }

  // Generate mock profiles
  const profiles = Array.from(
    { length: Math.min(itemsPerPage, totalProfiles - startIndex + 1) },
    (_, i) => {
      const profileId = (startIndex + i).toString().padStart(9, "0");
      return generateProfile(
        accountId,
        webPropertyId,
        profileId,
        startIndex + i
      );
    }
  );

  // Links for pagination
  const nextStartIndex =
    startIndex + itemsPerPage <= totalProfiles
      ? startIndex + itemsPerPage
      : null;
  const previousStartIndex =
    startIndex > 1 ? Math.max(1, startIndex - itemsPerPage) : null;

  return {
    items: profiles,
    itemsPerPage,
    totalResults: totalProfiles,
    startIndex,
    previousLink: previousStartIndex
      ? `/v3/management/accounts/${accountId}/webproperties/${webPropertyId}/profiles?itemsPerPage=${itemsPerPage}&startIndex=${previousStartIndex}`
      : null,
    nextLink: nextStartIndex
      ? `/v3/management/accounts/${accountId}/webproperties/${webPropertyId}/profiles?itemsPerPage=${itemsPerPage}&startIndex=${nextStartIndex}`
      : null,
  };
};

module.exports = handle;
