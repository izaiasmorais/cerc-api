import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../libs/prisma";
import { isDateValid } from "../../utils/date";
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

			return reply.status(200).send({
				success: true,
				errors: [],
				data: {
					id: invite.id,
					status: isDateValid(invite.finalDate),
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
