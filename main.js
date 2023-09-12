document.addEventListener("DOMContentLoaded", () => {
	const clientId = "interactive.public";
	const redirectUri = "http://localhost:3000"; // Update this to your redirect URL

	document.getElementById("authorize").addEventListener("click", async () => {
		// Generate and store a new PKCE code_verifier and the transformed code_challenge
		debugger;
		const codeVerifier = generateRandomString(128);
		const codeChallenge = base64URL(await sha256(codeVerifier));
		localStorage.setItem("pkce_code_verifier", codeVerifier);
		localStorage.setItem("oauth_state", generateRandomString(16));

		// Build the OAuth URL and navigate to it
		const authUrl =
			`https://demo.duendesoftware.com/connect/authorize?` +
			`client_id=${clientId}&` +
			`response_type=code&` +
			`scope=openid profile email api offline_access&` +
			`state=${localStorage.getItem("oauth_state")}&` +
			`redirect_uri=${encodeURIComponent(redirectUri)}/callback&` +
			`code_challenge=${codeChallenge}&` +
			`code_challenge_method=S256`;

		if (confirm(`Navigate to:\n${authUrl}`)) {
			window.location.href = authUrl;
		} else {
			throw new Error('Not implemented!')
		}
	});
});

// PKCE Helper Functions

function generateRandomString(length) {
	let text = "";
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

async function sha256(plain) {
	const encoder = new TextEncoder();
	const data = encoder.encode(plain);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(digest));
}

function base64URL(array) {
	let string = String.fromCharCode.apply(null, array);
	let base64 = btoa(string)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
	return base64;
}
