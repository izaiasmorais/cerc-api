import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateInviteCode } from "../../utils/generate-invite-code";
import { prisma } from "../../libs/prisma";
import z from "zod";

export const createInviteRequestSchema = z.object({
	guestName: z.string(),
	phone: z.string(),
	inicialDate: z.coerce.date(),
	finalDate: z.coerce.date(),
});

export async function createInvite(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/invites",
		{
			schema: {
				tags: ["invites"],
				summary: "Create a new invite",
				body: createInviteRequestSchema,
				response: {
					200: z.object({
						success: z.boolean(),
						errors: z.array(z.string()),
						data: z.object({
							code: z.string(),
						}),
					}),
					400: z.object({
						success: z.boolean(),
						errors: z.array(z.string()),
						data: z.literal(null),
					}),
					500: z.object({
						success: z.boolean(),
						errors: z.array(z.string()),
						data: z.literal(null),
					}),
				},
			},
		},
		async (request, reply) => {
			const { guestName, phone, inicialDate, finalDate } = request.body;

			const invite = await prisma.invite.create({
				data: {
					code: generateInviteCode(),
					guestName,
					phone,
					inicialDate,
					finalDate,
				},
			});

			return reply.status(200).send({
				success: true,
				errors: [],
				data: {
					code: invite.code,
				},
			});
		}
	);
}
