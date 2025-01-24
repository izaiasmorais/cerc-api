import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../libs/prisma";
import z from "zod";

export const getInvitesSchema = z.array(
	z.object({
		id: z.string().uuid(),
		guestName: z.string(),
		code: z.string(),
		phone: z.string(),
		inicialDate: z.date(),
		finalDate: z.date(),
	})
);

export async function getInvites(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/invites",
		{
			schema: {
				tags: ["invites"],
				summary: "Get invites",
				response: {
					200: z.object({
						success: z.literal(true),
						errors: z.array(z.string()),
						data: getInvitesSchema,
					}),
					500: z.object({
						success: z.literal(false),
						errors: z.array(z.string()),
						data: z.literal(null),
					}),
				},
			},
		},
		async (_, reply) => {
			const invites = await prisma.invite.findMany();

			return reply.status(200).send({
				success: true,
				errors: [],
				data: invites,
			});
		}
	);
}
