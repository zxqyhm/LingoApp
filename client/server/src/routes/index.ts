import { Router } from 'express';
import authRouter from './auth';
import postsRouter from './posts';
import commentsRouter from './comments';
import likesRouter from './likes';
import followsRouter from './follows';
import conversationsRouter from './conversations';
import messagesRouter from './messages';
import uploadRouter from './upload';
import groupsRouter from './groups';
import locationRouter from './location';
import gamificationRouter from './gamification';

const router = Router();

// 挂载各个路由模块
router.use('/auth', authRouter);
router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);
router.use('/likes', likesRouter);
router.use('/follows', followsRouter);
router.use('/conversations', conversationsRouter);
router.use('/messages', messagesRouter);
router.use('/upload', uploadRouter);
router.use('/groups', groupsRouter);
router.use('/location', locationRouter);
router.use('/gamification', gamificationRouter);

export default router;
