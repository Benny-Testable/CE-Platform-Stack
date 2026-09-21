import { Router, Request, Response } from 'express';
import { readReportFile } from '../../benchmark-fixtures/security/unsafeFileAccess';

const router = Router();

router.get('/download', (req: Request, res: Response) => {
  const filename = req.query.file as string;
  try {
    const content = readReportFile(filename);
    res.send(content);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export { router as fileRoutes };
