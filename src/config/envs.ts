import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
	PORT: number;
	PRODUCTS_MICROSERVICE_HOST: string;
	PRODUCTS_MICROSERVICE_PORT: number;
	ORDERS_MICROSERVICE_HOST: string;
	ORDERS_MICROSERVICE_PORT: number;
}

const envsSchema = joi
	.object<EnvVars>({
		PORT: joi.number().port().required(),
		PRODUCTS_MICROSERVICE_HOST: joi.string().hostname().required(),
		PRODUCTS_MICROSERVICE_PORT: joi.number().port().required(),
		ORDERS_MICROSERVICE_HOST: joi.string().hostname().required(),
		ORDERS_MICROSERVICE_PORT: joi.number().port().required(),
	})
	.unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
	throw new Error(`Environment validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
	port: envVars.PORT,
	productsMicroserviceHost: envVars.PRODUCTS_MICROSERVICE_HOST,
	productsMicroservicePort: envVars.PRODUCTS_MICROSERVICE_PORT,
	ordersMicroserviceHost: envVars.ORDERS_MICROSERVICE_HOST,
	ordersMicroservicePort: envVars.ORDERS_MICROSERVICE_PORT,
};
