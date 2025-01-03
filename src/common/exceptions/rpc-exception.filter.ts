
import { Catch, RpcExceptionFilter, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class ExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const rpcError = exception.getError();

    if(
        typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError
    ) {
        const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;
        return response.status(status).json(rpcError)
    }

    response.status(401).json({
        statusCode: 409,
        message: rpcError,
    })

  }
}
