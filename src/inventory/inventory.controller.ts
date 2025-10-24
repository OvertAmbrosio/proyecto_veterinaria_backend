import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { PurchaseDto } from './dto/purchase.dto';
import { ConsumeDto } from './dto/consume.dto';
import { AdjustDto } from './dto/adjust.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inv: InventoryService) {}

  @Post('purchase')
  @HttpCode(HttpStatus.CREATED)
  purchase(@Body() dto: PurchaseDto) {
    return this.inv.purchase(dto);
  }

  @Post('consume')
  @HttpCode(HttpStatus.OK)
  consume(@Body() dto: ConsumeDto) {
    return this.inv.consume(dto);
  }

  @Post('adjust')
  @HttpCode(HttpStatus.OK)
  adjust(@Body() dto: AdjustDto) {
    return this.inv.adjust(dto);
  }

  @Get('stock/:productId')
  stock(@Param('productId', ParseIntPipe) productId: number) {
    return this.inv.stock(productId);
  }

  @Get('batches/:productId')
  batches(@Param('productId', ParseIntPipe) productId: number) {
    return this.inv.batches(productId);
  }
}
