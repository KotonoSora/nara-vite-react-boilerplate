import type { Route } from "./+types/($lang).api-docs";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "API Documentation - Authentication" },
    {
      name: "description",
      content: "Complete API documentation for authentication workflows",
    },
  ];
}

export default function APIDocs() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900">
                Authentication API Documentation
              </h1>
              <p className="mt-4 text-xl text-gray-600">
                Complete guide to authentication workflows and security levels
              </p>
            </div>

            {/* Authentication Flows Overview */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Authentication Flows
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    UI Workflow
                  </h3>
                  <p className="text-blue-800 mb-4">
                    Session-based authentication for web interface users.
                  </p>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• HTTP-only session cookies</li>
                    <li>• Automatic redirects to login</li>
                    <li>• CSRF protection</li>
                    <li>• OAuth social login support</li>
                    <li>• MFA integration</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">
                    API Workflow
                  </h3>
                  <p className="text-green-800 mb-4">
                    JWT token-based authentication for programmatic access.
                  </p>
                  <ul className="text-sm text-green-700 space-y-2">
                    <li>• Bearer token authentication</li>
                    <li>• Scoped access control</li>
                    <li>• Token lifecycle management</li>
                    <li>• Rate limiting</li>
                    <li>• Usage tracking</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Levels */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Security Levels
              </h2>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Standard Security
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Basic authentication using sessions (UI) or JWT tokens
                    (API).
                  </p>
                  <div className="text-sm text-gray-600">
                    <strong>Requirements:</strong> Valid session or JWT token
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">
                    High Security
                  </h3>
                  <p className="text-orange-800 mb-3">
                    Enhanced security with additional basic authentication
                    layer.
                  </p>
                  <div className="text-sm text-orange-700">
                    <strong>Requirements:</strong> Session/JWT + Basic Auth +
                    Permissions
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">
                    Critical Security
                  </h3>
                  <p className="text-red-800 mb-3">
                    Maximum security for highly sensitive operations.
                  </p>
                  <div className="text-sm text-red-700">
                    <strong>Requirements:</strong> Session/JWT + Basic Auth +
                    Admin Permissions + Audit Logging
                  </div>
                </div>
              </div>
            </div>

            {/* API Endpoints */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                API Endpoints
              </h2>

              <div className="space-y-8">
                {/* Login Endpoint */}
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Login
                    </h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                      POST
                    </span>
                  </div>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm block mb-4">
                    /api/auth/login
                  </code>
                  <p className="text-gray-700 mb-4">
                    Authenticate with email and password to receive a JWT token.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Request Body
                      </h4>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        {`{
  "email": "user@example.com",
  "password": "password123",
  "scopes": ["profile:read", "api:access"],
  "expiresInDays": 30,
  "tokenName": "My API Token"
}`}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Response
                      </h4>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        {`{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "expiresAt": "2024-02-01T00:00:00Z",
  "scopes": ["profile:read", "api:access"]
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Register Endpoint */}
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Register
                    </h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                      POST
                    </span>
                  </div>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm block mb-4">
                    /api/auth/register
                  </code>
                  <p className="text-gray-700 mb-4">
                    Create a new user account and receive a JWT token.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Request Body
                      </h4>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        {`{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "name": "New User",
  "scopes": ["profile:read"]
}`}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Response
                      </h4>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        {`{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 2,
    "email": "newuser@example.com",
    "name": "New User",
    "role": "user"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Verify Token Endpoint */}
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Verify Token
                    </h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                      POST
                    </span>
                  </div>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm block mb-4">
                    /api/auth/verify
                  </code>
                  <p className="text-gray-700 mb-4">
                    Verify the validity of a JWT token.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Request Body
                      </h4>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        {`{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}`}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Response
                      </h4>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        {`{
  "valid": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "tokenId": 123,
  "scopes": ["profile:read", "api:access"]
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Get Current User */}
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Get Current User
                    </h3>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                      GET
                    </span>
                  </div>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm block mb-4">
                    /api/auth/me
                  </code>
                  <p className="text-gray-700 mb-4">
                    Get information about the currently authenticated user.
                  </p>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Headers</h4>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto mb-4">
                      Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
                    </pre>

                    <h4 className="font-medium text-gray-900 mb-2">Response</h4>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                      {`{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "emailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLoginAt": "2024-01-15T10:30:00Z"
  },
  "scopes": ["profile:read", "api:access"]
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Authentication Examples */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Authentication Examples
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Basic API Authentication
                  </h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
                    {`curl -X GET http://localhost:3000/api/auth/me \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \\
  -H "Content-Type: application/json"`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    High-Security API Access (with Basic Auth)
                  </h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
                    {`curl -X GET http://localhost:3000/secure-profile \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \\
  -H "Authorization: Basic dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZA==" \\
  -H "Content-Type: application/json"`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    JavaScript/Fetch Example
                  </h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
                    {`// Login and get token
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    scopes: ['profile:read', 'api:access']
  })
});

const { token } = await response.json();

// Use token for authenticated requests
const userResponse = await fetch('/api/auth/me', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});

const user = await userResponse.json();`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Error Codes */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Error Codes
              </h2>

              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        HTTP Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        INVALID_CREDENTIALS
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Email or password is incorrect
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        401
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        INVALID_TOKEN
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        JWT token is invalid or expired
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        401
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        MISSING_TOKEN
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Bearer token is required but not provided
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        401
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        USER_EXISTS
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        User with this email already exists
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        409
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        RATE_LIMITED
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Too many requests, please try again later
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        429
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rate Limiting */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Rate Limiting
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      All API endpoints are rate limited. Check the response
                      headers for limit information:
                    </p>
                    <ul className="mt-2 list-disc list-inside">
                      <li>
                        <code>X-RateLimit-Limit</code>: Maximum requests allowed
                      </li>
                      <li>
                        <code>X-RateLimit-Remaining</code>: Remaining requests
                      </li>
                      <li>
                        <code>X-RateLimit-Reset</code>: Time when limit resets
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
