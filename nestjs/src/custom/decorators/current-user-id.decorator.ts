import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { JwtPayload } from "src/models/types";

export const GetCurrentUserId = createParamDecorator(
    (data: unknown, context: ExecutionContext): number => {
        const request = context.switchToHttp().getRequest()
        const user = request.user as JwtPayload
        return user.sub
    }
)