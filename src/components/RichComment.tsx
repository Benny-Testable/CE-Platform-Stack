'use client';

import React from 'react';

interface RichCommentProps {
  initialComment: string;
}

export default function RichComment({ initialComment }: RichCommentProps) {
  // INTENTIONAL SAST BENCHMARK FIXTURE: CWE-79 XSS via dangerouslySetInnerHTML
  return (
    <div style={{ marginTop: '16px', background: '#fffbeb', padding: '12px', border: '1px solid #fef3c7' }}>
      <h5>User Rich Markup (Unsanitized)</h5>
      <div dangerouslySetInnerHTML={{ __html: initialComment }} />
    </div>
  );
}
