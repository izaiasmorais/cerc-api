import dayjs from "dayjs";

export function formatDate(date: string | Date): string {
	return dayjs(date).format("YYYY-MM-DDTHH:mm:ssZ");
}

export function formatDateToTimezone(date: string | Date): string {
	return dayjs(date).add(3, "hour").format("YYYY-MM-DDTHH:mm:ssZ");
}

export function isDateValid(date: Date): "expirado" | "vigente" {
	const now = formatDate(new Date());

	const formattedDate = formatDateToTimezone(date);

	const status = dayjs(now).isAfter(formattedDate) ? "expirado" : "vigente";

	return status;
}
