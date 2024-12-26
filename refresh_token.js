function refresh_token(accessToken) {
    const tokenInfoUrl = 'https://www.googleapis.com/oauth2/v1/tokeninfo';
    const refreshTokenUrl = 'https://oauth2.googleapis.com/token';

    // Check token validity
    const tokenInfoResponse = await fetch(`${tokenInfoUrl}?access_token=${accessToken}`);
    if (tokenInfoResponse.ok) {
        return accessToken; // Token is valid
    }

    // Refresh the token
    const refreshToken = localStorage.getItem('refreshToken');
    const requestBody = {
        client_id: '919212619443-d2ck4cv25sfhvvg5n1rj82ob81h56362.apps.googleusercontent.com',
        client_secret: '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',
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
    };

    const refreshResponse = await fetch(refreshTokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const newAccessToken = data.access_token;

        // Store the new access token
        localStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
    }

    throw new Error('Unable to refresh token.');
}
