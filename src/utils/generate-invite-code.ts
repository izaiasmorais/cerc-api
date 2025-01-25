import crypto from "crypto";

export function generateInviteCode() {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	return Array.from({ length: 8 }, () =>
		chars.charAt(crypto.randomInt(0, chars.length))
	).join("");
}
