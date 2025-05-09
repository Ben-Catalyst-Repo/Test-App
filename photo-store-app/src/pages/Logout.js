import { useEffect } from "react"

export default function Logout() {

    useEffect(() => {
        var redirectURL = window.origin + "/__catalyst/auth/login";
        var auth = window.catalyst.auth;
        auth.signOut(redirectURL);
    })
    return null;

}
