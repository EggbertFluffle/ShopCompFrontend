import "./page.css";

import { useRef, useState } from "react";
import { ViewState } from "../lib/types";
import { instance } from "../lib/Endpoint";
import { shopper } from "../lib/Shopper";

export default function LoginShopper({
	setState,
}: {
	setState: (state: ViewState) => void;
}) {
	const formRef = useRef<HTMLFormElement>(null);
	let [loginError, setLoginError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData(formRef.current!);
		const payload = {
			username: formData.get("username") as string,
			password: formData.get("password") as string,
		};
		console.log(payload);

		instance
			.post("login-shopper", payload)
			.then((response) => {
				shopper.username = payload.username;
				shopper.uuid = response.data["shopper-uuid"];
				setState("receipt");
			})
			.catch((error) => {
				console.log(
					`Received code ${error.status} with error: ${error.response.data.message}`
				);
				setLoginError(error.response.data.message);
			});
	};

	return (
		<div>
			<div className="login-section">
				<h1>Login Shopper</h1>

				{loginError != "" ? <p>{loginError}</p> : <></>}

				<form ref={formRef} onSubmit={handleSubmit}>
					<label className="credentials-input">
						Username:
						<input type="text" name="username" />
					</label>
					<br />
					<label className="credentials-input">
						Password:
						<input type="password" name="password" />
					</label>
					<br />
					<button className="login-button" type="submit">
						Login
					</button>
				</form>
				<div>
					<button
						className="switch-link"
						onClick={() => setState("register-shopper")}
					>
						Don't have an account? Register
					</button>
				</div>
			</div>
		</div>
	);
}
