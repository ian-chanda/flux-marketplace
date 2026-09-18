export const genRandUsername = (firstName: string) => {
	firstName = firstName.toLowerCase().trim()
	const randDigits = Math.floor(1000 + Math.random() * 9000);
	return `${firstName}${randDigits}`
}
