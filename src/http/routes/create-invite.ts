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
					201: z.object({
						success: z.boolean(),
						errors: z.array(z.string()),
						data: z.literal(null),
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

			await prisma.invite.create({
				data: {
					code: generateInviteCode(),
					guestName,
					phone,
					finalDate,
					inicialDate,
				},
			});

			return reply.status(201).send({
				success: true,
				errors: [],
				data: null,
			});
		}
	);
}
