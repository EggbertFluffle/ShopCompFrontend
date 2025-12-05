import "./page.css";

import { useRef, useState } from "react";
import { ViewState } from "../lib/types";
import { instance } from "../lib/Endpoint";
import { shopper } from "../lib/Shopper";

export default function RegisterShopper({
	setState,
}: {
	setState: (state: ViewState) => void;
}) {
	const formRef = useRef<HTMLFormElement>(null);
	const [registerError, setRegisterError] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData(formRef.current!);
		const payload = {
			username: formData.get("username") as string,
			password: formData.get("password") as string,
		};

		instance
			.post("register-shopper", payload)
			.then((response) => {
				shopper.username = payload.username;
				shopper.uuid = response.data["shopper-uuid"];
				setState("receipt");
			})
			.catch((error) => {
				console.log(
					`Received code ${error.status} with error: ${error.response.data.message}`
				);
				setRegisterError(error.response.data.message);
			});
	};

	return (
		<div>
			<div>
				<h1>Register Shopper</h1>

				{registerError != "" ? <p>{registerError}</p> : <></>}

				<form ref={formRef} onSubmit={handleSubmit}>
					<label>
						Username:
						<input type="text" name="username" />
					</label>
					<br />

					<label>
						Password:
						<input type="password" name="password" />
					</label>
					<br />

					<button type="submit">Register</button>
				</form>
			</div>

			<div>
				<button onClick={() => setState("login-shopper")}>
					Already have an account? Login
				</button>
			</div>
		</div>
	);
}
