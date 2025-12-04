import { useRef, useState } from "react";
import { ViewState } from "../lib/types";
import { instance } from "../lib/Endpoint";
import { shopper } from "../lib/Shopper";

import { useAuth } from "react-oidc-context";

export default function LoginShopper({ setState }: { setState: (state: ViewState) => void }) {
	const formRef = useRef<HTMLFormElement>(null);
	let [ loginError, setLoginError ] = useState("");

	const auth = useAuth();

	const signOutRedirect = () => {
		const clientId = "5m9to35nji6n1ibma2j96904r9";
		const logoutUri = "https://eggbert.xyz";
		const cognitoDomain = "https://us-east-1n6lnwf6ym.auth.us-east-1.amazoncognito.com";
		window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData(formRef.current!);
		const payload = {
			username: formData.get("username") as string,
			password: formData.get("password") as string
		};
		console.log(payload);

		instance.post("login-shopper", payload)
			.then((response) => {
				shopper.username = payload.username;
				shopper.uuid = response.data["shopper-uuid"];
				setState("receipt");
			})
			.catch((error) => {
				console.log(`Received code ${error.status} with error: ${error.response.data.message}`);
				setLoginError(error.response.data.message);
			});
	}

	return (
		<div>
			<div>
				<h1>Login Shopper</h1>

				{loginError != "" ? <p>{loginError}</p> : <></>}

				<form ref={formRef} onSubmit={handleSubmit}>
					<label>
						Name:
						<input type="text" name="username" />
					</label>
					<br />
					<label>
						Password:
						<input type="password" name="password" />
					</label>
					<br />
					<button type="submit">Login</button>
				</form>
			</div>
			<div>
				<button onClick={() => setState("register-shopper")}>
					Don't have an account? Register
				</button>
			</div>
			<button onClick={() => {
				console.log("clicked!");
				console.log(auth);
				auth.signinRedirect();
			}}>
				Sign In Redirect
			</button>
			{ auth.error ? <p>{auth.error.message}</p> : <p>Ready</p> }
		</div>
	);
}
