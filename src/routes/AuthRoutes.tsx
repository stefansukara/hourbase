import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { AuthForm } from '../features/auth/components/AuthForm';

export const AuthRoutes: React.FC = () => (
  <Routes>
    <Route
      path="/auth"
      element={
        <AuthLayout>
          <AuthForm />
        </AuthLayout>
      }
    />
    <Route path="*" element={<Navigate to="/auth" replace />} />
  </Routes>
);
