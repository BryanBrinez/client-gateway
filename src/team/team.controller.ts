import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { firstValueFrom } from 'rxjs';
import { CreateTeamMemberDto } from './dto/create-teamMember.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('team')
export class TeamController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    try {
      const teams = await firstValueFrom(
        this.client.send({ cmd: 'create_team' }, createTeamDto),
      );
      return teams;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const teams = await firstValueFrom(
        this.client.send({ cmd: 'find_all_teams' }, paginationDto),
      );
      return teams;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const team = await firstValueFrom(
        this.client.send({ cmd: 'find_one_team' }, id),
      );
      return team;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    try {
      const taskUpdated = await firstValueFrom(
        this.client.send(
          { cmd: 'update_team' },
          {
            id,
            ...updateTeamDto,
          },
        ),
      );
      return taskUpdated;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const team = await firstValueFrom(
        this.client.send({ cmd: 'remove_team' }, id),
      );
      return team;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post(':teamId/members')
  async addMember(
    @Param('teamId') teamId: string,
    @Body() CreateTeamMemberDto: CreateTeamMemberDto,
  ) {
    try {
      const member = await firstValueFrom(
        this.client.send(
          { cmd: 'add_member' },
          { teamId, ...CreateTeamMemberDto },
        ),
      );
      return member;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':teamId/members')
  async findMembers(@Param('teamId') teamId: string) {
    try {
      const member = await firstValueFrom(
        this.client.send({ cmd: 'find_members' }, teamId),
      );
      return member;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':teamId/members/:memberId')
  async removeMember(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
  ) {
    try {
      const member = await firstValueFrom(
        this.client.send({ cmd: 'remove_member' }, { teamId, memberId }),
      );
      return member;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
