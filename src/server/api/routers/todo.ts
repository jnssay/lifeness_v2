import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        text: z.string().min(1),
        category: z.string(),
        dueDate: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          text: input.text,
          category: input.category,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
        },
      });
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.db.todo.findUnique({
        where: { id: input.id },
      });
      return ctx.db.todo.update({
        where: { id: input.id },
        data: { completed: !todo?.completed },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.delete({
        where: { id: input.id },
      });
    }),

  edit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string().min(1).optional(),
        category: z.string().optional(),
        dueDate: z.string().nullable().optional(),
        notes: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.update({
        where: { id: input.id },
        data: {
          text: input.text,
          category: input.category,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          notes: input.notes,
        },
      });
    }),
});
