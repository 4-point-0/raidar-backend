import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function CommonApiResponse(returnType: any) {
  return applyDecorators(
    ApiResponse({ status: 200, type: returnType }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
    ApiResponse({ status: 404, description: 'Not found' }),
    ApiResponse({ status: 500, description: 'Server error' }),
  );
}
