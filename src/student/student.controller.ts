import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  getHello(): Object {
    return this.studentService.get_student()
  }
 
  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.studentService.get_student()
  }
 
  @Post()
  async createPost(@Body() post: string) {
    return this.studentService.get_student()
  }
 
  @Put(':id')
  async replacePost(@Param('id') id: string, @Body() post: string) {
    return this.studentService.get_student()
  }
 
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.studentService.get_student()
  }
}
