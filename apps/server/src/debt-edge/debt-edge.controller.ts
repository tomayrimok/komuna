import { Controller, Get, Query } from '@nestjs/common';
import { DebtEdgeService } from './debt-edge.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { DebtEdge } from './debt-edge.entity';
import { DebtEdgeWithDebtor } from './dto/debt-edge.dto';
import { UseAuth } from '../decorators/UseAuth';
import { User } from '../decorators/User';
import { UserJwtPayload } from '../user/dto/jwt-user.dto';

@Controller('debt-edge')
export class DebtEdgeController {
  constructor(private readonly debtEdgeService: DebtEdgeService) { }

  @Get('user-balance-details')
  @UseAuth()
  @ApiOkResponse({ type: [DebtEdgeWithDebtor] })
  async getUserBalanceDetails(@User() user: UserJwtPayload, @Query('apartmentId') apartmentId: string) {
    return await this.debtEdgeService.getUserBalanceDetails(apartmentId, user.userId);
  }

  @Get('user-balance')
  @UseAuth()
  @ApiOkResponse({ type: Number })
  async getUserBalance(@User() user: UserJwtPayload, @Query('apartmentId') apartmentId: string) {
    return await this.debtEdgeService.getUserBalance(apartmentId, user.userId);
  }

  @Get('debt-details')
  @ApiOkResponse({ type: DebtEdge }) // Adjust the type as necessary
  async getDebtDetails(@Query('debtId') debtId: string) {
    return await this.debtEdgeService.getDebtDetails(debtId);
  }
}
