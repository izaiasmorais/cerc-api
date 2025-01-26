import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDate(date: string | Date): string {
	return dayjs(date).format("YYYY-MM-DDTHH:mm:ssZ");
}

export function formatDateToTimezone(
	date: string | Date,
	timezone: string = "America/Sao_Paulo"
): string {
	return dayjs(date).tz(timezone).format("YYYY-MM-DDTHH:mm:ssZ");
}
