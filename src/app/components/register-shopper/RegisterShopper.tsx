import { useRef } from "react";
import { ViewState } from "../lib/types";
export default function RegisterShopper({
	setState
}: {
		setState: (state: ViewState) => void
	}) {
	const formRef = useRef<HTMLFormElement>(null);
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const name = formRef.current?.name.value;
		const password = formRef.current?.password.value;
		console.log(name, password);
		// register shopper controller logic
	}
	return (
		<div>
			<div>
				<h1>Register Shopper</h1>
				<form ref={formRef} onSubmit={handleSubmit}>
					<label>
						Name:
						<input type="text" name="name" />
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
