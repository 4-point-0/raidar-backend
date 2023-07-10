import { Request } from 'express';
import { User } from '../../modules/user/user.entity';

export type AuthRequest = Request & { user: User };
