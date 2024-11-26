const { decodeUUIDToInt, encodeIntToUUID } = require("./uuidEncoder");

// Helper function to generate random dates
const generateRandomDate = (start, end) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString();
};

const generateResponse = ({ propertyId, pageSize, pageToken }) => {

    // Validate propertyId
    if (!propertyId || isNaN(propertyId)) {
        return {
            error: 'Invalid propertyId. It must be a valid number.',
        };
    }

    // Validate pageSize
    const pageSizeInt = parseInt(pageSize, 10);
    if (isNaN(pageSizeInt) || pageSizeInt < 1 || pageSizeInt > 200) {
        return {
            error: 'Invalid pageSize. It must be a number between 1 and 200.',
        };
    }

    // Mock Data
    const totalDataStreams = parseInt(process.env.TOTAL_DATA_STREAMS, 10);
    let pageTokenInt = 0;
    let startIndex = 0;
    let endIndex = pageSizeInt;
    if (pageToken){
        if (pageToken !== "") {
          pageTokenInt = parseInt(decodeUUIDToInt(pageToken), 10);
        }
      
        startIndex = pageTokenInt * pageSizeInt;
        endIndex = Math.min(startIndex + pageSizeInt, totalDataStreams);
    }

    


    // Return empty if out of range
    if (startIndex >= totalDataStreams) {
        return {
            dataStreams: [],
            nextPageToken: null,
        };
    }

    // Generate date range for mock data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1); // 1 year ago

    // Generate mock data streams
    const dataStreams = Array.from({ length: endIndex - startIndex }, (_, i) => {
        const streamId = startIndex + i + 1;

        const type = 'WEB_DATA_STREAM';

        const webStreamData = type === 'WEB_DATA_STREAM'
            ? {
                measurementId: `G-${Math.floor(1000 + Math.random() * 9000)}${propertyId}`,
                defaultUri: `https://example.com`,
            }
            : null;

        const androidAppStreamData = type === 'ANDROID_APP_DATA_STREAM'
            ? {
                firebaseAppId: `1:1234567890:android:abcdef${streamId}`,
                packageName: `com.example.android.app${streamId}`,
            }
            : null;

        const iosAppStreamData = type === 'IOS_APP_DATA_STREAM'
            ? {
                firebaseAppId: `1:1234567890:ios:abcdef${streamId}`,
                bundleId: `com.example.ios.app${streamId}`,
            }
            : null;

        return {
            name: `properties/${propertyId}/dataStreams/${streamId}`,
            type,
            displayName: `Data Stream ${streamId}`,
            createTime: generateRandomDate(startDate, endDate),
            updateTime: generateRandomDate(startDate, endDate),
            webStreamData,
            androidAppStreamData,
            iosAppStreamData,
        };
    });
    // Calculate next page token
    const nextPageToken = endIndex < totalDataStreams ? encodeIntToUUID(pageTokenInt + 1) : null;

    // Respond with mock data
    return {
        dataStreams,
        nextPageToken,
    };

}

module.exports = generateResponse
