import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    console.log("🚀 ~ context:", context)
    const ctx = GqlExecutionContext.create(context);
    console.log("🚀 ~ ctx:", ctx.getContext().req.user)
    
    return ctx.getContext().req.user;
  },
);