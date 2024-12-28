import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { create } from 'domain';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NATS_SERVICE } from 'src/config/services';



@Controller('users')
export class UsersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }



  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.client.send({ cmd: 'create_user' }, createUserDto);
  }


  @Get()
  findAllUser(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'find_all_user' }, paginationDto);
  }

  @Get(':id')
  async findOneUser(@Param('id') id: string) {

    try {


      const user = await firstValueFrom(
        this.client.send({ cmd: 'find_one_user' }, { id })
      )
      return user;

    } catch (error) {
      throw new RpcException(error)
    }

  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto) {

    try {
      const userUpdated = await firstValueFrom(this.client.send({ cmd: 'update_user' }, {
        id,
        ...updateUserDto
      }))
      return userUpdated

    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.client.send({ cmd: 'delete_user' }, {id} );
  }
}
