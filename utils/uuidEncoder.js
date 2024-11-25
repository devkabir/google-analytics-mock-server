const base64url = require('base64url'); // Install this library: `npm install base64url`

// Encode an integer into a URL-safe UUID-like string
function encodeIntToUUID(int) {
    // Convert integer to a string and Base64URL encode it
    const base64 = base64url(int.toString());
    // Format it like a UUID (8-4-4-4-12 pattern)
    return `${base64.slice(0, 8)}-${base64.slice(8, 12)}-${base64.slice(12, 16)}-${base64.slice(16, 20)}-${base64.slice(20)}`;
}

// Decode a URL-safe UUID-like string back to an integer
function decodeUUIDToInt(uuid) {
    // Remove the UUID formatting
    const base64 = uuid.replace(/-/g, '');
    // Decode the Base64URL string back to the integer
    return parseInt(base64url.decode(base64), 10);
}

// Export the functions for use in other files
module.exports = {
    encodeIntToUUID,
    decodeUUIDToInt
};
