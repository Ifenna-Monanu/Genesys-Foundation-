import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserDTOResponse } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDTO } from 'src/common/dtos/response.dto';

@Controller('users')
@ApiTags('user')

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Endpoint to retieve all exiting users'
  })
  @ApiOkResponse({
    description: 'fetched all users successfully',
    type: [UserDTOResponse]
  })
  @ApiBadRequestResponse({
    description: 'Credentials is invalid',
    type: ErrorResponseDTO
  })
  findAll() {
    return this.usersService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Endpoint to retieve all exiting user'
  })
  @ApiOkResponse({
    description: 'fetched a user successfully',
    type: UserDTOResponse
  })
  @ApiBadRequestResponse({
    description: 'Credentials is invalid',
    type: ErrorResponseDTO
  })
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({_id: id});
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update({_id: id}, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove({_id: id});
  }
}
