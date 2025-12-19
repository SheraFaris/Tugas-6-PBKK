import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { handlePrismaError } from '../common/prisma-error.handler';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const posts = await this.prisma.post.findMany({
        where: {
          replyToId: null,
        },
        include: {
          replies: {
            include: {
              replies: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return posts;
    } catch (error) {
      handlePrismaError(error, 'fetch posts');
    }
  }

  async findOne(id: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        include: {
          replies: {
            include: {
              replies: true,
            },
          },
          replyTo: true,
        },
      });

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      return post;
    } catch (error) {
      handlePrismaError(error, 'fetch post');
    }
  }

  async findReplies(id: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      const replies = await this.prisma.post.findMany({
        where: {
          replyToId: id,
        },
        include: {
          replies: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return replies;
    } catch (error) {
      handlePrismaError(error, 'fetch replies');
    }
  }

  async create(createPostDto: CreatePostDto) {
    try {
      // If it's a reply, verify the parent post exists
      if (createPostDto.replyToId) {
        const parentPost = await this.prisma.post.findUnique({
          where: { id: createPostDto.replyToId },
        });

        if (!parentPost) {
          throw new NotFoundException(
            `Parent post with ID ${createPostDto.replyToId} not found`,
          );
        }
      }

      const post = await this.prisma.post.create({
        data: createPostDto,
        include: {
          replies: true,
          replyTo: true,
        },
      });

      return post;
    } catch (error) {
      handlePrismaError(error, 'create post');
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      const updatedPost = await this.prisma.post.update({
        where: { id },
        data: updatePostDto,
        include: {
          replies: true,
          replyTo: true,
        },
      });

      return updatedPost;
    } catch (error) {
      handlePrismaError(error, 'update post');
    }
  }

  async remove(id: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      await this.prisma.post.delete({
        where: { id },
      });

      return;
    } catch (error) {
      handlePrismaError(error, 'delete post');
    }
  }
}
