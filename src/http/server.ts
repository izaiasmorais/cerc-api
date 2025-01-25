import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifyJwt from "@fastify/jwt";
import fastifySwaggerUI from "@fastify/swagger-ui";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider,
} from "fastify-type-provider-zod";
import { errorHandler } from "./error-handler";
import { env } from "../env";
import { prisma } from "../libs/prisma";
import { getInvites } from "./routes/get-invites";
import { createInvite } from "./routes/create-invite";
import { validateInvite } from "./routes/validate-invite";

const port = Number(env.PORT);

const app = fastify().withTypeProvider<ZodTypeProvider>();

// Configurações de validação e serialização
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Middleware de tratamento de erros
app.setErrorHandler(errorHandler);

// Plugins
app.register(fastifyCors);
app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "CERC API",
			description: "API para gerenciamento de convites de um condomínio.",
			version: "1.0.0",
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUI, {
	routePrefix: "/docs",
});
app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
});

// Registra o Prisma no contexto do Fastify
app.decorate("prisma", prisma);

// Rota base
app.get("/", async () => {
	return { message: "Hello World" };
});

// Convites
app.register(createInvite);
app.register(getInvites);
app.register(validateInvite);

try {
	app.listen({ port, host: "0.0.0.0" });
	console.log(`HTTP server running at PORT ${env.PORT}`);
} catch (err) {
	app.log.error(err);
	process.exit(1);
}
