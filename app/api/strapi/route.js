import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const STRAPI_TOKEN = process.env.STRAPI_API_TOKENI
console.log('🔍 Token length:', STRAPI_TOKEN?.length)
console.log('🔍 Token first 20 chars:', STRAPI_TOKEN?.substring(0, 20))
console.log('🔍 Token last 10 chars:', STRAPI_TOKEN?.substring(STRAPI_TOKEN?.length - 10))
export async function POST(request) {
    console.log('🚀 Strapi API Route called')
    console.log('🔧 STRAPI_URL:', STRAPI_URL)
    console.log('🔧 Has Token:', !!STRAPI_TOKEN)

    try {
        const contentType = request.headers.get('content-type')
        console.log('📥 Content-Type:', contentType)

        // ✅ Handle file upload (FormData - no content-type or multipart/form-data)
        // When browser sends FormData, it may not include content-type in the initial request
        let isFileUpload = false;

        try {
            // Try to parse as FormData first
            const clonedRequest = request.clone()
            const formData = await clonedRequest.formData()

            // If we successfully parsed FormData and it has files, it's a file upload
            if (formData.has('files') || formData.getAll('files').length > 0) {
                isFileUpload = true
                console.log('📤 File upload detected via FormData parsing')
                console.log('📦 Number of files:', formData.getAll('files').length)

                const response = await fetch(`${STRAPI_URL}/api/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${STRAPI_TOKEN}`,
                        // Don't set Content-Type - let fetch handle it with boundary
                    },
                    body: formData
                })

                const responseText = await response.text()
                console.log('📥 Upload response status:', response.status)

                if (!response.ok) {
                    let errorData
                    try {
                        errorData = JSON.parse(responseText)
                    } catch {
                        errorData = { message: responseText }
                    }

                    console.error('❌ Upload failed:', errorData)

                    return NextResponse.json(
                        {
                            error: errorData.error?.message || response.statusText || 'Upload failed',
                            details: errorData,
                            status: response.status
                        },
                        { status: response.status }
                    )
                }

                const result = JSON.parse(responseText)
                console.log('✅ Upload successful:', result.length, 'file(s)')
                return NextResponse.json(result)
            }
        } catch (formDataError) {
            // Not FormData, continue to JSON handling
            console.log('📝 Not FormData, treating as JSON request')
        }

        // If we got here and it's not a file upload, handle as JSON
        if (!isFileUpload) {
            const body = await request.json()
            const { endpoint, method = 'GET', data } = body

            console.log('📋 Request details:', {
                endpoint,
                method,
                hasData: !!data
            })

            const url = `${STRAPI_URL}/api/${endpoint}`
            console.log('🌐 Full URL:', url)

            const options = {
                method: method,
                headers: {
                    'Authorization': `Bearer ${STRAPI_TOKEN}`,
                    'Content-Type': 'application/json',
                }
            }

            // Add body for POST, PUT, PATCH (but NOT for GET or DELETE)
            if (data && method !== 'GET' && method !== 'DELETE') {
                // Wrap data in { data: {...} } for Strapi v4/v5
                options.body = JSON.stringify({ data })
                console.log('📤 Sending body:', JSON.stringify({ data }, null, 2))
            }

            console.log('⏳ Sending request to Strapi...')
            const response = await fetch(url, options)

            console.log('📥 Response status:', response.status, response.statusText)

            // Get response as text first to safely handle non-JSON responses
            const responseText = await response.text()
            console.log('📥 Response body (first 500 chars):', responseText.substring(0, 500))

            if (!response.ok) {
                // Try to parse as JSON
                let errorData
                try {
                    errorData = JSON.parse(responseText)
                    console.log('📥 Parsed error as JSON:', errorData)
                } catch (parseError) {
                    // Not JSON - return the raw text
                    console.error('❌ Non-JSON error response:', responseText)

                    // Provide helpful hints based on status code
                    let hint = 'Check Strapi server logs'
                    if (response.status === 405) {
                        hint = `Method Not Allowed for endpoint: ${endpoint}. 
                        Check:
                        1. Is the collection type name correct in Strapi?
                        2. Is the '${method}' permission enabled? (Settings → Roles → ${method.toLowerCase()})
                        3. Is Strapi running and accessible?`
                    } else if (response.status === 403) {
                        hint = 'Forbidden - Check your API token has the correct permissions'
                    } else if (response.status === 404) {
                        hint = `Endpoint not found: ${endpoint}. Check if collection type exists in Strapi`
                    } else if (response.status === 400) {
                        hint = 'Bad Request - Check your data format matches Strapi schema'
                    }

                    return NextResponse.json(
                        {
                            error: responseText || response.statusText,
                            status: response.status,
                            url: url,
                            method: method,
                            endpoint: endpoint,
                            hint: hint
                        },
                        { status: response.status }
                    )
                }

                return NextResponse.json(
                    {
                        error: errorData.error?.message || response.statusText,
                        details: errorData
                    },
                    { status: response.status }
                )
            }

            // Parse successful response
            let result
            try {
                // Handle empty responses (like DELETE which might return 204 No Content)
                if (!responseText || responseText.trim() === '') {
                    console.log('✅ Empty response (success)')
                    return NextResponse.json({ success: true })
                }

                result = JSON.parse(responseText)
                console.log('✅ Success! Response keys:', Object.keys(result))
            } catch (parseError) {
                console.error('❌ Failed to parse success response:', parseError)
                console.log('Raw response:', responseText)
                return NextResponse.json(
                    { error: 'Invalid JSON response from Strapi', rawResponse: responseText },
                    { status: 500 }
                )
            }

            return NextResponse.json(result)
        }

    } catch (error) {
        console.error('💥 API Route Error:', error)
        console.error('Error stack:', error.stack)
        return NextResponse.json(
            {
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        )
    }
}