import { ApiProperty } from '@nestjs/swagger';
import { DebtEdge } from '../debt-edge.entity';

export class DebtEdgeWithDebtor extends DebtEdge {
  @ApiProperty({
    description: 'ID of the user who is considered the debtor in this edge',
    example: 'user123',
  })
  debtor: string;
}
