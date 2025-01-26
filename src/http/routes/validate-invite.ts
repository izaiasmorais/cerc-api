import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../libs/prisma";
import {
	formatDate,
	formatDateToTimezone,
} from "../../utils/format-date-to-timezone";
import dayjs from "dayjs";
import z from "zod";

export const validateInviteResponseSchema = z.object({
	success: z.boolean(),
	errors: z.array(z.string()),
	data: z
		.object({
			id: z.string().uuid(),
			status: z.enum(["vigente", "expirado"]),
			guestName: z.string(),
			code: z.string(),
			phone: z.string(),
			inicialDate: z.date(),
			finalDate: z.date(),
		})
		.nullable(),
});

export async function validateInvite(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/invites/validate/:inviteCode",
		{
			schema: {
				tags: ["invites"],
				summary: "Validate an invite by code",
				params: z.object({
					inviteCode: z.string(),
				}),
				response: {
					200: validateInviteResponseSchema,
					500: z.object({
						success: z.boolean(),
						errors: z.array(z.string()),
						data: z.literal(null),
					}),
				},
			},
		},
		async (request, reply) => {
			const { inviteCode } = request.params;

			const invite = await prisma.invite.findUnique({
				where: { code: inviteCode },
			});

			if (!invite) {
				return reply.status(200).send({
					success: true,
					errors: ["Invalid invite code"],
					data: null,
				});
			}

			const now = formatDateToTimezone(new Date());
			const inviteFinalDate = invite.finalDate;

			console.log("Hora Atual", now);
			console.log("Hora Convite: ", inviteFinalDate);
			console.log(
				"Hora Convite Formatada: ",
				formatDateToTimezone(inviteFinalDate)
			);
			console.log("Hora Convite Formatada 2: ", formatDate(inviteFinalDate));

			// se a data/hora atual for maior que a data/hora final do convite
			const status = dayjs(now).isAfter(inviteFinalDate)
				? "expirado"
				: "vigente";

			return reply.status(200).send({
				success: true,
				errors: [],
				data: {
					id: invite.id,
					status,
					guestName: invite.guestName,
					code: invite.code,
					phone: invite.phone,
					inicialDate: invite.inicialDate,
					finalDate: invite.finalDate,
				},
			});
		}
	);
}
