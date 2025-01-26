import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../libs/prisma";
import z from "zod";

export const deleteInviteResponseSchema = z.object({
	success: z.boolean(),
	errors: z.array(z.string()),
	data: z.literal(null),
});

export async function deleteInvite(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().delete(
		"/invites/delete/:inviteId",
		{
			schema: {
				tags: ["invites"],
				summary: "Delete an invite by id",
				params: z.object({
					inviteId: z.string(),
				}),
				response: {
					204: deleteInviteResponseSchema,
					400: deleteInviteResponseSchema,
					500: z.object({
						success: z.boolean(),
						errors: z.array(z.string()),
						data: z.literal(null),
					}),
				},
			},
		},
		async (request, reply) => {
			const { inviteId } = request.params;

			const invite = await prisma.invite.findUnique({
				where: { id: inviteId },
			});

			if (!invite) {
				return reply.status(400).send({
					success: true,
					errors: ["Invite not found"],
					data: null,
				});
			}

			await prisma.invite.delete({
				where: { id: inviteId },
			});

			return reply.status(204).send({
				success: true,
				errors: [],
				data: null,
			});
		}
	);
}
