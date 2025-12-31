import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKENI;

export async function POST(request) {
    console.log('🚀 API Route Hit - Starting processing...');

    try {
        const formData = await request.formData();

        console.log('📦 FormData received, extracting fields...');

        const fromUser = formData.get('fromUser');
        const toUser = formData.get('toUser');
        const category = formData.get('category');
        const title = formData.get('title');
        const description = formData.get('description');
        const attachment = formData.get('attachment');



        // Validate required fields
        if (!fromUser || !toUser || !category || !title || !description) {
            console.error('❌ Validation failed - missing required fields');
            console.error('Missing:', {
                fromUser: !fromUser,
                toUser: !toUser,
                category: !category,
                title: !title,
                description: !description
            });

            return NextResponse.json(
                { error: 'Missing required fields in form submission' },
                { status: 400 }
            );
        }

        console.log('✅ All required fields present');

        // Detect Strapi version and prepare payload
        const isDocumentId = typeof fromUser === 'string' && fromUser.length > 15;
        console.log('🔍 Detected Strapi format:', isDocumentId ? 'v5 (documentId)' : 'v4 (numeric)');

        const payload = {
            data: {
                fromUser: isDocumentId ? fromUser : parseInt(fromUser),
                toUser: isDocumentId ? toUser : parseInt(toUser),
                category: category,
                title: title.trim(),
                description: description.trim(),
                ...(attachment && { attachment: parseInt(attachment) })
            }
        };

        console.log('📤 Sending to Strapi:');
        console.log(JSON.stringify(payload, null, 2));

        const response = await fetch(`${STRAPI_URL}/api/personal-queries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STRAPI_API_TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        console.log('📥 Strapi Response Status:', response.status);
        console.log('📥 Strapi Response Body:', JSON.stringify(data, null, 2));

        if (!response.ok) {
            const errorMessage = data?.error?.message ||
                data?.error?.details?.errors?.[0]?.message ||
                JSON.stringify(data.error) ||
                'Failed to create query in Strapi';

            console.error('❌ Strapi returned error:', errorMessage);

            return NextResponse.json(
                {
                    error: errorMessage,
                    strapiError: data.error
                },
                { status: response.status }
            );
        }

        console.log('✅ Query created successfully!');

        return NextResponse.json({
            success: true,
            data: data.data
        });

    } catch (error) {
        console.error('💥 API Route Error:', error);
        console.error('Error stack:', error.stack);

        return NextResponse.json(
            {
                error: error.message || 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}