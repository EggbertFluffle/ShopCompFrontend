import { useRef } from "react";
import { ViewState } from "../lib/types";
export default function LoginShopper({
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
		// login shopper controller logic
	}
	return (
		<div>
			<div>
				<h1>Login Shopper</h1>
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
					<button type="submit">Login</button>
				</form>
			</div>
			<div>
				<button onClick={() => setState("register-shopper")}>
					Don't have an account? Register
				</button>
			</div>
		</div>
	);
}
