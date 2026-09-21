import React from 'react';
import NoticeWidget from '../components/NoticeWidget';

export default function Page() {
  return (
    <div>
      <p>Turborepo Next.js + NestJS Microservices Monorepo</p>
      <NoticeWidget initialHtml="<b>System Status:</b> All microservices healthy." />
    </div>
  );
}
