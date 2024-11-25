const AccountGenerator = require("../utils/accountGenerator.js");
exports.handle = function (app) {
  app.post("/token", (req, res) => {
    const { grant_type, client_id, client_secret, refresh_token } = req.body;

    if (!grant_type || !client_id || !client_secret) {
      return res.status(400).json({
        error: "invalid_request",
        error_description:
          "Missing required parameters: grant_type, client_id, or client_secret.",
      });
    }
    return res.status(200).json({
      access_token: "ya29.a0AfH6SMA-FakeAccessToken123456789",
      expires_in: 3599,
      id_token:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      refresh_token: "1//FakeRefreshToken123456789",
      scope:
        "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/analytics.readonly openid",
      token_type: "Bearer",
    });
  });

  app.get("/v1/people/me", (req, res) => {
    return res.status(200).json({
      emailAddresses: [
        {
          metadata: {
            primary: true,
            source: {
              id: "1234567890",
              type: "DOMAIN_PROFILE",
            },
            sourcePrimary: true,
            verified: true,
          },
          value: "devkabir@example.com",
        },
        {
          formattedType: "Work",
          metadata: {
            source: {
              id: "1234567890",
              type: "DOMAIN_PROFILE",
            },
          },
          type: "work",
          value: "devkabir@example.com",
        },
      ],
      etag: "%EggBAgMJLjc9PhoEAQIFBw==",
      names: [
        {
          displayName: "Kabir Dev",
          displayNameLastFirst: "Dev, Kabir",
          familyName: "Dev",
          givenName: "Kabir",
          metadata: {
            primary: true,
            source: {
              id: "1234567890",
              type: "PROFILE",
            },
            sourcePrimary: true,
          },
          unstructuredName: "Kabir Dev",
        },
        {
          displayName: "Dev Kabir",
          displayNameLastFirst: "Dev Kabir",
          familyName: "Kabir",
          givenName: "Dev",
          metadata: {
            source: {
              id: "1234567890",
              type: "DOMAIN_PROFILE",
            },
          },
          unstructuredName: "Dev Kabir",
        },
      ],
      photos: [
        {
          metadata: {
            primary: true,
            source: {
              id: "1234567890",
              type: "PROFILE",
            },
          },
          url: "https://devkabir.github.io/assets/devkabir-B_9DNoC6.webp",
        },
      ],
      resourceName: "people/1234567890",
    });
  });
  app.get("/v1beta/accounts", (req, res) => {
    return res.status(200).json(AccountGenerator(req.query, 'accounts'));
  })
  app.get("/v1beta/accountSummaries", (req, res) => {
    return res.status(200).json(AccountGenerator(req.query, 'summaries'));
  });
};
