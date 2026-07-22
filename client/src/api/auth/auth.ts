import readline from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process";
import { AUTH } from "./auth.api"

export async function auth(){
	const { login, signup } = AUTH();
	const commands = ["N", "L"]
	let complete = false;
	let username = "";
	let passphrase = "";
	const rl = readline.createInterface({ input, output });
	try{
		const choice = await rl.question(`(N)ew or (L)ogin`);
		if(!commands.includes(choice)) process.exit(1); 
		switch (choice){
			case commands[0]:
				do{
					username = await rl.question("Enter a username.")
					if(username.length < 1){
						console.error("Username needs to be longer than one character.")
						return;
					}
					passphrase = await rl.question("Enter a passphrase");
					if(passphrase.length < 8){
						console.error("Passphrase needs to be longer than.")
						return;
					}
					const verify_passphrase = await rl.question("Re-enter passphrase.")
					if(verify_passphrase !== passphrase){
						console.error("Passphrases don't match. Please re-enter passphrase.");
						return;
					}
					complete = true;
				}while(complete);

				await signup(username, passphrase)
			break;
			case commands[1]:
				do{
					username = await rl.question("Enter a username.")
					if(username.length < 1){
						console.error("Username needs to be longer than one character.")
						return;
					}
					const passphrase = await rl.question("Enter a passphrase");
					if(passphrase.length < 8){
						console.error("Passphrase needs to be longer than.")
						return;
					}
					const verify_passphrase = await rl.question("Re-enter passphrase.")
					if(verify_passphrase !== passphrase){
						console.error("Passphrases don't match. Please re-enter passphrase.");
						return;
					}
					complete = true;
				}while(complete);

				await login(username, passphrase);
			break;
			default: 
				return;
		}
	}catch(err){
		throw err;
	}
}
