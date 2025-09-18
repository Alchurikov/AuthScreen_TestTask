## Error Scenarios Covered

### Login Errors

- Invalid credentials (401)
- Account locked (423)
- Email not verified (403)
- Server errors (500)
- Network failures
- Rate limiting (429)
- Maintenance mode (503)

### Two-Factor Authentication Errors

- Invalid verification code
- Expired verification code
- Server errors during verification
- Network failures

## Test Scenarios

### Login Form

Use these email addresses to test different scenarios:

- `locked@test.com` - Account locked error
- `unverified@test.com` - Email not verified error
- `server-error@test.com` - Server error
- `network-error@test.com` - Network connection error
- `rate-limit@test.com` - Rate limiting error
- `maintenance@test.com` - Maintenance mode
- `direct-success@test.com` - Skip 2FA, direct login
- Any other email - Normal 2FA flow

### Two-Factor Authentication

- `000000` - Invalid code error
- `111111` - Expired code error
- `999999` - Server error
- Any other 6-digit code - Success
