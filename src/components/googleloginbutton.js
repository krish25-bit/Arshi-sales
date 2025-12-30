import { useEffect } from "react";

export default function GoogleLoginButton() {
  // Hardcoded Client ID
  const clientId = "756658194054-pgp9jdpsgh3cfp58flvsj5bhoou2a4iv.apps.googleusercontent.com";

  useEffect(() => {
    // Function to initialize and render the button
    const initializeGoogleLogin = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleIconLogin"),
          { theme: "outline", size: "large", width: "100%" } // customization attributes
        );
      }
    };

    // Check if script is already present
    const scriptId = "google-jssdk";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.id = scriptId;
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleLogin;
      document.body.appendChild(script);
    } else {
      // Script already loaded, just initialize
      initializeGoogleLogin();
    }
  }, []);

  async function handleCredentialResponse(response) {
    try {
      const res = await fetch("/api/auth/google-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage"));
        window.location.href = "/";
      } else {
        alert("Google Login Failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong during Google Login");
    }
  }

  return <div id="googleIconLogin" className="w-full flex justify-center"></div>;
}
