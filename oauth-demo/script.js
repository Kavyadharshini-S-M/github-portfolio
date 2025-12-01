const CLIENT_ID = '608634038750-2g1clo5ovmm3p6g3pn2d82es2a75hhdp.apps.googleusercontent.com'; // <--- PASTE YOUR CLIENT ID HERE

let tokenClient;
let accessToken = null;

// 1. Initialize the Token Client when the page loads
// We ask for 'email' and 'profile' scopes
window.onload = function() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/userinfo.email \
                https://www.googleapis.com/auth/userinfo.profile',
        callback: (response) => {
            // This function runs when Google returns the token
            if (response.error !== undefined) {
                throw (response);
            }
            // Success! We have the token.
            accessToken = response.access_token;
            document.getElementById("access-token").innerText = accessToken;
            
            // Now use the token to fetch user data
            fetchUserProfile(accessToken);
        },
    });
};

// 2. Triggered by the "Sign In" button
function signIn() {
    // This opens the Google Popup
    tokenClient.requestAccessToken();
}

// 3. Use the Access Token to call Google API
function fetchUserProfile(token) {
    fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // 4. Update UI with user data
        document.getElementById("login-section").style.display = "none";
        document.getElementById("profile-section").style.display = "block";
        
        document.getElementById("name").innerText = data.name;
        document.getElementById("email").innerText = data.email;
        document.getElementById("profile-pic").src = data.picture;
    })
    .catch(error => {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data.");
    });
}

// 5. specific logic to "Sign Out" (refresh page/clear state)
function signOut() {
    const token = google.accounts.oauth2.revoke(accessToken, () => {console.log('access token revoked')});
    location.reload();
}