
// Function to encode a single integer (1-10) into a UUID-like string
function encodeIntToUUID(int) {
    return "ALi3Aw_1k2yUyOcLc5axK_gkmNkIlkJt9J5KSi-L8u2Dkl0LyYxD3qk5qi6Sq0Xkbct1rSpPYzXhdXUXuce7WZ4DUkok5smW4fmViyEEajkDYoGuuxNX8p9PgFfMsmIx4rs" + int.toString(); 
}

// Function to decode a UUID-like string back to the integer and date
function decodeUUIDToInt(uuid) {
    const int = uuid.replace("ALi3Aw_1k2yUyOcLc5axK_gkmNkIlkJt9J5KSi-L8u2Dkl0LyYxD3qk5qi6Sq0Xkbct1rSpPYzXhdXUXuce7WZ4DUkok5smW4fmViyEEajkDYoGuuxNX8p9PgFfMsmIx4rs", "");
    return int;
}
// Export the functions for use in other files
module.exports = {
    encodeIntToUUID,
    decodeUUIDToInt
};
