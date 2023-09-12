document.addEventListener("DOMContentLoaded", async () => {
	const clientId = "interactive.public";
	const redirectUri = "http://localhost:3000/callback";

	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get("code");

	const receivedState = urlParams.get("state");
	const storedState = localStorage.getItem("oauth_state");

	if (!confirm(`${receivedState} == ${storedState}`)) {
		throw new Error("Invalid state parameter");
	}

	const codeVerifier = localStorage.getItem("pkce_code_verifier");

	// Exchange the authorization code for an access token
	const response = await fetch("https://demo.duendesoftware.com/connect/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: clientId,
			grant_type: "authorization_code",
			code,
			redirect_uri: redirectUri,
			code_verifier: codeVerifier,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		// Do something with the token
		alert("Your access token:\n\n" + data.access_token);
	} else {
		console.log("Failed to fetch token:", response);
	}
});
