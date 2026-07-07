import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import GuestRoute from "./components/GuestRoute";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import SupabaseStatus from "./components/SupabaseStatus";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NoteViewPage from "./pages/NoteViewPage";

const NoteEditorPage = lazy(() => import("./pages/NoteEditorPage"));

function EditorRoute({ mode }) {
  return (
    <Suspense
      fallback={
        <section className="note-editor-page container page-center">
          <p className="muted">Loading editor…</p>
        </section>
      }
    >
      <NoteEditorPage mode={mode} />
    </Suspense>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Layout>
              <SupabaseStatus />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notes/new"
                  element={
                    <ProtectedRoute>
                      <EditorRoute mode="new" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notes/:noteId/edit"
                  element={
                    <ProtectedRoute>
                      <EditorRoute />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notes/:noteId"
                  element={
                    <ProtectedRoute>
                      <NoteViewPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
