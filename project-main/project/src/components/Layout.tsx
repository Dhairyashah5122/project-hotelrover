import React from 'react';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}