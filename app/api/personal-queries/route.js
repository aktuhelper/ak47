import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();

        const STRAPI_TOKEN = process.env.STRAPI_API_TOKENI;
        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

        if (!STRAPI_TOKEN) {
            console.error('❌ STRAPI_API_TOKEN is not configured');
            return NextResponse.json(
                { error: 'Server configuration error: Missing API token' },
                { status: 500 }
            );
        }

        const dataString = formData.get('data');
        const attachmentFile = formData.get('files.attachment');

        console.log('\n=== API ROUTE RECEIVED ===');
        console.log('Data string:', dataString);
        console.log('Has attachment:', !!attachmentFile);

        if (!dataString) {
            return NextResponse.json(
                { error: 'Missing data in request' },
                { status: 400 }
            );
        }

        let queryData;
        try {
            queryData = JSON.parse(dataString);
            console.log('📦 Parsed data:', queryData);
            console.log('   fromUser type:', typeof queryData.fromUser, 'value:', queryData.fromUser);
            console.log('   toUser type:', typeof queryData.toUser, 'value:', queryData.toUser);
        } catch (e) {
            console.error('❌ JSON parse error:', e);
            return NextResponse.json(
                { error: 'Invalid JSON data' },
                { status: 400 }
            );
        }

        const strapiEndpoint = `${STRAPI_URL}/api/personal-queries`;

        // SOLUTION: When there's NO file, use pure JSON
        // When there IS a file, use FormData with proper structure

        if (!attachmentFile) {
            // NO FILE: Use JSON request
            console.log('📤 Sending JSON request (no file)');
            console.log('Body:', JSON.stringify({ data: queryData }, null, 2));

            const response = await fetch(strapiEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${STRAPI_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: queryData }),
            });

            console.log('📥 Response Status:', response.status);
            const responseData = await response.json();
            console.log('📥 Response:', JSON.stringify(responseData, null, 2));

            if (!response.ok) {
                console.error('❌ Error:', responseData);
            } else {
                console.log('✅ Success!');
            }

            return NextResponse.json(responseData, { status: response.status });
        } else {
            // WITH FILE: Use multipart/form-data
            console.log('📤 Sending FormData request (with file)');

            const strapiFormData = new FormData();

            // For Strapi with files, the data goes as a JSON string in the 'data' field
            strapiFormData.append('data', JSON.stringify(queryData));
            strapiFormData.append('files.attachment', attachmentFile);

            console.log('📎 File:', attachmentFile.name, attachmentFile.type, attachmentFile.size);

            const response = await fetch(strapiEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${STRAPI_TOKEN}`,
                    // Don't set Content-Type for FormData - browser sets it with boundary
                },
                body: strapiFormData,
            });

            console.log('📥 Response Status:', response.status);
            const responseData = await response.json();
            console.log('📥 Response:', JSON.stringify(responseData, null, 2));

            if (!response.ok) {
                console.error('❌ Error:', responseData);
            } else {
                console.log('✅ Success!');
            }

            return NextResponse.json(responseData, { status: response.status });
        }

    } catch (error) {
        console.error('❌ API Route Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}