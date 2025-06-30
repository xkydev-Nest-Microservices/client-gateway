import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Inject,
	Query,
	ParseIntPipe,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { catchError } from 'rxjs';
import { ORDERS_SERVICE } from 'src/config';

@Controller('orders')
export class OrdersController {
	constructor(
		@Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
	) {}

	@Post()
	create(@Body() createOrderDto: CreateOrderDto) {
		return this.ordersClient.send('createOrder', createOrderDto);
	}

	@Get()
	findAll(@Query() pagination: PaginationDto) {
		return this.ordersClient.send('findAllOrders', pagination);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.ordersClient.send('findOneOrder', { id }).pipe(
			catchError((err) => {
				throw new RpcException(err);
			}),
		);
	}
}
