import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PRODUCTS_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
	constructor(
		@Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
	) {}

	@Post()
	createProduct(@Body() createProductDto: CreateProductDto) {
		return this.productsClient.send(
			{ cmd: 'create_product' },
			createProductDto,
		);
	}

	@Get()
	findAllProducts(@Query() pagination: PaginationDto) {
		return this.productsClient.send({ cmd: 'find_all_products' }, pagination);
	}

	@Get(':id')
	findProductById(@Param('id', ParseIntPipe) id: number) {
		return this.productsClient.send({ cmd: 'find_one_product' }, { id }).pipe(
			catchError((err) => {
				throw new RpcException(err);
			}),
		);
	}

	@Patch(':id')
	updateProduct(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateProductDto: UpdateProductDto,
	) {
		return this.productsClient
			.send({ cmd: 'update_product' }, { id, ...updateProductDto })
			.pipe(
				catchError((err) => {
					throw new RpcException(err);
				}),
			);
	}

	@Delete(':id')
	deleteProduct(@Param('id', ParseIntPipe) id: number) {
		return this.productsClient.send({ cmd: 'delete_product' }, { id }).pipe(
			catchError((err) => {
				throw new RpcException(err);
			}),
		);
	}
}
