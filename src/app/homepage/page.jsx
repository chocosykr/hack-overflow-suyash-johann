'use client';
import HomeNav from '@/components/HomeNav';
import IssueFilterBar from '@/components/IssueFilterBar';
import React from 'react';

export default function Page() {
  return (
    <div>
        <HomeNav/>
        <IssueFilterBar/>
    </div>
  );
}