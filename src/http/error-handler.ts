import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

type FastifiErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifiErrorHandler = async (error, _, reply) => {
	console.log(error);

	if (error instanceof ZodError) {
		return reply.status(400).send({
			success: false,
			errors: ["Invalid credentials"],
			data: null,
		});
	}

	if (error instanceof Error && "statusCode" in error) {
		const statusCode = (error as any).statusCode || 500;
		return reply.status(statusCode).send({
			success: false,
			errors: [error.message || "An error occurred"],
			data: null,
		});
	}

	reply.status(500).send({
		success: false,
		errors: ["Internal Server Error"],
		data: null,
	});
};
