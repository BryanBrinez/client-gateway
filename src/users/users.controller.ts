import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NATS_SERVICE } from 'src/config/services';

@Controller('users')
export class UsersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await firstValueFrom(
        this.client.send({ cmd: 'create_user' }, createUserDto),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAllUser(@Query() paginationDto: PaginationDto) {
    try {
      const user = await firstValueFrom(
        this.client.send({ cmd: 'find_all_user' }, paginationDto),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findOneUser(@Param('id') id: string) {
    try {
      const user = await firstValueFrom(
        this.client.send({ cmd: 'find_one_user' }, { id }),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const userUpdated = await firstValueFrom(
        this.client.send(
          { cmd: 'update_user' },
          {
            id,
            ...updateUserDto,
          },
        ),
      );
      return userUpdated;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    try {
      const user = await firstValueFrom(
        this.client.send({ cmd: 'delete_user' }, { id }),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
